import { CustomButton, FormField } from "@/components";
import { useApiMutation } from "@/hooks/useApiMutation";
import AltLayoutRouteContext from "@/layouts/AltLayout/context/AltLayoutRoute.context";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  CauseCreateSchema,
  causeCreateSchema,
  CauseEditSchema,
  causeEditSchema,
  CauseSchemaWithId,
} from "./causeSchema";

export function CauseForm({
  initialData,
}: {
  initialData?: CauseSchemaWithId;
}) {
  const { setRoutePath } = useContext(AltLayoutRouteContext);
  console.log(initialData);

  const isEdit = Boolean(initialData);
  const schema = isEdit ? causeEditSchema : causeCreateSchema;

  useEffect(() => {
    setRoutePath(initialData ? "Causes / Edit" : "Causes / New");
  }, [initialData, setRoutePath]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CauseCreateSchema | CauseEditSchema>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      title: "",
      description: "",
      category: "",
      status: "",
    },
  });

  const { mutate: saveCause, isPending } = useApiMutation(
    isEdit ? "patch" : "post",
    isEdit ? `/causes/v1/causes/${initialData?.id}/` : "/causes/v1/causes/"
  );

  const onSubmit = (data: CauseCreateSchema | CauseEditSchema) => {
    saveCause(data, {
      onSuccess: () => {
        router.push("/causes");

        Alert.alert(
          "Success",
          `Cause ${isEdit ? "updated" : "created"} successfully`
        );
      },
      onError: (err: any) => {
        console.error("Create Cause Error:", err);
        Alert.alert("Error", `Failed to ${isEdit ? "update" : "create"} cause`);
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
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="px-6 py-4 gap-4">
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Title"
                  placeholder="Enter cause title"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.title?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Description"
                  placeholder="Enter cause description"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.description?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Category"
                  placeholder="Enter cause category"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.category?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Status"
                  placeholder="Enter cause status"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.status?.message}
                />
              )}
            />

            <CustomButton
              title="Create Cause"
              handlePress={handleSubmit(onSubmit)}
              isLoading={isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
