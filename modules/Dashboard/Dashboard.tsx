import {
  Calendar,
  ChevronDown,
  Settings,
  Truck,
  Warehouse,
} from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

export function Dashboard() {
  return (
    <ScrollView className=" flex-1">
      <Text className="text-white text-3xl font-psemibold px-4">
        Hi there,<Text className="text-primary"> Admin</Text> {"\n"}here is a
        quick overview {"\n"}of the organization.
      </Text>

      {/* TODO: Snap the end filter to end of the list */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-4"
        contentContainerStyle={{ gap: 4 }}
      >
        {/* Settings */}
        <View className="bg-primary rounded-2xl justify-center items-center w-14 h-14">
          <Settings size={18} color="#F1F1F1" />
        </View>

        {[
          { Icon: Calendar, label: "Calendar", value: "All Time" },
          {
            Icon: Warehouse,
            label: "Warehouse",
            value: "Ranbari Warehouse",
          },
          {
            Icon: Truck,
            label: "Supplier",
            value: "Supplier 1",
            extra: true,
          },
        ].map(({ Icon, label, value, extra }) => (
          <View
            key={label}
            className={`flex-row items-center bg-white/10 rounded-2xl h-14 px-4 gap-2 ${
              extra ? "mr-8" : ""
            }`}
          >
            <Icon size={18} color="#F1F1F1" />
            <Text className="text-xs font-plight text-lightgray">{label}</Text>
            <Text className="text-xs font-plight text-white">{value}</Text>
            <ChevronDown size={18} color="#F1F1F1" />
          </View>
        ))}
      </ScrollView>

      <View className="px-4">
        <View className="w-full bg-primary rounded-2xl h-[200px] mt-4"></View>
        <View className="flex flex-row justify-between mt-2">
          <View className="w-[49%] h-[200px] bg-gray/50 rounded-2xl" />
          <View className="w-[49%] h-[200px] bg-gray/50 rounded-2xl" />
        </View>
        <View className="flex flex-row justify-between mt-2">
          <View className="w-[49%] h-[200px] bg-gray/50 rounded-2xl" />
          <View className="w-[49%] h-[200px] bg-gray/50 rounded-2xl" />
        </View>
      </View>
    </ScrollView>
  );
}
