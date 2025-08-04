import { api } from "@/api/client";
import { FormField } from "@/components";
import { CustomButton } from "@/components/Form/CustomButton";
import images from "@/constants/images";
import { clearTokens, getRefreshToken, saveTokens } from "@/utils/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "./hooks/useLogin";
import { loginSchema, LoginSchema } from "./validation/loginSchema";

export function Login() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const tryRefresh = async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return; // No refresh token, stay on login

      try {
        // Attempt to refresh tokens
        const res = await api.post("/accounts/v1/token/refresh/", {
          refresh: refreshToken,
        });
        const { access } = res.data;
        await saveTokens(access, refreshToken);
        router.replace("/(root)/dashboard");
      } catch {
        await clearTokens();
        // Stay on login
      }
    };
    tryRefresh();
  }, []);

  const onSubmit = (data: LoginSchema) => {
    login(data, {
      onSuccess: () => router.replace("/(root)/dashboard"),
      onError: (err: any) => {
        let message = "Something went wrong. Please try again.";

        // Axios error with response
        if (err?.response?.status) {
          const status = err.response.status;

          if (status === 400) {
            message = "Invalid input. Please check your email or password.";
          } else if (status === 401) {
            message = "Incorrect email or password.";
          } else if (status === 403) {
            message = "You are not authorized to access this resource.";
          } else if (status === 500) {
            message = "Server error. Please try again later.";
          }
        }

        Alert.alert("Login Failed", message);
      },
    });
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 justify-center items-center px-4 gap-8">
              <View className="flex flex-col gap-4 items-center">
                <Image source={images.logo1} className="w-32 h-32" />
                <Text className="text-4xl font-pbold text-white">Sign In</Text>
              </View>

              <View className="w-full flex flex-col gap-4">
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
                      type="password"
                      value={value}
                      handleChangeText={onChange}
                      error={errors.password?.message}
                    />
                  )}
                />
                <CustomButton
                  title="Sign In"
                  handlePress={handleSubmit(onSubmit)}
                  isLoading={isPending}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <Text className="text-lightgray text-center mb-4 font-pthin absolute bottom-4 w-full">
        For the people by the people
      </Text>
    </SafeAreaView>
  );
}
