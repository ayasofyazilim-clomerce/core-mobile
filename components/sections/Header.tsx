import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

export function Header(props: BottomTabHeaderProps | NativeStackHeaderProps) {
  const router = useRouter();

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingBottom: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {'headerBackVisible' in props.options && (
          <Icon
            name="arrow-back"
            contentStyle={{ alignItems: 'flex-start' }}
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
