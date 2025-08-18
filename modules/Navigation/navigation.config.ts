import {
  CalendarHeart,
  DollarSign,
  Heart,
  KeyRound,
  LayoutDashboard,
  ListTodo,
  Package,
  Truck,
  Users,
  Warehouse,
} from "lucide-react-native";

export const navConfig = [
  {
    title: "Dashboard",
    children: [
      {
        title: "Overview",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Inventory",
    children: [
      {
        title: "Inventory Dashboard",
        path: "/inventory",
        icon: LayoutDashboard,
      },
      {
        title: "Warehouses",
        path: "/inventory/warehouses",
        icon: Warehouse,
      },
      {
        title: "Suppliers",
        path: "/inventory/suppliers",
        icon: Truck,
      },
      {
        title: "Items",
        path: "/inventory/items",
        icon: Package,
      },
    ],
  },
  {
    title: "Causes",
    children: [
      {
        title: "Causes Dashboard",
        path: "/causes",
        icon: Heart,
      },
      {
        title: "Events",
        path: "/causes/events",
        icon: CalendarHeart,
      },
    ],
  },
  {
    title: "Donations",
    children: [
      {
        title: "Donations Dashboard",
        path: "/donations",
        icon: LayoutDashboard,
      },
      {
        title: "Reports",
        path: "/donations/reports",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Tasks",
    children: [
      {
        title: "Tasks Dashboard",
        path: "/tasks",
        icon: ListTodo,
      },
    ],
  },
  {
    title: "Accounts",
    children: [
      {
        title: "User Management",
        path: "/accounts",
        icon: Users,
      },
      {
        title: "Roles & Permissions",
        path: "/accounts/roles",
        icon: KeyRound,
      },
    ],
  },
];
