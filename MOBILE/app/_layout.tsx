import "../global.css";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import BottomNav from "@/components/BottomNav";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <StatusBar style="auto" />
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
                  <Stack.Screen name="index" />
                </Stack>
              </View>
              {/* Giriş yapıldıysa her ekranda sabit alt navigasyon */}
              <BottomNav />
            </View>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
