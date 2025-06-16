import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(register)/index" options={{ headerShown: false }} />

      <Stack.Screen
        name="tenant-modal"
        options={{
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
