import { CustomButton, FormField } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
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
import { useCreateCause } from "../hooks/useCreateCuase";
import { causeSchema, CauseSchema } from "./causeSchema";

export function CauseForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CauseSchema>({
    resolver: zodResolver(causeSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      status: "",
    },
  });

  const { mutate: createCause, isPending } = useCreateCause();

  const onSubmit = (data: CauseSchema) => {
    createCause(data, {
      onSuccess: () => {
        router.push("/causes");

        Alert.alert("Success", "Cause created successfully");
      },
      onError: (err: any) => {
        console.error("Create Cause Error:", err);
        Alert.alert("Error", "Failed to create cause");
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
                  placeholder="*Enter cause description"
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
