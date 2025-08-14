import { CustomButton, FormField } from "@/components";
import images from "@/constants/images";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Ellipsis } from "lucide-react-native";
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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateUser } from "../hooks/useCreateUser";
import { userSchema, UserSchema } from "./userSchema";

export function UserForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: createCause, isPending } = useCreateUser();

  const onSubmit = (data: UserSchema) => {
    createCause(data, {
      onSuccess: () => {
        router.replace("/user");

        Alert.alert("Success", "User created successfully");
      },
      onError: (err: any) => {
        console.error("Create User Error:", err);
        Alert.alert("Error", "Failed to create cause");
      },
    });
  };

  return (
    <SafeAreaView className="h-full bg-background">
      {/* Header */}
      <View className="w-full flex flex-row items-center justify-between p-4 ">
        <Pressable onPress={() => router.push("/dashboard")}>
          <Image source={images.logo1} className="w-14 h-14 rounded-full" />
        </Pressable>
        <Text className="text-sm font-plight text-white">User</Text>
        <View className="flex items-center justify-center bg-gray rounded-2xl w-14 h-14">
          <Ellipsis size={16} color="#F1F1F1" />
        </View>
      </View>
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
                name="full_name"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Full Name"
                    placeholder="Enter your full name"
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
                    placeholder="Enter your email"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Password"
                    placeholder="******"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.password?.message}
                  />
                )}
              />

              <CustomButton
                title="Create Cause"
                handlePress={handleSubmit(onSubmit)}
                isLoading={isPending}
                containerStyles="mt-4"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
