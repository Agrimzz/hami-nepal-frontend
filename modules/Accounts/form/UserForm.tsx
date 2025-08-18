import { API_BASE_URL } from "@/api/client";
import { CustomButton, FormField, SelectBottomSheet } from "@/components";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import AltLayoutRouteContext from "@/layouts/AltLayout/context/AltLayoutRoute.context";
import { RoleSchemaWithId } from "@/modules/Roles/form/roleSchema";
import { getAccessToken } from "@/utils/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  UserCreateSchema,
  UserEditSchema,
  UserSchemaWithId,
  userCreateSchema,
  userEditSchema,
} from "./userSchema";

type UserFormProps = {
  initialData?: UserSchemaWithId;
};

export function UserForm({ initialData }: UserFormProps) {
  const { setRoutePath } = useContext(AltLayoutRouteContext);

  const [previewUri, setPreviewUri] = useState<string | null>(
    initialData?.profile_picture?.file ? initialData.profile_picture.file : null
  );

  useEffect(() => {
    setRoutePath(initialData ? "Users / Edit" : "Users / New");
  }, [initialData, setRoutePath]);

  const isEdit = Boolean(initialData);
  const schema = isEdit ? userEditSchema : userCreateSchema;

  const normalize = (value: any) => (value === null ? "" : value);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserCreateSchema | UserEditSchema>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
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
          profile_picture_id: normalize(initialData.profile_picture_id),
          group_ids: initialData?.groups?.map((group) => group.id) ?? [],
        }
      : {
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
        },
  });

  const { data: roles } = useApiQuery<RoleSchemaWithId[]>(
    ["roles"],
    "/accounts/v1/groups/"
  );

  const rolesOptions = roles?.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  const { mutate: saveUser, isPending } = useApiMutation(
    isEdit ? "patch" : "post",
    isEdit ? `/accounts/v1/users/${initialData?.id}/` : "/accounts/v1/users/"
  );

  const { mutate: uploadFile } = useApiMutation(
    "post",
    "/filehandler/v1/upload/"
  );

  const onSubmit = (data: UserCreateSchema | UserEditSchema) => {
    saveUser(data, {
      onSuccess: () => {
        isEdit && router.back();
        router.replace("/accounts");

        Alert.alert(
          "Success",
          `User ${isEdit ? "updated" : "created"} successfully`
        );
      },
      onError: (err: any) => {
        console.error("Create User Error:", err);
        Alert.alert("Error", `Failed to ${isEdit ? "update" : "create"} user`);
      },
    });
  };

  const handlePickImage = async () => {
    try {
      const token = await getAccessToken();
      const result = await ImagePicker.launchImageLibraryAsync({
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

        const res = await fetch(`${API_BASE_URL}/filehandler/v1/upload/`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        // update RHF value
        setValue("profile_picture_id", data[0].id);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setPreviewUri(null);
      setValue("profile_picture_id", "");
      Alert.alert("Error", "Image upload failed");
    }
  };

  // const pickImage = async (onChange: (uri: string) => void) => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     quality: 0.7,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //   });

  //   if (!result.canceled) {
  //     const uri = result.assets[0].uri;
  //     onChangeImage(uri);

  //     uploadFile.mutate(uri, {
  //       onSuccess: (id) => {
  //         onChangeId(id);
  //       },
  //       onError: () => {
  //         Alert.alert("Error", "Image upload failed");
  //         onChangeImage("");
  //         onChangeId(null);
  //       },
  //     });
  //   }
  // };

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
          <View className="px-6 py-4 gap-6 h-full ">
            {/* User Image */}
            <View className="gap-2">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-white font-pbold text-lg">
                  Profile Image
                </Text>
                <Text className="text-xs text-lightgray font-pbold">
                  Upload a profile picture for the user
                </Text>
              </View>

              {/* <Controller
                control={control}
                name="profile_picture_id"
                render={({
                  field: { onChange: setImageUri, value: previewUri },
                }) => (
                  <Controller
                    control={control}
                    name="profile_picture_id"
                    render={({ field: { onChange: setImageId } }) => (
                      <View className="relative">
                        <Pressable
                          onPress={async () => {
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
                              setImageUri(uri);

                              // const formData = new FormData();
                              // formData.append("file", {
                              //   uri,
                              //   name:
                              //     result.assets[0].fileName ||
                              //     `image_${Date.now()}.jpg`,
                              //   type: result.assets[0].type || "image/jpeg",
                              // } as any);
                              // formData.append("fileType", "profile");

                              const formData = new FormData();
                              formData.append("file", {
                                uri: uri,
                                type: "image/jpeg",
                                name: `${Date.now()}.jpg`,
                              } as any);
                              formData.append("file_type", "profile");

                              fetch(`${API_BASE_URL}/filehandler/v1/upload/`, {
                                method: "POST",
                                body: formData,
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                  // Include auth header if needed
                                  Authorization: `Bearer ${token}`,
                                },
                              })
                                .then((res) => res.json())
                                .then((data) => {
                                  setImageId(data[0].id);
                                })
                                .catch((err) => {
                                  console.error("Upload error:", err);
                                  setImageUri("");
                                  setImageId(null);
                                });

                              // uploadFile(formData, {
                              //   onSuccess: (data) => setImageId(data.id),
                              //   onError: (err: any) => {
                              //     console.error("Image Upload Error:", err);
                              //     Alert.alert("Error", "Image upload failed");
                              //     setImageUri("");
                              //     setImageId(null);
                              //   },
                              // });
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
                              setImageUri("");
                              setImageId(null);
                            }}
                            className="absolute top-2 right-2 bg-black/60 p-2 rounded-full"
                          >
                            <X size={18} color="white" />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  />
                )}
              /> */}

              <Controller
                control={control}
                name="profile_picture_id"
                render={({ field }) => (
                  <View className="relative">
                    <Pressable
                      onPress={handlePickImage}
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
                          field.onChange(null);
                          setValue("profile_picture_id", "");
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

            {/* Personal Details */}
            <View className="gap-2">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-white font-pbold text-lg">
                  Personal Details
                </Text>
                <Text className="text-xs text-lightgray font-pbold">
                  Basic user information
                </Text>
              </View>

              <Controller
                control={control}
                name="full_name"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Full Name"
                    placeholder="Enter full name"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.full_name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Email"
                    placeholder="Enter email"
                    type="email"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.email?.message}
                  />
                )}
              />

              {!isEdit && (
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <FormField
                      title="Password"
                      placeholder="******"
                      value={value}
                      type="password"
                      handleChangeText={onChange}
                      error={errors.password?.message}
                    />
                  )}
                />
              )}

              <Controller
                control={control}
                name="phone_number"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Phone Number"
                    placeholder="Enter phone number"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.phone_number?.message}
                    type="phone"
                  />
                )}
              />
            </View>

            {/* Address */}
            <View className="gap-2">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-white font-pbold text-lg">Address</Text>
                <Text className="text-xs text-lightgray font-pbold">
                  Residential details
                </Text>
              </View>

              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Address"
                    placeholder="Enter street address"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.address?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="City"
                    placeholder="Enter city"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.city?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="State"
                    placeholder="Enter state"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.state?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="country"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Country"
                    placeholder="Enter country"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.country?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="zip_code"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Zip Code"
                    placeholder="Enter zip code"
                    type="number"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.zip_code?.message}
                  />
                )}
              />
            </View>

            {/* Profile */}
            <View className="gap-2">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-white font-pbold text-lg">Profile</Text>
                <Text className="text-xs text-lightgray font-pbold">
                  Background information
                </Text>
              </View>

              <Controller
                control={control}
                name="skills"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Skills"
                    placeholder="e.g. React, Node.js"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.skills?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Bio"
                    placeholder="Short bio about the user"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.bio?.message}
                  />
                )}
              />
            </View>

            {/* Role Assignment */}
            <View className="gap-2">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-white font-pbold text-lg">
                  Role Assignment
                </Text>
                <Text className="text-xs text-lightgray font-pbold">
                  Assign one or more roles
                </Text>
              </View>

              <Controller
                control={control}
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
            </View>

            {/* Submit Button */}
            <CustomButton
              title={isEdit ? "Update User" : "Create User"}
              handlePress={handleSubmit(onSubmit)}
              isLoading={isPending}
              containerStyles="mt-4"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
