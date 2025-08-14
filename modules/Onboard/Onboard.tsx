import images from "@/constants/images";
import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Onboard() {
  return (
    <SafeAreaView className="flex-1 bg-background flex items-center justify-center p-4 gap-12 relative">
      <View className="gap-2 items-center">
        <Image source={images.logo1} className="w-8 h-8" />
        <Text className="text-xs font-psemibold text-white">
          Hami Nepal | Management
        </Text>
      </View>

      <Text className="max-w-[250px] text-white text-4xl font-psemibold text-center">
        Here for the <Text className="text-primary">people</Text>, by the{" "}
        <Text className="text-primary">people</Text>.
      </Text>
      <View className="w-full gap-4 items-center">
        <Pressable
          className="w-full rounded-xl bg-black/50 flex flex-row justify-center items-center gap-2 py-6"
          onPress={() => {
            router.push("/login");
          }}
        >
          <Mail size={12} color="#F1F1F1" />
          <Text className="text-white text-xs font-psemibold">
            Sign In using email
          </Text>
        </Pressable>
        <Text className="max-w-[200px] text-white text-xs  font-pbold text-center">
          If you are not a member of Hami Nepal Please Uninstall this app
          immediately.
        </Text>
      </View>
      <Text className="max-w-[200px] text-white/50 text-xs  font-pbold text-center absolute bottom-12">
        By continuing you are agreeing to our{" "}
        <Text className="text-white"> Privacy Policy</Text> and{" "}
        <Text className="text-white">Terms and Conditions.</Text>
      </Text>
    </SafeAreaView>
  );
}
