import { router, usePathname } from "expo-router";
import { User, X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { navConfig } from "./navigation.config";

export function Navigation({ toggleDrawer }: { toggleDrawer: () => void }) {
  const pathname = usePathname();

  return (
    <SafeAreaView className="flex-1 absolute inset-0 bg-black p-4">
      <View className="w-full bg-gray p-2 rounded-2xl flex flex-row justify-between items-center">
        <View className="bg-lightgray/50 p-2 rounded-full">
          <User size={24} color="white" fill="white" />
        </View>
        <View className="bg-primary p-2 rounded-full">
          <X size={24} color="white" fill="white" onPress={toggleDrawer} />
        </View>
      </View>
      <ScrollView
        className="w-full flex-1 bg-gray p-4 rounded-2xl mt-4"
        contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
      >
        {navConfig.map(({ title, children }) => (
          <View className=" gap-2" key={title}>
            <Text className="text-white text-base font-pbold">{title}</Text>
            {children.map(({ title, path, icon: Icon }) => (
              <Pressable
                onPress={() => {
                  router.push(path as any);
                  toggleDrawer();
                }}
                key={title}
                className="flex flex-row items-center gap-2 px-4 py-2 rounded-2xl"
              >
                <Icon
                  size={18}
                  color={pathname === path ? "#CC343B" : "gray"}
                />
                <Text
                  className={`${pathname === path ? "text-primary" : " text-lightgray"} text-base font-psemibold`}
                >
                  {title}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
