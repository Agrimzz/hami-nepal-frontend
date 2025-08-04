import { logout } from "@/api/auth";
import { CustomButton } from "@/components";
import { clearTokens } from "@/utils/storage";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, SafeAreaView, Text } from "react-native";

const Dashboard = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Logout Successful", "You have been logged out.");
    } catch (error: any) {
      console.log("Logout API error:", error.message);
      Alert.alert("Logout Failed", error.message);
      console.error("Logout error:", error);
    } finally {
      await clearTokens();
      router.replace("/");
    }
  };

  return (
    <SafeAreaView className="bg-background h-full flex items-center justify-center">
      <Text className="text-4xl font-pbold text-white">Dashboard</Text>

      <CustomButton title="Logout" handlePress={handleLogout} />
    </SafeAreaView>
  );
};

export default Dashboard;
