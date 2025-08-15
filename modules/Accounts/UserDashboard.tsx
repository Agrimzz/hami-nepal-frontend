import AddButton from "@/components/AddButton";
import { router } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { UserCard } from "./components/UserCard";
import { useFetchUsers } from "./hooks/useFetchUser";

const tabs = ["users", "roles"] as const;
const tabRoutes = {
  users: "/accounts",
  roles: "/accounts/roles",
} as const;
export function UserDashboard() {
  const { data, isLoading, refetch } = useFetchUsers();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View className="bg-background h-full flex items-center justify-center">
        <View className="animate-spin">
          <LoaderCircle size={24} color="#F1F1F1" className="mx-auto " />
        </View>
      </View>
    );
  }
  return (
    <View className=" flex-1 px-4 relative">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className=""
        renderItem={({ item }) => (
          <UserCard
            name={item.full_name}
            role={item.role ?? "Admin"}
            position={item.position ?? "Project Manager"}
            key={item.id}
            img={
              item.img ??
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
        )}
        ListEmptyComponent={<Text>No data</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <AddButton onPress={() => router.push("/forms/accounts/new")} />
    </View>
  );
}
