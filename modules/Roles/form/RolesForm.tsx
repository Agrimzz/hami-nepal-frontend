import { CustomButton, FormField } from "@/components";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import AltLayoutRouteContext from "@/layouts/AltLayout/context/AltLayoutRoute.context";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { PermissionSchema } from "./permissionSchema";
import { RoleSchema, roleSchema, RoleSchemaWithId } from "./roleSchema";

type RolesFormProps = {
  initialData?: RoleSchemaWithId;
};

export function RolesForm({ initialData }: RolesFormProps) {
  const { setRoutePath } = useContext(AltLayoutRouteContext);

  useEffect(() => {
    setRoutePath(initialData ? "Roles / Edit" : "Roles / New");
  }, [initialData]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData || {
      name: "",
      permissions: [],
    },
  });

  const { data: permissions, isLoading } = useApiQuery<PermissionSchema[]>(
    ["permissions"],
    "/accounts/v1/permissions/"
  );

  const isEdit = Boolean(initialData);

  const { mutate: saveRole, isPending } = useApiMutation(
    isEdit ? "put" : "post",
    isEdit ? `/accounts/v1/groups/${initialData?.id}/` : "/accounts/v1/groups/"
  );

  const selectedPermissions = watch("permissions");

  const togglePermission = (id: number) => {
    if (selectedPermissions.includes(id)) {
      setValue(
        "permissions",
        selectedPermissions.filter((p) => p !== id)
      );
    } else {
      setValue("permissions", [...selectedPermissions, id]);
    }
  };

  const onSubmit = (data: RoleSchema) => {
    saveRole(data, {
      onSuccess: () => {
        router.replace("/accounts/roles");
        Alert.alert(
          "Success",
          `Role ${isEdit ? "updated" : "created"} successfully`
        );
      },
      onError: (err: any) => {
        console.error("Role Error:", err);
        Alert.alert("Error", `Failed to ${isEdit ? "update" : "create"} role`);
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={{ flex: 1 }}
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center  bg-background">
            <View className="animate-spin">
              <LoaderCircle size={24} color="#F1F1F1" className="mx-auto " />
            </View>
          </View>
        ) : (
          <FlatList
            data={permissions}
            className="px-4"
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, gap: 4 }}
            renderItem={({ item }) => {
              const enabled = selectedPermissions.includes(item.id);
              return (
                <View className=" bg-white/5 rounded-xl p-2 flex-row justify-between items-center border border-white/5">
                  <Text className="text-xs font-pbold text-white flex-1">
                    {item.name}
                  </Text>
                  <Switch
                    value={enabled}
                    onValueChange={() => togglePermission(item.id)}
                    trackColor={{ true: "#CC343B", false: "#6b7280" }}
                    thumbColor={enabled ? "#E21B24" : "#374151"}
                  />
                </View>
              );
            }}
            ListHeaderComponent={
              <View className="">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <FormField
                      title="Role Name"
                      placeholder="Enter role name"
                      value={value}
                      handleChangeText={onChange}
                      error={errors.name?.message}
                    />
                  )}
                />
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-white font-pbold text-lg mt-4 mb-2">
                    Permissions
                  </Text>
                  <Text className="text-xs text-lightgray font-pbold">
                    Permissions this role should have
                  </Text>
                </View>
                {errors.permissions?.message && (
                  <Text className="text-red-500 text-sm mb-2">
                    {errors.permissions?.message}
                  </Text>
                )}
              </View>
            }
          />
        )}
        <View className="px-4">
          <CustomButton
            title={isEdit ? "Update Role" : "Create Role"}
            handlePress={handleSubmit(onSubmit)}
            isLoading={isPending}
            containerStyles="mt-4"
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
