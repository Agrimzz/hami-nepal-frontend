import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../../app/global.css";
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
export function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "BricolageGrotesque-Bold": require("../../assets/fonts/BricolageGrotesque-Bold.ttf"),
    "BricolageGrotesque-ExtraBold": require("../../assets/fonts/BricolageGrotesque-ExtraBold.ttf"),
    "BricolageGrotesque-ExtraLight": require("../../assets/fonts/BricolageGrotesque-ExtraLight.ttf"),
    "BricolageGrotesque-Light": require("../../assets/fonts/BricolageGrotesque-Light.ttf"),
    "BricolageGrotesque-Medium": require("../../assets/fonts/BricolageGrotesque-Medium.ttf"),
    "BricolageGrotesque-Regular": require("../../assets/fonts/BricolageGrotesque-Regular.ttf"),
    "BricolageGrotesque-SemiBold": require("../../assets/fonts/BricolageGrotesque-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(root)/dashboard"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(root)/inventory"
            options={{ headerShown: false }}
          />
          {/* 
        <Stack.Screen
        name="inventory/(general)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="inventory/(noheader)"
          options={{ headerShown: false }}
          />
          
        <Stack.Screen name="form" options={{ headerShown: false }} /> */}
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
