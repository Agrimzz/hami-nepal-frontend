import { DataList } from "@/components";
import { useDelete } from "@/hooks/useDelete";
import { router } from "expo-router";
import { Trash } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";

export function RolesDashboard() {
  const { mutate: deleteCause, isPending } = useDelete("/accounts/v1/groups/", [
    "groups",
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
    <DataList<any>
      queryKey={["groups"]}
      endpoint="/accounts/v1/groups/"
      renderItem={(item) => (
        <Pressable
          className="w-full bg-gray/50 rounded-xl p-6 mt-2 flex flex-row justify-between items-center"
          onPress={() => router.push(`/forms/roles/edit/${item.id}` as any)}
        >
          <View>
            <Text className="text-white text-base font-pbold">{item.name}</Text>
            <Text className="text-white text-xs font-plight">
              {item.permissions.length} Permissions
            </Text>
          </View>
          <Pressable
            className="p-2 flex flex-row items-center gap-1 bg-primary/20 rounded-full"
            onPress={() => handleDelete(item.id)}
          >
            <Trash color="red" size={16} />
          </Pressable>
        </Pressable>
      )}
      addButtonPath="/forms/roles/new"
    />
  );
}
