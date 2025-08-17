import { CustomButton, FormField, SelectBottomSheet } from "@/components";
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
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  DonationCreateSchema,
  donationCreateSchema,
  DonationEditSchema,
  donationEditSchema,
  DonationSchemaWithId,
} from "./donation.schema";

export function DonationForm({
  initialData,
}: {
  initialData?: DonationSchemaWithId;
}) {
  const { setRoutePath } = useContext(AltLayoutRouteContext);

  const isEdit = Boolean(initialData);
  const schema = isEdit ? donationEditSchema : donationCreateSchema;

  useEffect(() => {
    setRoutePath(initialData ? "Donations / Edit" : "Donations / New");
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DonationCreateSchema | DonationEditSchema>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      type: "fund",
      amount: "",
    },
  });

  const { mutate: saveDonation, isPending } = useApiMutation(
    isEdit ? "patch" : "post",
    isEdit
      ? `/donations/v1/donations/${initialData?.id}/`
      : "/donations/v1/donations/"
  );

  const onSubmit = (data: DonationCreateSchema | DonationEditSchema) => {
    saveDonation(data, {
      onSuccess: () => {
        isEdit && router.back();
        router.replace("/donations" as any);

        Alert.alert(
          "Success",
          `Donation ${isEdit ? "updated" : "created"} successfully`
        );
      },
      onError: (err: any) => {
        console.error("Create Donation Error:", err);
        Alert.alert(
          "Error",
          `Failed to ${isEdit ? "update" : "create"} donation`
        );
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
          <View className="px-6 py-4 gap-6 h-full ">
            {/* User Image */}
            <View className="gap-2">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-white font-pbold text-lg">
                  Donation Details
                </Text>
                <Text className="text-xs text-lightgray font-pbold">
                  Add a donation
                </Text>
              </View>

              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <SelectBottomSheet
                    options={[
                      { label: "Fund", value: "fund" },
                      { label: "Kind", value: "kind" },
                    ]}
                    value={value}
                    placeholder="Select Type"
                    title="Type"
                    onChange={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Amount"
                    placeholder="Enter amount"
                    value={value}
                    type="decimal"
                    handleChangeText={onChange}
                    error={errors.amount?.message}
                  />
                )}
              />

              <CustomButton
                title="Save"
                handlePress={handleSubmit(onSubmit)}
                isLoading={isPending}
                containerStyles="mt-4"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
