import { DataList } from "@/components";
import { useDelete } from "@/hooks/useDelete";
import { router } from "expo-router";
import { Trash } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";
import { EventSchemaWithId } from "./form/eventSchema";

export function Events() {
  const { mutate: deleteEvent, isPending } = useDelete("/causes/v1/events/", [
    "events",
  ]);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteEvent(id),
        },
      ]
    );
  };
  return (
    <DataList<EventSchemaWithId>
      queryKey={["events"]}
      endpoint="/causes/v1/events/"
      renderItem={(item) => (
        <Pressable
          className="w-full p-4 bg-gray/50 rounded-xl mt-2 gap-4 items-start"
          onPress={() => router.push(`/forms/events/edit/${item.id}` as any)}
        >
          <View className="w-full flex flex-row justify-between items-start">
            <View className="flex flex-row gap-2">
              <View className="p-2 rounded-xl bg-primary/20">
                <Text className="text-primary font-psemibold capitalize text-sm">
                  {new Date(item.event_date).toLocaleDateString()}
                </Text>
              </View>
              <View className="p-2 rounded-xl bg-green/20">
                <Text className="text-green font-psemibold capitalize text-sm">
                  {item.location}
                </Text>
              </View>
            </View>
            <Pressable
              className="p-2 rounded-xl bg-primary/20"
              onPress={() => handleDelete(item.id)}
            >
              <Trash size={16} color="#CC343B" />
            </Pressable>
          </View>
          <View className="w-full">
            <Text className="text-xl text-white font-pbold">{item.title}</Text>

            <Text className="text-sm text-white font-pregular mt-2">
              {item.description}
            </Text>
          </View>
        </Pressable>
      )}
      addButtonPath="/forms/events/new"
    />
  );
}
