import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
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
    // "BricolageGrotesque-Bold": require("../../assets/fonts/BricolageGrotesque-Bold.ttf"),
    // "BricolageGrotesque-ExtraBold": require("../../assets/fonts/BricolageGrotesque-ExtraBold.ttf"),
    // "BricolageGrotesque-ExtraLight": require("../../assets/fonts/BricolageGrotesque-ExtraLight.ttf"),
    // "BricolageGrotesque-Light": require("../../assets/fonts/BricolageGrotesque-Light.ttf"),
    // "BricolageGrotesque-Medium": require("../../assets/fonts/BricolageGrotesque-Medium.ttf"),
    // "BricolageGrotesque-Regular": require("../../assets/fonts/BricolageGrotesque-Regular.ttf"),
    // "BricolageGrotesque-SemiBold": require("../../assets/fonts/BricolageGrotesque-SemiBold.ttf"),
    "Urbanist-Black": require("../../assets/fonts/Urbanist-Black.ttf"),
    "Urbanist-BlackItalic": require("../../assets/fonts/Urbanist-BlackItalic.ttf"),
    "Urbanist-Bold": require("../../assets/fonts/Urbanist-Bold.ttf"),
    "Urbanist-BoldItalic": require("../../assets/fonts/Urbanist-BoldItalic.ttf"),
    "Urbanist-ExtraBold": require("../../assets/fonts/Urbanist-ExtraBold.ttf"),
    "Urbanist-ExtraBoldItalic": require("../../assets/fonts/Urbanist-ExtraBoldItalic.ttf"),
    "Urbanist-ExtraLight": require("../../assets/fonts/Urbanist-ExtraLight.ttf"),
    "Urbanist-ExtraLightItalic": require("../../assets/fonts/Urbanist-ExtraLightItalic.ttf"),
    "Urbanist-Italic": require("../../assets/fonts/Urbanist-Italic.ttf"),
    "Urbanist-Light": require("../../assets/fonts/Urbanist-Light.ttf"),
    "Urbanist-LightItalic": require("../../assets/fonts/Urbanist-LightItalic.ttf"),
    "Urbanist-Medium": require("../../assets/fonts/Urbanist-Medium.ttf"),
    "Urbanist-MediumItalic": require("../../assets/fonts/Urbanist-MediumItalic.ttf"),
    "Urbanist-Regular": require("../../assets/fonts/Urbanist-Regular.ttf"),
    "Urbanist-SemiBold": require("../../assets/fonts/Urbanist-SemiBold.ttf"),
    "Urbanist-SemiBoldItalic": require("../../assets/fonts/Urbanist-SemiBoldItalic.ttf"),
    "Urbanist-Thin": require("../../assets/fonts/Urbanist-Thin.ttf"),
    "Urbanist-ThinItalic": require("../../assets/fonts/Urbanist-ThinItalic.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)/index" />
            <Stack.Screen name="(root)/dashboard" />
            <Stack.Screen name="(root)/inventory" />
            <Stack.Screen name="(root)/causes/index" />
            <Stack.Screen name="(root)/causes/new" />
            <Stack.Screen name="(root)/accounts" />
            <Stack.Screen name="(root)/accounts/index" />
            <Stack.Screen name="(root)/accounts/new" />
            <Stack.Screen name="(alt)/forms/accounts" />
            <Stack.Screen name="(alt)/forms/roles" />
          </Stack>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
