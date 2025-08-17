import { DataList } from "@/components";
import { useDelete } from "@/hooks/useDelete";
import { router } from "expo-router";
import { Trash } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";
import { DonationSchemaWithId } from "./form/donation.schema";

export function Donations() {
  const { mutate: deleteDonation, isPending } = useDelete(
    "/donations/v1/donations/",
    ["donations"]
  );

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this donation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteDonation(id),
        },
      ]
    );
  };
  return (
    <DataList<DonationSchemaWithId>
      queryKey={["donations"]}
      endpoint="/donations/v1/donations/"
      renderItem={(item) => (
        <Pressable
          className="w-full p-4 bg-gray/50 rounded-xl mt-2 gap-4 items-start"
          onPress={() => router.push(`/forms/donations/edit/${item.id}` as any)}
        >
          <View className="w-full flex flex-row justify-between items-start">
            <View className="p-2 rounded-xl bg-primary/20">
              <Text className="text-primary font-psemibold capitalize text-sm">
                {item.type}
              </Text>
            </View>
            <Text className="text-lightgray font-psemibold text-xs">
              {new Date(item.donated_at as string).toLocaleDateString()}
            </Text>
          </View>
          <View className="w-full flex flex-row justify-between items-center">
            <Text className="text-3xl text-white font-pbold">
              Rs.{item.amount}
            </Text>
            <Pressable
              className="p-2 rounded-xl bg-primary/20"
              onPress={() => handleDelete(item.id)}
            >
              <Trash size={16} color="#CC343B" />
            </Pressable>
          </View>
        </Pressable>
      )}
      addButtonPath="/forms/donations/new"
    />
  );
}
