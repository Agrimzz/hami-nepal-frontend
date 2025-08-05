import { Text, View } from "react-native";

export function CausesCard({ title, description, category, status }: any) {
  return (
    <View
      className={`${status === "active" ? "bg-primary" : "bg-gray"} w-full rounded-2xl`}
    >
      <Text className="text-white text-2xl font-pbold px-4 pt-4">{title}</Text>
      <Text className="text-white text-sm font-plight px-4">{description}</Text>
      <Text className="text-white text-xs font-plight px-4 pb-4">
        {category}
      </Text>
    </View>
  );
}
