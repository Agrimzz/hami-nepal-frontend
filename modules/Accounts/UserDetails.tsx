import { apiHandler } from "@/api/apiHandler";
import { api } from "@/api/client";
import { useApiQuery } from "@/hooks/useApiQuery";
import AltLayoutRouteContext from "@/layouts/AltLayout/context/AltLayoutRoute.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Pen, Trash } from "lucide-react-native";
import { useContext, useEffect } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { UserSchemaWithId } from "./form/userSchema";

export function UserDetails() {
  const { id } = useLocalSearchParams();
  const { setRoutePath } = useContext(AltLayoutRouteContext);
  const { data: user, isLoading } = useApiQuery<UserSchemaWithId>(
    ["users", id],
    `/accounts/v1/users/${id}/`
  );

  useEffect(() => {
    if (user) {
      setRoutePath(`Users / ${user.full_name || `ID ${id}`}`);
    } else {
      setRoutePath("Users / Details");
    }
  }, [user, id]);

  const details = [
    { key: "Full Name", value: user?.full_name },
    { key: "Email", value: user?.email },
    { key: "Address", value: "Kathmandu, Nepal" },
    { key: "Phone", value: "+977 1234567890" },
    { key: "Company", value: "Haminepal" },
    { key: "Position", value: "Project Manager" },
    { key: "Profession", value: "Accountant" },
    { key: "Joined", value: "2022" },
    { key: "Role", value: "Admin" },
    { key: "Status", value: "Active" },
    { key: "Language", value: "English" },
  ];

  const queryClient = useQueryClient();
  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiHandler(() =>
        api.delete(`/accounts/v1/users/${id}/`)
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Alert.alert("Deleted", "User deleted successfully");
      router.back();
    },
    onError: () => {
      Alert.alert("Error", "Failed to delete user");
    },
  });

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteUser(id) },
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1 px-4"
      contentContainerStyle={{
        flexGrow: 1,
        gap: 4,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <View className="w-full mt-4 gap-4">
        <View className="relative">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            className="w-full h-[400] rounded-2xl "
          />
          <View className="p-2 bg-primary/30 absolute bottom-2 right-2 rounded-full">
            <Text className="text-primary uppercase text-sm font-psemibold">
              admin
            </Text>
          </View>
        </View>
        <View className="w-full bg-gray/50 rounded-2xl p-4 ">
          <View className="flex flex-row justify-between items-center mb-2">
            <Text className="text-lg text-white font-psemibold">
              User Details
            </Text>
            <View className="flex flex-row gap-2">
              <Pressable
                className="p-2 bg-primary/20 rounded-full"
                onPress={() => router.push(`/forms/accounts/edit/${id}` as any)}
              >
                <Pen size={16} color="#CC343B" />
              </Pressable>
              <Pressable
                className="p-2 bg-primary/20 rounded-full"
                onPress={() => user?.id && handleDelete(user.id)}
              >
                <Trash size={16} color="#CC343B" />
              </Pressable>
            </View>
          </View>
          {details.map(
            (item, idx) =>
              item.value && (
                <View
                  key={idx}
                  className="flex-row py-2 border-b border-gray-700 last:border-b-0"
                >
                  <Text className="w-[30%] text-sm text-lightgray font-pregular">
                    {item.key}
                  </Text>
                  <Text className="flex-1 text-base text-white font-psemibold">
                    {item.value}
                  </Text>
                </View>
              )
          )}
        </View>
      </View>
    </ScrollView>
  );
}
