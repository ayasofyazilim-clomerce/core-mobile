import { router, Stack } from 'expo-router';
import { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { logoutUser } from '~/actions/core/auth/logoutUser';
import SubmitButton from '~/components/custom/Button.Submit';
import Stepper from '~/components/custom/Stepper';
import { useRegistrationStore, useStore } from '~/store/store';

function RegistrationFlow() {
  const { profile } = useStore();
  const { scannedDocument } = useRegistrationStore();
  const isProfileCompleted = !!profile?.name && !!profile?.surname && !!profile.phoneNumber;
  const [isLivenessChecked, setLivenessChecked] = useState(false);

  async function redirectToHome() {
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/(tabs)');
  }
  async function redirectToLogin() {
    if (router.canDismiss()) {
      router.dismissAll();
    }
    await logoutUser();
    router.replace('/login');
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View className="mb-4">
          <Text className="text-base font-semibold text-black">
            Uygulamayı tam anlamıyla kullanabilmek için aşağıdaki adımları tamamlayın.
          </Text>
        </View>

        <Stepper
          step={1}
          title={'Hesap oluştur'}
          description={'Hesabını başarıyla oluşturdun.'}
          completed={true}
        />
        <Stepper
          step={2}
          title={'Pasaport doğrulaması'}
          description={'Profil bilgilerini doğrulamak için pasaportunuzu okutun.'}
          completed={!!scannedDocument}
          onPress={() => {
            router.push('/(public)/(register)/scan-document');
          }}
        />
        <Stepper
          step={3}
          title={'Profilini tamamla'}
          description={'Kisisel bilgilerini girerek profilini tamamla'}
          completed={isProfileCompleted}
          disabled={!scannedDocument}
          onPress={() => {
            router.push('/(public)/(register)/complete-profile');
          }}
        />
        <Stepper
          step={4}
          title={'Yüz doğrulaması'}
          description={'Profil bilgilerini doğrulamak için yüzünüzü tanıtın.'}
          completed={isLivenessChecked}
          disabled={!isProfileCompleted}
          onPress={() => {
            setLivenessChecked(true);
            router.push('/(public)/(register)/face-detection');
          }}
        />
        <View className="mt-4">
          <SubmitButton
            icon={'chevron-forward'}
            iconColor="white"
            onSubmit={async () => redirectToHome()}
            disabled={!isProfileCompleted}>
            Uygulamaya devam et
          </SubmitButton>
        </View>
        {!isProfileCompleted && (
          <View className="mt-4">
            <SubmitButton
              iconColor="white"
              variant={'secondary'}
              icon={'log-out'}
              onSubmit={async () => redirectToLogin()}>
              Çıkış yap
            </SubmitButton>
          </View>
        )}
      </View>
    </>
  );
}
export default RegistrationFlow;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
