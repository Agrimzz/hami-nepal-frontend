import AddButton from "@/components/AddButton";
import { useApiQuery } from "@/hooks/useApiQuery";
import { router } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { UserCard } from "./components/UserCard";

export function UserDashboard() {
  const { data, isLoading, refetch } = useApiQuery<any[]>(
    ["users"],
    "/accounts/v1/users/"
  );

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
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        className=""
        renderItem={({ item }) => (
          <UserCard
            id={item.id}
            name={item.full_name}
            role={"Admin"}
            position={"Project Manager"}
            key={item.id}
            img={item?.profile_picture?.file}
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
