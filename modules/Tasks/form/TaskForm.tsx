import {
  CustomButton,
  DatePickerField,
  FormField,
  SelectBottomSheet,
} from "@/components";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import AltLayoutRouteContext from "@/layouts/AltLayout/context/AltLayoutRoute.context";
import { UserSchemaWithId } from "@/modules/Accounts/form/userSchema";
import { CauseSchemaWithId } from "@/modules/Causes/form/causeSchema";
import { EventSchemaWithId } from "@/modules/Events/form/eventSchema";
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
  TaskCreateSchema,
  taskCreateSchema,
  TaskEditSchema,
  taskEditSchema,
  TaskSchemaWithId,
} from "./taskSchema";

export function TaskForm({ initialData }: { initialData?: TaskSchemaWithId }) {
  const { setRoutePath } = useContext(AltLayoutRouteContext);

  const isEdit = Boolean(initialData);
  const schema = isEdit ? taskEditSchema : taskCreateSchema;

  useEffect(() => {
    setRoutePath(initialData ? "Tasks / Edit" : "Tasks / New");
  }, [initialData, setRoutePath]);

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

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreateSchema | TaskEditSchema>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          ...initialData,
          assignee_ids: initialData?.assignees?.map((assignee) =>
            assignee.id.toString()
          ),
          cause_id: initialData?.cause?.id.toString(),
          event_id: initialData?.event?.id.toString(),
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
        },
  });

  const { mutate: saveTask, isPending } = useApiMutation(
    isEdit ? "patch" : "post",
    isEdit ? `/tasks/v1/tasks/${initialData?.id}/` : "/tasks/v1/tasks/"
  );

  const onSubmit = (data: TaskCreateSchema | TaskEditSchema) => {
    console.log(data);
    saveTask(data, {
      onSuccess: () => {
        router.replace("/tasks");

        Alert.alert(
          "Success",
          `Task ${isEdit ? "updated" : "created"} successfully`
        );
      },
      onError: (err: any) => {
        console.error("Create Task Error:", err);
        Alert.alert("Error", `Failed to ${isEdit ? "update" : "create"} task`);
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
          <View className="px-6 py-4 gap-2">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-white font-pbold text-lg">
                Task Details
              </Text>
              <Text className="text-xs text-lightgray font-pbold">
                Add a new task
              </Text>
            </View>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Title"
                  placeholder="Enter task title"
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
                  placeholder="Enter task description"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.description?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="due_date"
              render={({ field: { value, onChange } }) => (
                <DatePickerField
                  title="Due Date"
                  value={watch("due_date")}
                  onChange={(val) => setValue("due_date", val)}
                  error={errors.due_date?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <SelectBottomSheet
                  options={[
                    { label: "Ongoing", value: "ongoing" },
                    { label: "Completed", value: "completed" },
                    { label: "Cancelled", value: "cancelled" },
                    { label: "On Hold", value: "onhold" },
                  ]}
                  value={value}
                  placeholder="Select status"
                  title="Choose Status"
                  onChange={(val) => onChange(val)}
                />
              )}
            />

            <Controller
              control={control}
              name="priority"
              render={({ field: { onChange, value } }) => (
                <SelectBottomSheet
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                    { label: "Urgent", value: "urgent" },
                  ]}
                  value={value}
                  placeholder="Select priority"
                  title="Choose Priority"
                  onChange={(val) => onChange(val)}
                />
              )}
            />

            <Controller
              control={control}
              name="assignee_ids"
              render={({ field: { onChange, value } }) => (
                <SelectBottomSheet
                  options={users?.map((cause) => ({
                    label: cause.full_name,
                    value: cause.id,
                  }))}
                  value={value}
                  placeholder="Select assignees"
                  title="Choose assignees"
                  multiple
                  onChange={(val) => onChange(val)}
                />
              )}
            />

            <Controller
              control={control}
              name="cause_id"
              render={({ field: { onChange, value } }) => (
                <SelectBottomSheet
                  options={causes?.map((cause) => ({
                    label: cause.title,
                    value: cause.id,
                  }))}
                  value={value}
                  placeholder="Select cause"
                  title="Choose Cause"
                  onChange={(val) => onChange(val)}
                />
              )}
            />

            <Controller
              control={control}
              name="event_id"
              render={({ field: { onChange, value } }) => (
                <SelectBottomSheet
                  options={events?.map((event) => ({
                    label: event.title,
                    value: event.id,
                  }))}
                  value={value}
                  placeholder="Select event"
                  title="Choose Event"
                  onChange={(val) => onChange(val)}
                />
              )}
            />

            <CustomButton
              title={isEdit ? "Update Task" : "Create Task"}
              handlePress={handleSubmit(onSubmit)}
              isLoading={isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
