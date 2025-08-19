import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import AuthProvider, { useAuth } from "./hooks/AuthContext";
import CouponProvider from "./hooks/CouponContext";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/auth/login"); // "/auth" şeklinde mutlak yol kullanın
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return null; // Veya bir loading spinner dönebilirsiniz
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CouponProvider>
        <Stack screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen
            name="auth"
            options={{ title: "Login", headerShown: false }}
          />
          <AuthWrapper>
            <Stack.Screen
              name="tabs"
              options={{ title: "Home", headerShown: false }}
            />
            <Stack.Screen
              name="matchDetail/[key]"
              options={{ title: "Match Detail", headerShown: false }}
            />
          </AuthWrapper>
        </Stack>
      </CouponProvider>
    </AuthProvider>
  );
}