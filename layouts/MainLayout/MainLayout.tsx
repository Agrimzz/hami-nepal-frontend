import images from "@/constants/images";
import { clearTokens } from "@/utils/storage";
import { router, Slot } from "expo-router";
import { Bell, LogOut, Menu } from "lucide-react-native";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function MainLayout() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="w-full flex flex-row justify-between items-center p-4">
        <Image source={images.logo} className="w-8 h-8 " />
        <View className="flex flex-row gap-2 items-center">
          <LogOut
            size={20}
            color="red"
            onPress={async () => {
              await clearTokens();
              router.replace("/");
            }}
          />
          <View className="flex flex-row items-center gap-1 bg-gray/50 rounded-full p-4 relative">
            <Bell size={14} color="white" fill="white" />
            <Text className="text-white text-sm font-pregular">2</Text>
            <View className="size-2 bg-primary absolute top-0 right-2 rounded-full"></View>
          </View>
          <Menu size={20} color="white" fill="white" />
        </View>
      </View>
      <Slot />
    </SafeAreaView>
  );
}
