import { Stack } from 'expo-router';
import { CouponProvider } from './context/CouponContext';

export default function RootLayout() {
  return (
    <CouponProvider>
      <Stack>
        <Stack.Screen name="tabs" options={{
          title:"Home",
          headerShown:false
        }} />
        <Stack.Screen name="matchDetail/[key]" options={{
          title:"Match Detail",
          headerShown:false
        }} />
      </Stack>
    </CouponProvider>
  );
}
