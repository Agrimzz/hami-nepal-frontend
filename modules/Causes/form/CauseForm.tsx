import { FormField, FormSection, FormWizard } from "@/components";
import { useApiMutation } from "@/hooks/useApiMutation";
import AltLayoutRouteContext from "@/layouts/AltLayout/context/AltLayoutRoute.context";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "react-native";
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
        router.replace("/causes");

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
    <FormWizard
      title={isEdit ? "Edit Cause" : "Create a new Cause"}
      schema={schema}
      defaultValues={
        initialData || {
          title: "",
          description: "",
          category: "",
          status: "",
        }
      }
      submitLabel={
        isPending ? "Saving..." : isEdit ? "Update Cause" : "Create Cause"
      }
      onSubmit={onSubmit}
      renderSections={(methods) => (
        <FormSection
          title="Cause Details"
          description="Basic information of the cause"
        >
          <Controller
            control={methods.control}
            name="title"
            render={({ field }) => (
              <FormField
                {...field}
                title="Title"
                placeholder="Enter title"
                handleChangeText={field.onChange}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={methods.control}
            name="description"
            render={({ field }) => (
              <FormField
                {...field}
                title="Description"
                placeholder="Enter description"
                handleChangeText={field.onChange}
                error={errors.description?.message}
              />
            )}
          />

          <Controller
            control={methods.control}
            name="category"
            render={({ field }) => (
              <FormField
                {...field}
                title="Category"
                placeholder="Enter category"
                handleChangeText={field.onChange}
                error={errors.category?.message}
              />
            )}
          />

          <Controller
            control={methods.control}
            name="status"
            render={({ field }) => (
              <FormField
                {...field}
                title="Status"
                placeholder="Enter status"
                handleChangeText={field.onChange}
                error={errors.status?.message}
              />
            )}
          />
          <Controller
            control={methods.control}
            name="status"
            render={({ field }) => (
              <FormField
                {...field}
                title="Status"
                placeholder="Enter status"
                handleChangeText={field.onChange}
                error={errors.status?.message}
              />
            )}
          />
        </FormSection>
      )}
    />
  );
}
