import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

export function Header(props: BottomTabHeaderProps | NativeStackHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex flex-row items-center justify-between border-b border-gray-300 px-6 pb-3">
      <View className="flex flex-row items-center">
        {'headerBackVisible' in props.options && (
          <Icon
            name="arrow-back"
            className="mr-2"
            size={24}
            onPress={() => {
              router.back();
            }}
          />
        )}

        <Text className="text-xl font-bold">{props.options.title}</Text>
      </View>
      <Icon
        name="notifications-outline"
        size={24}
        onPress={() => {
          router.navigate('/(tabs)/profile/notifications');
        }}
      />
    </View>
  );
}
