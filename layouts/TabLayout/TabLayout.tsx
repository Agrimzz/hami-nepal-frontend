import { router, Slot, usePathname } from "expo-router";
import {
  Calendar,
  ChevronDown,
  Search,
  Truck,
  Warehouse,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

type TabLayoutProps = {
  title: string;
  tabs: string[];
  tabRoutes: Record<string, string>;
};

export function TabLayout({ title, tabs, tabRoutes }: TabLayoutProps) {
  const pathname = usePathname();

  const activeTab = (() => {
    const tab = tabs.find((tab) => tabRoutes[tab] === pathname);
    return tab ?? tabs[0];
  })();

  return (
    <ScrollView
      className=" h-full"
      stickyHeaderIndices={[1]} // index 1 = tabs, index 2 = filters
    >
      {/* Title (will scroll away) */}
      <Text className="text-white text-3xl font-psemibold px-4">
        Manage {"\n"}
        {title}
      </Text>

      <View className="bg-background">
        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ minHeight: 41 }}
          className=" border-b border-gray px-4"
        >
          {tabs.map((item) => (
            <Pressable
              key={item}
              onPress={() => router.push(tabRoutes[item] as any)}
              className="mr-8"
              disabled={activeTab === item}
            >
              <Text
                className={`font-psemibold text-lg capitalize py-2 ${
                  activeTab === item
                    ? "text-white border-b border-white"
                    : "text-lightgray"
                }`}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ minHeight: 55 }}
          className="mt-4 px-4 "
          contentContainerStyle={{ gap: 4 }}
        >
          {/* Search */}
          <View className="bg-primary rounded-2xl justify-center items-center w-14 h-14">
            <Search size={18} color="#F1F1F1" />
          </View>

          {[
            { Icon: Calendar, label: "Calendar", value: "All Time" },
            { Icon: Warehouse, label: "Warehouse", value: "Ranbari Warehouse" },
            {
              Icon: Truck,
              label: "Supplier",
              value: "Supplier 1",
              extra: true,
            },
          ].map(({ Icon, label, value, extra }) => (
            <View
              key={label}
              className={`flex-row items-center bg-white/10 rounded-2xl h-14 px-4 gap-2 ${extra ? "mr-8" : ""}`}
            >
              <Icon size={18} color="#F1F1F1" />
              <Text className="text-xs font-plight text-lightgray">
                {label}
              </Text>
              <Text className="text-xs font-plight text-white">{value}</Text>
              <ChevronDown size={18} color="#F1F1F1" />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Page Content */}
      <View className="flex-1">
        <Slot />
      </View>
    </ScrollView>
  );
}
