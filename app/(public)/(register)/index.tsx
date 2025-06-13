import { router } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Icon from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserData, loginWithCredentials } from '~/actions/core/auth/actions';
import { signUp } from '~/actions/core/auth/register';
import SubmitButton from '~/components/custom/Button.Submit';
import Input from '~/components/custom/Input';
import { Button } from '~/components/ui/button';
import { useStore } from '~/store/store';

export default function Register() {
  const { tenant, setProfile, setGrantedPolicies } = useStore();

  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const isSubmitDisabled = !usernameInput || !passwordInput || !emailInput || submitDisabled;

  async function signUpFunction() {
    setSubmitDisabled(true);
    try {
      const registerStatus = await signUp(emailInput, usernameInput, passwordInput);
      if ('type' in registerStatus && registerStatus.type === 'error') {
        setSubmitError(registerStatus.message);
        return;
      }
      const loginStatus = await loginWithCredentials(
        usernameInput,
        passwordInput,
        tenant?.tenantId || ''
      );

      if (loginStatus !== true) {
        setSubmitError(loginStatus);
      }
      if (loginStatus === true && (await getUserData(setProfile, setGrantedPolicies))) {
        router.replace('/registration-flow');
        return;
      }
    } catch (error) {
      console.log('Login error:', error);
    }
  }

  function onInputChange() {
    setSubmitDisabled(false);
    setSubmitError(null);
  }

  return (
    <SafeAreaView className="flex-1" edges={['bottom']}>
      <View className="flex-row justify-start px-6">
        <Button
          variant={'ghost'}
          onPress={() => router.replace('/(public)/login')}
          className="gap-2"
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="arrow-back" size={24} color="#333" />
          <Text className="text-xl font-bold">Geri</Text>
        </Button>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View className="flex flex-row">
              <Input
                label="Kullanıcı Adı"
                value={usernameInput}
                onChangeText={(text) => setUsernameInput(text)}
                onChange={onInputChange}
                icon={'person-outline'}
              />
            </View>
            <View className="mt-3 flex flex-row">
              <Input
                label="Email"
                value={emailInput}
                autoComplete="email"
                inputMode="email"
                keyboardType="email-address"
                onChangeText={(text) => setEmailInput(text)}
                onChange={onInputChange}
                icon={'mail-outline'}
              />
            </View>
            <View className="mt-3 flex flex-row">
              <Input
                label="Şifre"
                value={passwordInput}
                onChangeText={(text) => setPasswordInput(text)}
                onChange={onInputChange}
                secureTextEntry={!showPassword}
                icon={'lock-closed-outline'}
                right={
                  <Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>

            {submitDisabled && <Text className="mt-4 text-red-700">{submitError} </Text>}

            <SubmitButton
              icon={'arrow-forward'}
              iconColor="white"
              onSubmit={signUpFunction}
              disabled={isSubmitDisabled}>
              Hesap Oluştur
            </SubmitButton>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
  },
});
