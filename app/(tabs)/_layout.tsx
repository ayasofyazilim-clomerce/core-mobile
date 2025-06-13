import AntDesign from '@expo/vector-icons/AntDesign';
import { NovuProvider } from '@novu/react-native';
import { Tabs, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { Header } from '~/components/sections/Header';

export default function TabLayout() {
  const router = useRouter();

  return (
    <NovuProvider
      subscriber="008f528-e16d-73e3-511d-3a17dd3174d2"
      applicationIdentifier="4o6o47EJm5yN"
      apiUrl="https://novuapi.clomerce.com"
      // socketUrl="https://ws.novu.co"
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'black',
          sceneStyle: { backgroundColor: '#fff' },
          header: Header,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Ev',
            tabBarIcon: ({ color }) => <Icon name="home-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            tabBarItemStyle: {
              justifyContent: 'center',
              alignItems: 'center',
            },
            tabBarButton: () => (
              <Pressable
                onPress={() => router.push('/(tabs)/two')}
                className="absolute bottom-2.5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-[#de1919]"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 5,
                  elevation: 8,
                }}>
                <Icon name="location" size={28} color={'#fff'} />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: '/(tabs)/profile',
            title: 'Profil',
            headerShown: false,
            tabBarIcon: ({ color }) => <Icon name="person-outline" size={24} color={color} />,
          }}
        />
      </Tabs>
    </NovuProvider>
  );
}
