import { router } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Alert, View } from "react-native";
import { z } from "zod";

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

import { UserSchemaWithId } from "@/modules/Accounts/form/userSchema";
import { CauseSchemaWithId } from "@/modules/Causes/form/causeSchema";
import { EventSchemaWithId } from "@/modules/Events/form/eventSchema";

import {
  TaskCreateSchema,
  taskCreateSchema,
  TaskEditSchema,
  taskEditSchema,
  TaskSchemaWithId,
} from "./taskSchema";

type Props = { initialData?: TaskSchemaWithId };

export function TaskForm({ initialData }: Props) {
  const { setRoutePath } = useContext(AltLayoutRouteContext);

  const isEdit = Boolean(initialData);
  const schema = isEdit ? taskEditSchema : taskCreateSchema;

  useEffect(() => {
    setRoutePath(isEdit ? "Tasks / Edit" : "Tasks / New");
  }, [isEdit, setRoutePath]);

  // Reference data
  const { data: causes } = useApiQuery<CauseSchemaWithId[]>(
    ["causes"],
    "/causes/v1/causes/"
  );
  const { data: events } = useApiQuery<EventSchemaWithId[]>(
    ["events"],
    "/causes/v1/events/"
  );
  const { data: users } = useApiQuery<UserSchemaWithId[]>(
    ["users"],
    "/accounts/v1/users/"
  );

  const { mutate: saveTask, isPending } = useApiMutation(
    isEdit ? "patch" : "post",
    isEdit ? `/tasks/v1/tasks/${initialData?.id}/` : "/tasks/v1/tasks/"
  );

  const onSubmit = (data: TaskCreateSchema | TaskEditSchema) => {
    saveTask(data, {
      onSuccess: () => {
        router.back();
        Alert.alert(
          "Success",
          `Task ${isEdit ? "updated" : "created"} successfully`
        );
      },
      onError: (err: unknown) => {
        console.error("Create Task Error:", err);
        Alert.alert("Error", `Failed to ${isEdit ? "update" : "create"} task`);
      },
    });
  };

  // Provide complete defaults for RHF (strings can be empty)
  const defaults: z.infer<typeof schema> = initialData
    ? {
        ...initialData,
        assignee_ids: initialData.assignees?.map((a) => String(a.id)) ?? [],
        cause_id: initialData.cause
          ? String(initialData.cause.id)
          : (undefined as unknown as string),
        event_id: initialData.event
          ? String(initialData.event.id)
          : (undefined as unknown as string),
      }
    : {
        title: "",
        description: "",
        due_date: "",
        status: "ongoing",
        assignee_ids: [],
        cause_id: undefined as unknown as string,
        event_id: undefined as unknown as string,
        priority: undefined as unknown as string,
      };

  return (
    <FormWizard
      title={isEdit ? "Edit Task" : "New Task"}
      schema={schema}
      defaultValues={defaults}
      submitLabel={
        isPending ? "Saving..." : isEdit ? "Update Task" : "Create Task"
      }
      onSubmit={onSubmit}
      // no `steps` prop => non‑stepper mode
      renderSections={(methods) => (
        <View className="gap-6">
          {/* Section 1: Task Details */}
          <FormSection title="Task Details" description="Add a new task">
            <Controller
              control={methods.control}
              name="title"
              render={({ field }) => (
                <FormField
                  title="Title"
                  placeholder="Enter task title"
                  value={field.value}
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
                  title="Description"
                  placeholder="Enter task description"
                  value={field.value}
                  handleChangeText={field.onChange}
                  error={methods.formState.errors.description?.message}
                />
              )}
            />
          </FormSection>

          {/* Section 2: Scheduling & Status */}
          <FormSection
            title="Scheduling & Status"
            description="Timeline and progress"
          >
            <Controller
              control={methods.control}
              name="due_date"
              render={({ field }) => (
                <DatePickerField
                  title="Due Date"
                  value={field.value}
                  onChange={field.onChange}
                  error={methods.formState.errors.due_date?.message}
                />
              )}
            />
            <Controller
              control={methods.control}
              name="status"
              render={({ field }) => (
                <SelectBottomSheet
                  options={[
                    { label: "Ongoing", value: "ongoing" },
                    { label: "Completed", value: "completed" },
                    { label: "Cancelled", value: "cancelled" },
                    { label: "On Hold", value: "onhold" },
                  ]}
                  value={field.value}
                  placeholder="Select status"
                  title="Choose Status"
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={methods.control}
              name="priority"
              render={({ field }) => (
                <SelectBottomSheet
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                    { label: "Urgent", value: "urgent" },
                  ]}
                  value={field.value}
                  placeholder="Select priority"
                  title="Choose Priority"
                  onChange={field.onChange}
                />
              )}
            />
          </FormSection>

          {/* Section 3: Assignment */}
          <FormSection
            title="Assignment"
            description="Who and where this task belongs"
          >
            <Controller
              control={methods.control}
              name="assignee_ids"
              render={({ field }) => (
                <SelectBottomSheet
                  options={users?.map((u) => ({
                    label: u.full_name,
                    value: String(u.id),
                  }))}
                  value={field.value}
                  placeholder="Select assignees"
                  title="Choose Assignees"
                  multiple
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={methods.control}
              name="cause_id"
              render={({ field }) => (
                <SelectBottomSheet
                  options={causes?.map((c) => ({
                    label: c.title,
                    value: String(c.id),
                  }))}
                  value={field.value}
                  placeholder="Select cause"
                  title="Choose Cause"
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={methods.control}
              name="event_id"
              render={({ field }) => (
                <SelectBottomSheet
                  options={events?.map((e) => ({
                    label: e.title,
                    value: String(e.id),
                  }))}
                  value={field.value}
                  placeholder="Select event"
                  title="Choose Event"
                  onChange={field.onChange}
                />
              )}
            />
          </FormSection>
        </View>
      )}
    />
  );
}
