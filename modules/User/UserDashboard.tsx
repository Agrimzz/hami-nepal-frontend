import { CustomButton } from "@/components";
import images from "@/constants/images";
import { router } from "expo-router";
import { Ellipsis, LoaderCircle, Pen, Trash } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFetchUsers } from "./hooks/useFetchUser";
export function UserDashboard() {
  const { data, isLoading } = useFetchUsers();
  if (isLoading) {
    return (
      <SafeAreaView className="bg-background h-full flex items-center justify-center">
        <LoaderCircle
          size={24}
          color="#F1F1F1"
          className="mx-auto animate-spin"
        />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="bg-background h-full">
      {/* Header */}
      <View className="w-full flex flex-row items-center justify-between p-4">
        <Pressable onPress={() => router.push("/dashboard")}>
          <Image source={images.logo1} className="w-14 h-14 rounded-full" />
        </Pressable>
        <Text className="text-sm font-plight text-white">Users</Text>
        <View className="flex items-center justify-center bg-gray rounded-2xl w-14 h-14">
          <Ellipsis size={16} color="#F1F1F1" />
        </View>
      </View>
      <View className="mt-4 px-4 flex flex-row items-center justify-between">
        <Text className="text-5xl font-pmedium text-white ">Users</Text>
        <CustomButton
          title="Create User"
          handlePress={() => {
            router.push("/user/new");
          }}
          containerStyles="px-4"
          textStyles="text-sm font-pbold"
        />
      </View>
      <View className="w-full mt-4 px-4 flex flex-row overflow-x-scroll border-b border-gray pb-2 gap-2">
        <Text style={{ flex: 2 }} className="text-white text-lg font-pbold">
          Name
        </Text>
        <Text style={{ flex: 2 }} className="text-white text-lg font-pbold">
          Email
        </Text>
        <Text style={{ flex: 1 }} className="text-white text-lg font-pbold">
          Actions
        </Text>
      </View>
      {/* Table Rows */}
      {data?.map((user: any) => (
        <View
          key={user.id}
          className="w-full px-4 flex flex-row items-center gap-2 py-2 overflow-x-scroll"
        >
          <Text
            style={{ flex: 2 }}
            className="text-white text-sm font-pregular"
          >
            {user.full_name}
          </Text>
          <Text
            style={{ flex: 2 }}
            className="text-white text-sm font-pregular"
          >
            {user.email}
          </Text>
          <View style={{ flex: 1 }} className="flex flex-row gap-2">
            <Pressable className="bg-gray p-2 rounded-2xl">
              <Pen size={16} color="#F1F1F1" />
            </Pressable>
            <Pressable className="bg-gray p-2 rounded-2xl">
              <Trash size={16} color="#F1F1F1" />
            </Pressable>
          </View>
        </View>
      ))}
    </SafeAreaView>
  );
}
