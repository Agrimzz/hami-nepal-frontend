import { TabLayout } from "@/layouts";
const tabs = ["users", "roles"];
const tabRoutes = {
  users: "/accounts",
  roles: "/accounts/roles",
} as const;
export default function AccountsPage() {
  return <TabLayout title="Users" tabs={tabs} tabRoutes={tabRoutes} />;
}
