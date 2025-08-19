import { DataList } from "@/components";
import { useDelete } from "@/hooks/useDelete";
import { router } from "expo-router";
import { Trash } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";
import { CauseSchemaWithId } from "./form/causeSchema";

export function CauseDashboard() {
  const { mutate: deleteCause, isPending } = useDelete("/causes/v1/causes/", [
    "causes",
  ]);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this donation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCause(id),
        },
      ]
    );
  };
  return (
    <DataList<CauseSchemaWithId>
      queryKey={["causes"]}
      endpoint="/causes/v1/causes/"
      renderItem={(item) => (
        <Pressable
          className="w-full p-4 bg-gray/50 rounded-xl mt-2 gap-4 items-start"
          onPress={() => router.push(`/forms/causes/edit/${item.id}` as any)}
        >
          <View className="w-full flex flex-row justify-between items-start">
            <View className="p-2 rounded-xl bg-primary/20">
              <Text className="text-primary font-psemibold capitalize text-sm">
                {item.category}
              </Text>
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
            <Text className="text-xs text-lightgray font-psemibold">
              {item.status}
            </Text>
            <Text className="text-sm text-white font-pregular mt-2">
              {item.description}
            </Text>
          </View>
        </Pressable>
      )}
      addButtonPath="/forms/causes/new"
    />
  );
}
