import React, { useContext, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Alert } from "react-native";
import { z } from "zod";

import {
  FormField,
  FormSection,
  FormWizard,
  SelectBottomSheet,
} from "@/components";
import { useApiMutation } from "@/hooks/useApiMutation";
import AltLayoutRouteContext from "@/layouts/AltLayout/context/AltLayoutRoute.context";
import { router } from "expo-router";

import {
  DonationCreateSchema,
  donationCreateSchema,
  DonationEditSchema,
  donationEditSchema,
  DonationSchemaWithId,
} from "./donation.schema";

type Props = { initialData?: DonationSchemaWithId };

export function DonationForm({ initialData }: Props) {
  const { setRoutePath } = useContext(AltLayoutRouteContext);

  const isEdit = Boolean(initialData);
  const schema = isEdit ? donationEditSchema : donationCreateSchema;

  useEffect(() => {
    setRoutePath(isEdit ? "Donations / Edit" : "Donations / New");
  }, [isEdit, setRoutePath]);

  const { mutate: saveDonation, isPending } = useApiMutation(
    isEdit ? "patch" : "post",
    isEdit
      ? `/donations/v1/donations/${initialData?.id}/`
      : "/donations/v1/donations/"
  );

  const onSubmit = (data: DonationCreateSchema | DonationEditSchema) => {
    saveDonation(data, {
      onSuccess: () => {
        if (isEdit) router.back();
        router.replace("/donations" as any);
        Alert.alert(
          "Success",
          `Donation ${isEdit ? "updated" : "created"} successfully`
        );
      },
      onError: (err: unknown) => {
        console.error("Create Donation Error:", err);
        Alert.alert(
          "Error",
          `Failed to ${isEdit ? "update" : "create"} donation`
        );
      },
    });
  };

  const defaults: z.infer<typeof schema> = (initialData as any) ?? {
    type: "fund",
    amount: "",
    remarks: "",
    source_name: "",
    source_email: "",
    source_phone: "",
  };

  return (
    <FormWizard
      title={isEdit ? "Edit Donation" : "Create a new Donation"}
      schema={schema}
      defaultValues={defaults}
      submitLabel={
        isPending ? "Saving..." : isEdit ? "Update Donation" : "Create Donation"
      }
      onSubmit={onSubmit}
      steps={[
        {
          key: "donation",
          title: "Donation Details",
          description: "Information about the donation",
          fields: ["type", "amount", "remarks"], // ⬅️ per-step validation
          render: (methods) => (
            <FormSection
              title="Donation Details"
              description="Information about the donation"
            >
              <Controller
                control={methods.control}
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
                control={methods.control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Amount"
                    placeholder="Enter amount"
                    value={value as any}
                    type="number"
                    handleChangeText={onChange}
                    error={
                      methods.formState.errors.amount?.message as
                        | string
                        | undefined
                    }
                  />
                )}
              />

              <Controller
                control={methods.control}
                name="remarks"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Remarks"
                    placeholder="Enter remarks"
                    value={value as any}
                    handleChangeText={onChange}
                    error={
                      methods.formState.errors.remarks?.message as
                        | string
                        | undefined
                    }
                  />
                )}
              />
            </FormSection>
          ),
        },
        {
          key: "donor",
          title: "Donor Details",
          description: "Basic information of the donor",
          fields: ["source_name", "source_email", "source_phone"], // ⬅️ per-step validation
          render: (methods) => (
            <FormSection
              title="Donor Details"
              description="Basic information of the donor"
            >
              <Controller
                control={methods.control}
                name="source_name"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Name"
                    placeholder="Enter name"
                    value={value as any}
                    handleChangeText={onChange}
                    error={
                      methods.formState.errors.source_name?.message as
                        | string
                        | undefined
                    }
                  />
                )}
              />

              <Controller
                control={methods.control}
                name="source_email"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Email"
                    placeholder="Enter email"
                    type="email"
                    value={value as any}
                    handleChangeText={onChange}
                    error={
                      methods.formState.errors.source_email?.message as
                        | string
                        | undefined
                    }
                  />
                )}
              />

              <Controller
                control={methods.control}
                name="source_phone"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    title="Phone Number"
                    placeholder="Enter phone number"
                    type="phone"
                    value={value as any}
                    handleChangeText={onChange}
                    error={
                      methods.formState.errors.source_phone?.message as
                        | string
                        | undefined
                    }
                  />
                )}
              />
            </FormSection>
          ),
        },
      ]}
    />
  );
}
