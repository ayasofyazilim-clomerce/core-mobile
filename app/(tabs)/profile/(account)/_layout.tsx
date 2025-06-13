import { Stack } from 'expo-router';
import { Header } from '~/components/sections/Header';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        header: Header,
        headerBackVisible: true,
        contentStyle: { backgroundColor: '#fff' },
      }}>
      <Stack.Screen name="edit-profile" options={{ title: 'Hesap Ayarları' }} />
      <Stack.Screen name="change-password" options={{ title: 'Şifre Değiştir' }} />
      <Stack.Screen name="registration-flow" options={{ title: 'Hesap Doğrulama' }} />
    </Stack>
  );
}
