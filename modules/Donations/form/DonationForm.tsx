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
      remarks: "",
      source_name: "",
      source_email: "",
      source_phone: "",
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
                  Information about the donation
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
                    type="number"
                    handleChangeText={onChange}
                    error={errors.amount?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="remarks"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Remarks"
                    placeholder="Enter remarks"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.remarks?.message}
                  />
                )}
              />
            </View>

            <View className="gap-2">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-white font-pbold text-lg">
                  Donor Details
                </Text>
                <Text className="text-xs text-lightgray font-pbold">
                  Basic information of the donor
                </Text>
              </View>

              <Controller
                control={control}
                name="source_name"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Name"
                    placeholder="Enter name"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.source_name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="source_email"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Email"
                    placeholder="Enter email"
                    value={value}
                    type="email"
                    handleChangeText={onChange}
                    error={errors.source_email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="source_phone"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Phone Number"
                    placeholder="Enter phone number"
                    value={value}
                    type="phone"
                    handleChangeText={onChange}
                    error={errors.source_phone?.message}
                  />
                )}
              />
            </View>
            <CustomButton
              title="Save"
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
