import Icon from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { IoniconsType } from '~/lib/types';
import { cn } from '~/lib/utils';
import { Button, ButtonProps } from '../ui/button';
import { Text } from '../ui/text';

type SubmitButtonProps<T> = ButtonProps & {
  onSubmit: () => Promise<T>;
  reActivate?: boolean;
  children?: React.ReactNode | string;
  icon?: IoniconsType;
  iconColor?: string;
};

function SubmitButton(args: SubmitButtonProps<any>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit() {
    setIsSubmitting(true);
    args.onSubmit().then(() => setIsSubmitting(false));
  }

  return (
    <Button
      {...args}
      onPress={onSubmit}
      className={cn(
        'my-2 flex min-h-12 flex-row items-center justify-center gap-2 rounded-full',
        args.className
      )}
      disabled={args.disabled || isSubmitting}>
      {isSubmitting ? (
        <ActivityIndicator size="small" color={args.iconColor} />
      ) : (
        args.icon && <Icon name={args.icon} size={20} color={args.iconColor} />
      )}
      <Text>{args.children}</Text>
    </Button>
  );
}

export default SubmitButton;
