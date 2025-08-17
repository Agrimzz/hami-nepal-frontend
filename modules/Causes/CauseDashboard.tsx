import { CustomButton } from "@/components";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CausesCard } from "./components/CausesCard";
import { useFetchCauses } from "./hooks/useFetchCauses";
export function CauseDashboard() {
  const { data, isLoading } = useFetchCauses();
  if (isLoading) {
    return (
      <SafeAreaView className="bg-background h-full flex items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="bg-background h-full">
      <View className="mt-4 px-4 flex flex-row items-center justify-between">
        <Text className="text-5xl font-pmedium text-white ">Causes</Text>
        <CustomButton
          title="Create Cause"
          handlePress={() => {
            router.push("/causes/new");
          }}
          containerStyles="px-4"
          textStyles="text-sm font-pbold"
        />
      </View>

      <View className="mt-4 px-4 flex gap-2">
        {data?.map((cause: any) => (
          <Pressable
            key={cause.id}
            onPress={() => router.push(`/cause/${cause.id}`)}
          >
            <CausesCard
              title={cause.title}
              description={cause.description}
              category={cause.category}
              status={cause.status}
            />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
