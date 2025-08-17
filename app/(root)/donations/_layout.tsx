import { TabLayout } from "@/layouts";
const tabs = ["dontaions"];
const tabRoutes = {
  dontaions: "/donations",
} as const;
export default function DonationScreen() {
  return <TabLayout title="Donations" tabs={tabs} tabRoutes={tabRoutes} />;
}
