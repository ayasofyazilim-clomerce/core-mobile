import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import '~/global.css';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1" edges={['top']}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            header: undefined,
            headerShown: false,
            contentStyle: { backgroundColor: '#fff' },
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(public)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <PortalHost />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
