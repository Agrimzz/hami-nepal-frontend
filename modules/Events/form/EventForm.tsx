import {
  DatePickerField,
  FormField,
  FormSection,
  FormWizard,
  SelectBottomSheet,
} from "@/components";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import AltLayoutRouteContext from "@/layouts/AltLayout/context/AltLayoutRoute.context";
import { CauseSchemaWithId } from "@/modules/Causes/form/causeSchema";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Alert } from "react-native";
import {
  EventCreateSchema,
  eventCreateSchema,
  EventEditSchema,
  eventEditSchema,
  EventSchemaWithId,
} from "./eventSchema";

export function EventForm({
  initialData,
}: {
  initialData?: EventSchemaWithId;
}) {
  const { setRoutePath } = useContext(AltLayoutRouteContext);

  const isEdit = Boolean(initialData);
  const schema = isEdit ? eventEditSchema : eventCreateSchema;

  useEffect(() => {
    setRoutePath(initialData ? "Causes / Edit" : "Events / New");
  }, [initialData, setRoutePath]);

  const { data: causes } = useApiQuery<CauseSchemaWithId[]>(
    ["causes"],
    "/causes/v1/causes/"
  );

  const { mutate: saveEvent, isPending } = useApiMutation(
    isEdit ? "patch" : "post",
    isEdit ? `/causes/v1/events/${initialData?.id}/` : "/causes/v1/events/"
  );

  const onSubmit = (data: EventCreateSchema | EventEditSchema) => {
    console.log(data);
    saveEvent(data, {
      onSuccess: () => {
        router.replace("/causes/events");

        Alert.alert(
          "Success",
          `Event ${isEdit ? "updated" : "created"} successfully`
        );
      },
      onError: (err: any) => {
        console.error("Create Event Error:", err);
        Alert.alert("Error", `Failed to ${isEdit ? "update" : "create"} event`);
      },
    });
  };

  return (
    <FormWizard
      title={isEdit ? "Edit Event" : "Create a new Event"}
      schema={schema}
      defaultValues={
        initialData || {
          title: "",
          description: "",
          event_date: "",
          location: "",
          cause_id: undefined as unknown as string,
        }
      }
      submitLabel={
        isPending ? "Saving..." : isEdit ? "Update Event" : "Create Event"
      }
      onSubmit={onSubmit}
      renderSections={(methods) => (
        <FormSection
          title="Event Details"
          description="Basic information of the event"
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
                error={methods.formState.errors.title?.message}
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
                error={methods.formState.errors.description?.message}
              />
            )}
          />

          <Controller
            control={methods.control}
            name="event_date"
            render={({ field }) => (
              <DatePickerField
                {...field}
                title="Event Date"
                placeholder="Enter event date"
                onChange={field.onChange}
                error={methods.formState.errors.event_date?.message}
                mode="date"
                otherStyles="w-[100%]"
              />
            )}
          />

          <Controller
            control={methods.control}
            name="location"
            render={({ field }) => (
              <FormField
                {...field}
                title="Location"
                placeholder="Enter location"
                handleChangeText={field.onChange}
                error={methods.formState.errors.location?.message}
              />
            )}
          />

          <Controller
            control={methods.control}
            name="cause_id"
            render={({ field }) => (
              <SelectBottomSheet
                options={causes?.map((cause) => ({
                  label: cause.title,
                  value: cause.id,
                }))}
                value={field.value}
                placeholder="Select cause"
                title="Cause"
                onChange={field.onChange}
              />
            )}
          />
        </FormSection>
      )}
    />
  );
}
