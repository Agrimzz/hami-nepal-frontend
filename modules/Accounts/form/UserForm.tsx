import { API_BASE_URL } from "@/api/client";
import {
  FormField,
  FormSection,
  FormWizard,
  SelectBottomSheet,
} from "@/components";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import AltLayoutRouteContext from "@/layouts/AltLayout/context/AltLayoutRoute.context";
import { RoleSchemaWithId } from "@/modules/Roles/form/roleSchema";
import { getAccessToken } from "@/utils/storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  UserCreateSchema,
  UserEditSchema,
  UserSchemaWithId,
  userCreateSchema,
  userEditSchema,
} from "./userSchema";

type UserFormProps = { initialData?: UserSchemaWithId };

export function UserForm({ initialData }: UserFormProps) {
  const { setRoutePath } = useContext(AltLayoutRouteContext);

  const isEdit = Boolean(initialData);
  const schema = isEdit ? userEditSchema : userCreateSchema;

  const normalize = (v: any) => (v == null ? "" : v);

  const defaults = ((): UserCreateSchema | UserEditSchema => {
    if (initialData) {
      return {
        ...initialData,
        full_name: normalize(initialData.full_name),
        email: normalize(initialData.email),
        phone_number: normalize(initialData.phone_number),
        address: normalize(initialData.address),
        city: normalize(initialData.city),
        state: normalize(initialData.state),
        country: normalize(initialData.country),
        zip_code: normalize(initialData.zip_code),
        skills: normalize(initialData.skills),
        bio: normalize(initialData.bio),
        profile_picture_id: normalize(initialData.profile_picture?.id),
        group_ids: initialData?.groups?.map((g) => g.id) ?? [],
        user_type: initialData?.user_type ?? "volunteer",
      } as any;
    }
    return {
      full_name: "",
      email: "",
      password: "",
      phone_number: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
      skills: "",
      bio: "",
      profile_picture_id: "",
      group_ids: [],
      user_type: "volunteer",
    } as any;
  })();

  useEffect(() => {
    setRoutePath(isEdit ? "Users / Edit" : "Users / New");
  }, [isEdit, setRoutePath]);

  const { data: roles } = useApiQuery<RoleSchemaWithId[]>(
    ["roles"],
    "/accounts/v1/groups/"
  );

  const rolesOptions =
    roles?.map((r) => ({
      label: r.name,
      value: r.id, // keep number if your API expects number
    })) ?? [];

  const { mutate: saveUser, isPending } = useApiMutation(
    isEdit ? "patch" : "post",
    isEdit ? `/accounts/v1/users/${initialData?.id}/` : "/accounts/v1/users/"
  );

  const onSubmit = (data: UserCreateSchema | UserEditSchema) => {
    saveUser(data, {
      onSuccess: () => {
        if (isEdit) router.back();
        router.replace("/accounts");
        Alert.alert(
          "Success",
          `User ${isEdit ? "updated" : "created"} successfully`
        );
      },
      onError: (err: unknown) => {
        console.error("Create User Error:", err);
        Alert.alert("Error", `Failed to ${isEdit ? "update" : "create"} user`);
      },
    });
  };

  // local image preview state (outside RHF)
  const [previewUri, setPreviewUri] = useState<string | null>(
    initialData?.profile_picture?.file ?? null
  );

  // ---- Step defs (typed by schema) ----
  const steps = useMemo(() => {
    return [
      {
        key: "profile-image",
        title: "Profile Image",
        description: "Upload a profile picture for the user",
        fields: [], // no required fields here
        render: (methods: any) => (
          <View className="gap-2">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-white font-pbold text-lg">
                Profile Image
              </Text>
              <Text className="text-xs text-lightgray font-pbold">
                Upload a profile picture
              </Text>
            </View>

            <Controller
              control={methods.control}
              name="profile_picture_id"
              render={({ field }) => (
                <View className="relative">
                  <Pressable
                    onPress={async () => {
                      try {
                        const token = await getAccessToken();
                        const result =
                          await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            quality: 0.7,
                            allowsEditing: true,
                            aspect: [1, 1],
                          });
                        if (!result.canceled) {
                          const uri = result.assets[0].uri;
                          setPreviewUri(uri);

                          const formData = new FormData();
                          formData.append("file", {
                            uri,
                            type: "image/jpeg",
                            name: `image_${Date.now()}.jpg`,
                          } as any);
                          formData.append("file_type", "profile");

                          const res = await fetch(
                            `${API_BASE_URL}/filehandler/v1/upload/`,
                            {
                              method: "POST",
                              body: formData,
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                          const data = await res.json();
                          methods.setValue(
                            "profile_picture_id",
                            data?.[0]?.id ?? ""
                          );
                        }
                      } catch (e) {
                        console.error("Upload error:", e);
                        setPreviewUri(null);
                        methods.setValue("profile_picture_id", "");
                        Alert.alert("Error", "Image upload failed");
                      }
                    }}
                    className="items-center justify-center rounded-xl h-56 bg-white/5 border border-white/5"
                  >
                    {previewUri ? (
                      <Image
                        source={{ uri: previewUri }}
                        className="w-full h-full rounded-xl"
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-lightgray font-psemibold">
                        Tap to select an image
                      </Text>
                    )}
                  </Pressable>

                  {previewUri && (
                    <TouchableOpacity
                      onPress={() => {
                        setPreviewUri(null);
                        field.onChange("");
                        methods.setValue("profile_picture_id", "");
                      }}
                      className="absolute top-2 right-2 bg-black/60 p-2 rounded-full"
                    >
                      <X size={18} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          </View>
        ),
      },
      {
        key: "personal",
        title: "Personal Details",
        description: "Basic user information",
        fields: isEdit
          ? ["full_name", "email", "phone_number"]
          : ["full_name", "email", "password", "phone_number"],
        render: (methods: any) => (
          <FormSection title="Personal Details" description="Basic info">
            <Controller
              control={methods.control}
              name="full_name"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Full Name"
                  placeholder="Enter full name"
                  value={value}
                  handleChangeText={onChange}
                  error={methods.formState.errors.full_name?.message}
                />
              )}
            />

            <Controller
              control={methods.control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Email"
                  placeholder="Enter email"
                  type="email"
                  value={value}
                  handleChangeText={onChange}
                  error={methods.formState.errors.email?.message}
                />
              )}
            />

            {!isEdit && (
              <Controller
                control={methods.control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Password"
                    placeholder="******"
                    value={value}
                    type="password"
                    handleChangeText={onChange}
                    error={methods.formState.errors.password?.message}
                  />
                )}
              />
            )}

            <Controller
              control={methods.control}
              name="phone_number"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Phone Number"
                  placeholder="Enter phone number"
                  value={value}
                  handleChangeText={onChange}
                  error={methods.formState.errors.phone_number?.message}
                  type="phone"
                />
              )}
            />
          </FormSection>
        ),
      },
      {
        key: "address",
        title: "Address",
        description: "Residential details",
        fields: ["address", "city", "state", "country", "zip_code"],
        render: (methods: any) => (
          <FormSection title="Address" description="Residential details">
            <Controller
              control={methods.control}
              name="address"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Address"
                  placeholder="Enter street address"
                  value={value}
                  handleChangeText={onChange}
                  error={methods.formState.errors.address?.message}
                />
              )}
            />

            <Controller
              control={methods.control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="City"
                  placeholder="Enter city"
                  value={value}
                  handleChangeText={onChange}
                  error={methods.formState.errors.city?.message}
                />
              )}
            />

            <Controller
              control={methods.control}
              name="state"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="State"
                  placeholder="Enter state"
                  value={value}
                  handleChangeText={onChange}
                  error={methods.formState.errors.state?.message}
                />
              )}
            />

            <Controller
              control={methods.control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Country"
                  placeholder="Enter country"
                  value={value}
                  handleChangeText={onChange}
                  error={methods.formState.errors.country?.message}
                />
              )}
            />

            <Controller
              control={methods.control}
              name="zip_code"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Zip Code"
                  placeholder="Enter zip code"
                  type="number"
                  value={value}
                  handleChangeText={onChange}
                  error={methods.formState.errors.zip_code?.message}
                />
              )}
            />
          </FormSection>
        ),
      },
      {
        key: "profile",
        title: "Profile",
        description: "Background information",
        fields: [], // optional fields
        render: (methods: any) => (
          <FormSection title="Profile" description="Background information">
            <Controller
              control={methods.control}
              name="skills"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Skills"
                  placeholder="e.g. React, Node.js"
                  value={value}
                  handleChangeText={onChange}
                  error={methods.formState.errors.skills?.message}
                />
              )}
            />

            <Controller
              control={methods.control}
              name="bio"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Bio"
                  placeholder="Short bio about the user"
                  value={value}
                  handleChangeText={onChange}
                  error={methods.formState.errors.bio?.message}
                />
              )}
            />
          </FormSection>
        ),
      },
      {
        key: "roles",
        title: "Role Assignment",
        description: "Assign type and roles",
        fields: ["user_type"], // group_ids optional (can enforce if needed)
        render: (methods: any) => (
          <FormSection
            title="Role Assignment"
            description="Assign type and roles"
          >
            <Controller
              control={methods.control}
              name="user_type"
              render={({ field }) => (
                <SelectBottomSheet
                  options={[
                    { label: "Admin", value: "admin" },
                    { label: "Staff", value: "staff" },
                    { label: "Volunteer", value: "volunteer" },
                    { label: "Donor", value: "donor" },
                  ]}
                  value={field.value}
                  placeholder="Select user type"
                  title="Choose type"
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />

            <Controller
              control={methods.control}
              name="group_ids"
              render={({ field: { onChange, value } }) => (
                <SelectBottomSheet
                  options={rolesOptions}
                  value={value}
                  placeholder="Select role(s)"
                  title="Choose Role"
                  multiple
                  onChange={(val) => onChange(val)}
                />
              )}
            />
          </FormSection>
        ),
      },
    ];
  }, [isEdit, rolesOptions, initialData, previewUri]);

  return (
    <FormWizard
      title={isEdit ? "Update User" : "Create User"}
      schema={schema}
      defaultValues={defaults as any}
      steps={steps as any}
      submitLabel={isEdit ? "Update User" : "Create User"}
      onSubmit={onSubmit}
      stickyFooter
      unregisterOnExit={false}
    />
  );
}
