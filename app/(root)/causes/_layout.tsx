import { TabLayout } from "@/layouts";
const tabs = ["causes"];
const tabRoutes = {
  causes: "/causes",
} as const;
export default function DonationScreen() {
  return <TabLayout title="Causes" tabs={tabs} tabRoutes={tabRoutes} />;
}
