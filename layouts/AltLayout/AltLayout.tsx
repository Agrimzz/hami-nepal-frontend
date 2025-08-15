import { router, Slot } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AltLayoutRouteContext from "./context/AltLayoutRoute.context";

export function AltLayout() {
  const [routePath, setRoutePath] = useState("");
  return (
    <AltLayoutRouteContext.Provider value={{ routePath, setRoutePath }}>
      <SafeAreaView className="flex-1 bg-background relative">
        <View className="w-full flex flex-row justify-between items-center px-4 py-2 ">
          <ChevronLeft size={24} color="white" onPress={() => router.back()} />
          <Text className="text-sm font-psemibold text-white">{routePath}</Text>
          <View />
        </View>
        <Slot />
      </SafeAreaView>
    </AltLayoutRouteContext.Provider>
  );
}
