import { router } from "expo-router";
import { Award } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";

export function UserCard({ id, name, role, position, img }: any) {
  return (
    <Pressable
      className="w-full bg-gray/50 rounded-2xl h-[180px] px-6 mt-2 flex flex-row justify-between items-start"
      onPress={() => {
        router.push(`/details/users/${id}`);
      }}
    >
      <View className="flex justify-between py-4 h-full">
        <View className="flex gap-2 items-start ">
          <View className="p-2 bg-primary/20 rounded-full ">
            <Text className="text-xs font-pbold text-primary uppercase">
              {role}
            </Text>
          </View>
          <View className="">
            <Text className="text-xl font-psemibold text-white capitalize">
              {name}
            </Text>
            <Text className="text-xs font-plight text-lightgray">
              {position}
            </Text>
          </View>
          <View className="p-2 flex flex-row items-center gap-1 bg-white/20 rounded-full">
            <Award color="gray" size={16} />
            <Text className="text-xs font-pbold text-white/60">
              23 Achievements
            </Text>
          </View>
        </View>

        <Text className="text-xs text-white/20 font-pregular">
          Memeber since 2016
        </Text>
      </View>

      <View className="bg-primary w-[120] h-[45%]">
        <Image
          source={{ uri: img }}
          className="w-[120] h-[120] rounded-full mt-8"
        />
      </View>
    </Pressable>
  );
}
