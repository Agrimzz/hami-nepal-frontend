import { clearTokens } from "@/utils/storage";
import { useRouter } from "expo-router";
import { LogOut, Menu, MoveUpRight, User } from "lucide-react-native";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export function Dashboard() {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-background h-full">
      <View className="w-full bg-gray px-4 py-8 rounded-b-2xl">
        <View className="flex flex-row items-center justify-between py-2">
          <Menu size={20} color="#F1F1F1" />
          <View className="flex flex-row gap-2">
            <User size={20} color="#F1F1F1" />
            <LogOut
              size={20}
              color="red"
              onPress={async () => {
                await clearTokens();
                router.replace("/");
              }}
            />
          </View>
        </View>
        <Text className="text-4xl font-pbold text-white mt-4">Dashboard</Text>
      </View>
      <View className="w-full flex flex-row flex-wrap gap-4 mt-4 px-4">
        <TouchableOpacity
          className="bg-gray px-4 py-8 rounded-2xl w-[48%]"
          onPress={() => router.push("/inventory/dashboard")}
        >
          <View className="flex flex-row items-center justify-between">
            <View className="space-y-1">
              <Text className="text-lg text-white font-pregular">View</Text>
              <Text className="text-lg text-white font-pregular">
                Inventory
              </Text>
            </View>
            <MoveUpRight size={20} color="#F1F1F1" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray px-4 py-8 rounded-2xl w-[48%]"
          onPress={() => router.push("/cause")}
        >
          <View className="flex flex-row items-center justify-between">
            <View className="space-y-1">
              <Text className="text-lg text-white font-pregular">View</Text>
              <Text className="text-lg text-white font-pregular">Causes</Text>
            </View>
            <MoveUpRight size={20} color="#F1F1F1" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray px-4 py-8 rounded-2xl w-[48%]"
          onPress={() => router.push("/user")}
        >
          <View className="flex flex-row items-center justify-between">
            <View className="space-y-1">
              <Text className="text-lg text-white font-pregular">View</Text>
              <Text className="text-lg text-white font-pregular">Users</Text>
            </View>
            <MoveUpRight size={20} color="#F1F1F1" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray px-4 py-8 rounded-2xl w-[48%]">
          <View className="flex flex-row items-center justify-between">
            <View className="space-y-1">
              <Text className="text-lg text-white font-pregular">View</Text>
              <Text className="text-lg text-white font-pregular">Orders</Text>
            </View>
            <MoveUpRight size={20} color="#F1F1F1" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
