import { AddButton } from "@/components";
import { useApiQuery } from "@/hooks/useApiQuery";
import { router } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { DataListProps } from "./DataList.type";
export function DataList<T>({
  queryKey,
  endpoint,
  renderItem,
  ListEmptyComponent = () => <Text>No data</Text>,
  addButtonPath,
}: DataListProps<T>) {
  const { data, isLoading, refetch } = useApiQuery<T[]>(queryKey, endpoint);

  const [refreshing, setRefreshing] = useState(false);

  console.log(data);

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
    <View className="flex-1 px-4 relative">
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => renderItem(item) as any}
        ListEmptyComponent={ListEmptyComponent as any}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {addButtonPath && (
        <AddButton onPress={() => router.push(addButtonPath as any)} />
      )}
    </View>
  );
}
