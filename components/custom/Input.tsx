import { Text, View } from 'react-native';
import PhoneInput, { PhoneInputProps } from 'react-native-international-phone-number';

import Icon from '@expo/vector-icons/Ionicons';
import { TextInput, type TextInputProps } from 'react-native';
import { Input as ReusableInput } from '~/components/ui/input';
import { IoniconsType } from '~/lib/types';

type InputProps = TextInputProps & {
  ref?: React.RefObject<TextInput>;
  label?: string;
  icon?: IoniconsType;
  right?: React.ReactNode;
};

function Input(args: InputProps) {
  return (
    <View className="mb-2 flex-1">
      {args.label && <Text className="mb-2 font-bold text-gray-600">{args.label}</Text>}
      <View className="relative">
        {args.icon && (
          <Icon
            name={args.icon}
            size={20}
            color="#333"
            className="absolute left-4 top-5 z-10 m-auto"
          />
        )}
        <ReusableInput
          inputMode={args.inputMode}
          autoComplete={args.autoComplete}
          autoCapitalize={args.autoCapitalize}
          keyboardType={args.keyboardType}
          secureTextEntry={args.secureTextEntry}
          value={args.value}
          onChangeText={args.onChangeText}
          onChange={args.onChange}
          className="mb-2 min-h-16 rounded-md border-2 pl-12"
        />
        {args.right && <View className="z-100 absolute right-5 top-5 flex">{args.right}</View>}
      </View>
    </View>
  );
}

export function InputPhone(args: PhoneInputProps & { label: string }) {
  return (
    <View className="mb-2 flex-1">
      <Text className="mb-2 font-bold text-gray-600">{args.label}</Text>
      <PhoneInput
        {...args}
        language="tr"
        phoneInputStyles={{
          container: {
            backgroundColor: '#fff',
            borderRadius: 8,
            borderWidth: 2,
            height: 56,
            borderColor: '#ddd',
          },
          flagContainer: {
            backgroundColor: 'white',
            borderRightWidth: 1,
            borderColor: '#ddd',
          },
          caret: { display: 'none' },
          divider: { display: 'none' },
        }}
      />
    </View>
  );
}

export default Input;
