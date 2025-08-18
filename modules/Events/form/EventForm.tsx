import { CustomButton, FormField, SelectBottomSheet } from "@/components";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import AltLayoutRouteContext from "@/layouts/AltLayout/context/AltLayoutRoute.context";
import { CauseSchemaWithId } from "@/modules/Causes/form/causeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventCreateSchema | EventEditSchema>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      title: "",
      description: "",
      event_date: "",
      location: "",
      cause_id: undefined as unknown as string,
    },
  });

  const { mutate: saveEvent, isPending } = useApiMutation(
    isEdit ? "patch" : "post",
    isEdit ? `/causes/v1/events/${initialData?.id}/` : "/causes/v1/events/"
  );

  console.log(errors);
  const onSubmit = (data: EventCreateSchema | EventEditSchema) => {
    console.log(data);
    saveEvent(data, {
      onSuccess: () => {
        router.push("/causes/events");

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
                Event Details
              </Text>
              <Text className="text-xs text-lightgray font-pbold">
                Add a new event
              </Text>
            </View>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Title"
                  placeholder="Enter event title"
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
                  placeholder="Enter event description"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.description?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="event_date"
              render={({ field: { value, onChange } }) => (
                <>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="bg-gray/50 p-4 rounded-xl"
                  >
                    <Text className="text-lightgray font-pregular text-xs">
                      Event Date
                    </Text>
                    <Text
                      className={`${
                        value ? "text-white" : "text-lightgray"
                      } font-pregular text-sm mt-2`}
                    >
                      {value
                        ? new Date(value).toLocaleDateString()
                        : "Select Date"}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <RNDateTimePicker
                      mode="date"
                      value={value ? new Date(value) : new Date()}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          onChange(selectedDate.toISOString().split("T")[0]);
                        }
                      }}
                      display="default"
                      themeVariant="dark"
                    />
                  )}

                  {errors.event_date?.message && (
                    <Text className="text-red-500 text-sm ml-2">
                      {errors.event_date.message}
                    </Text>
                  )}
                </>
              )}
            />

            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <FormField
                  title="Location"
                  placeholder="Enter cause location"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.location?.message}
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
