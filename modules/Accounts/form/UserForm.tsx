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

  const { mutate: createUser, isPending } = useApiMutation(
    "post",
    "/accounts/v1/users/"
  );

  const { setRoutePath } = useContext(AltLayoutRouteContext);
  useEffect(() => {
    setRoutePath("Users / New");
  }, []);

  const onSubmit = (data: UserSchema) => {
    createUser(data, {
      onSuccess: () => {
        router.replace("/accounts");

        Alert.alert("Success", "User created successfully");
      },
      onError: (err: any) => {
        console.error("Create User Error:", err);
        Alert.alert("Error", "Failed to create user");
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
                  type="password"
                  handleChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />

            <CustomButton
              title="Create User"
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
