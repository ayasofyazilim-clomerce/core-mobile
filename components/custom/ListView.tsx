import { Pressable, Text } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { IoniconsType } from '~/lib/types';

export function ListItem({
  title,
  icon,
  isDisabled = false,
  onPress,
}: {
  title: string;
  icon: IoniconsType;
  isDisabled?: boolean;
  onPress?(): void;
}) {
  return (
    <Pressable
      className={`${isDisabled ? 'opacity-50' : ''} flex flex-row items-center rounded-lg p-2 active:bg-gray-50`}
      disabled={isDisabled}
      onPress={onPress}>
      <Icon name={icon} color={'#080d19'} size={28} />
      <Text className="ml-3 mr-auto text-lg text-[#080d19]">{title}</Text>
      <Icon name="chevron-forward" color={'#080d19'} size={22} />
    </Pressable>
  );
}
export function ListView({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Pressable className="mb-8">
      <Text className="mb-2 font-bold">{title}</Text>
      {children}
    </Pressable>
  );
}
