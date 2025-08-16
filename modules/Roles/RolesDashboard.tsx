import { apiHandler } from "@/api/apiHandler";
import { api } from "@/api/client";
import AddButton from "@/components/AddButton";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { LoaderCircle, Trash } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { RoleSchemaWithId } from "./form/roleSchema";

export function RolesDashboard() {
  const {
    data: roles,
    isLoading,
    refetch,
  } = useApiQuery<RoleSchemaWithId[]>(["roles"], "/accounts/v1/groups/");

  const { mutate: deleteRole, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiHandler(() =>
        api.delete(`/accounts/v1/groups/${id}/`)
      );
      return res.data;
    },
    onSuccess: () => {
      Alert.alert("Deleted", "Role deleted successfully");
      refetch();
    },
    onError: () => {
      Alert.alert("Error", "Failed to delete role");
    },
  });

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this role?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteRole(id) },
      ]
    );
  };

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <View className="animate-spin">
          <LoaderCircle size={24} color="#F1F1F1" className="mx-auto" />
        </View>
      </View>
    );

  return (
    <View className="px-4 flex-1">
      <FlatList
        data={roles}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            className="w-full bg-gray/50 rounded-xl p-6 mt-2 flex flex-row justify-between items-center"
            onPress={() => router.push(`/forms/roles/edit/${item.id}` as any)}
          >
            <View>
              <Text className="text-white text-base font-pbold">
                {item.name}
              </Text>
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
        ListEmptyComponent={<Text>No data</Text>}
      />
      <AddButton onPress={() => router.push("/forms/roles/new")} />
    </View>
  );
}
