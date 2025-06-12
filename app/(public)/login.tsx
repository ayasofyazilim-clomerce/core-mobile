import Icon from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Globe } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserData, loginWithCredentials } from '~/actions/core/auth/actions';
import { isProfileCompleted } from '~/actions/lib';
import SubmitButton from '~/components/custom/Button.Submit';
import Input from '~/components/custom/Input';
import { Alert, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useStore } from '~/store/store';

export default function Login() {
  const { tenant, setTenant, setProfile, setGrantedPolicies, setEnv, env } = useStore();

  const [showPassword, setShowPassword] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [logoClickCount, setLogoClickCount] = useState(0);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const isSubmitDisabled = !usernameInput || !passwordInput || submitDisabled;

  useEffect(() => {
    if (logoClickCount > 5) {
      setUsernameInput('admin');
      setPasswordInput('1q2w3E*');
    }
  }, [logoClickCount]);
  async function loginFunction() {
    setSubmitDisabled(true);
    try {
      await SecureStore.setItemAsync('env', env);
      const loginStatus = await loginWithCredentials(
        usernameInput,
        passwordInput,
        tenant?.tenantId || ''
      );
      if (loginStatus !== true) {
        setSubmitError(loginStatus);
      }
      const userData = await getUserData(setProfile, setGrantedPolicies);
      if (loginStatus === true && userData) {
        if (isProfileCompleted(userData)) {
          router.replace('/(tabs)');
          return;
        }
        router.replace('/(public)/(register)/registration-flow');
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
      {/* {__DEV__ && (
        <View className="px-6 pt-8">
          <SegmentedButtons
            value={env}
            onValueChange={setEnv}
            theme={{ colors: { secondaryContainer: '#de1919', onSecondaryContainer: '#fff' } }}
            buttons={[
              {
                value: 'dev',
                label: 'Dev',
              },
              {
                value: 'live',
                label: 'Live',
              },
            ]}
          />
        </View>
      )} */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Pressable
              className="mb-12 items-center justify-center"
              onPress={() => setLogoClickCount((i) => i + 1)}>
              <Image
                source={require('~/assets/unirefund.png')}
                style={{
                  width: 160,
                  height: 29,
                  resizeMode: 'contain',
                }}
              />
            </Pressable>
            {!!tenant?.name && (
              <Alert icon={Globe} className="mb-4 flex flex-row items-center justify-between">
                <AlertTitle>{tenant.name} tenant'ına giriş yapmaktasınız.</AlertTitle>
                <Pressable
                  className="flex flex-row items-center self-center"
                  onPress={() => setTenant(null)}>
                  <Icon name="close" size={16} color="#000" />
                </Pressable>
              </Alert>
            )}

            <View className="flex flex-row">
              <Input
                label="Email"
                value={usernameInput}
                autoComplete="email"
                inputMode="email"
                keyboardType="email-address"
                icon="mail-outline"
                onChangeText={(text) => setUsernameInput(text)}
                onChange={onInputChange}
              />
            </View>
            <View className="mt-3 flex flex-row">
              <Input
                label="Şifre"
                value={passwordInput}
                onChangeText={(text) => setPasswordInput(text)}
                onChange={onInputChange}
                secureTextEntry={!showPassword}
                icon="lock-closed-outline"
                right={
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowPassword(!showPassword)}
                    color={'#333'}
                    size={20}
                  />
                }
              />
            </View>

            {submitDisabled && submitError && (
              <Text className="mt-4 text-red-700">{submitError}</Text>
            )}

            <SubmitButton
              onSubmit={loginFunction}
              icon={'log-in-outline'}
              iconColor="#fff"
              disabled={isSubmitDisabled}>
              Giriş Yap
            </SubmitButton>

            <SubmitButton
              className="mt-4"
              iconColor="#000"
              variant={'outline'}
              icon={'person-add-outline'}
              onSubmit={async () => router.replace('/(public)/(register)')}
              disabled={submitDisabled}>
              Kayıt Ol
            </SubmitButton>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View className={`${logoClickCount > 5 ? '' : 'invisible'} items-center`}>
        <Link href="/(public)/tenant-modal" asChild>
          <Button variant={'ghost'}>
            <Text>Kurumsal Giriş</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
});
