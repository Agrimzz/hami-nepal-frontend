import { TabLayout } from "@/layouts";
const tabs = ["causes", "events"];
const tabRoutes = {
  causes: "/causes",
  events: "/causes/events",
} as const;
export default function DonationScreen() {
  return <TabLayout title="Causes" tabs={tabs} tabRoutes={tabRoutes} />;
}
