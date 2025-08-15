import { usePathname } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { UserCard } from "./components/UserCard";
import { useFetchUsers } from "./hooks/useFetchUser";

const tabs = ["users", "roles"] as const;
const tabRoutes = {
  users: "/accounts",
  roles: "/accounts/roles",
} as const;
export function UserDashboard() {
  const { data, isLoading } = useFetchUsers();

  const pathname = usePathname();
  const activeTab = (() => {
    const tab = tabs.find((tab) => tabRoutes[tab] === pathname);
    return tab ?? tabs[0];
  })();

  if (isLoading) {
    return (
      <View className="bg-background h-full flex items-center justify-center">
        <LoaderCircle
          size={24}
          color="#F1F1F1"
          className="mx-auto animate-spin"
        />
      </View>
    );
  }
  return (
    <ScrollView className="bg-background h-full px-4">
      {/* Table Rows */}
      {data?.map((user: any) => (
        <UserCard
          name={user.full_name}
          role={user.role ?? "Admin"}
          position={user.position ?? "Project Manager"}
          key={user.id}
          img={
            user.img ??
            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
        />
      ))}
    </ScrollView>
  );
}
