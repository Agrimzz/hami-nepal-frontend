import { TabLayout } from "@/layouts";
const tabs = ["tasks", "ongoing", "completed", "cancelled", "onhold"];
const tabRoutes = {
  tasks: "/tasks",
  ongoing: "/tasks/ongoing",
  completed: "/tasks/completed",
  cancelled: "/tasks/cancelled",
  onhold: "/tasks/onhold",
} as const;
export default function DonationScreen() {
  return <TabLayout title="Tasks" tabs={tabs} tabRoutes={tabRoutes} />;
}
