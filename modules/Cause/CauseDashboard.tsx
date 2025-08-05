import { CustomButton } from "@/components";
import images from "@/constants/images";
import { router } from "expo-router";
import { Ellipsis } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CausesCard } from "./components/CausesCard";
export function CauseDashboard() {
  return (
    <SafeAreaView className="bg-background h-full">
      {/* Header */}
      <View className="w-full flex flex-row items-center justify-between p-4">
        <Pressable onPress={() => router.push("/dashboard")}>
          <Image source={images.logo1} className="w-14 h-14 rounded-full" />
        </Pressable>
        <Text className="text-sm font-plight text-white">Cause</Text>
        <View className="flex items-center justify-center bg-gray rounded-2xl w-14 h-14">
          <Ellipsis size={16} color="#F1F1F1" />
        </View>
      </View>
      <View className="mt-4 px-4 flex flex-row items-center justify-between">
        <Text className="text-5xl font-pmedium text-white ">Causes</Text>
        <CustomButton
          title="Create Cause"
          handlePress={() => {
            router.push("/cause/new");
          }}
          containerStyles="px-4"
          textStyles="text-sm font-pbold"
        />
      </View>

      <View className="mt-4 px-4 flex gap-2">
        <CausesCard
          title="Save the Earth"
          description="Join us in our mission to protect the environment and promote sustainability."
          category="Environment"
          status="active"
        />
        <CausesCard
          title="Save the Children"
          description="Join us in our mission to protect the environment and promote sustainability."
          category="Environment"
          status="inactive"
        />
        <CausesCard
          title="Save the Animals"
          description="Join us in our mission to protect the environment and promote sustainability."
          category="Environment"
          status="active"
        />
      </View>
    </SafeAreaView>
  );
}
