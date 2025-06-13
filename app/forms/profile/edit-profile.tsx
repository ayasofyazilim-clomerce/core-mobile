import { router } from 'expo-router';
import { useState } from 'react';

import { getLocales } from 'expo-localization';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  getCountryByCca2,
  ICountry,
  isValidPhoneNumber,
  PhoneInputProps,
} from 'react-native-international-phone-number';
import { getUserData } from '~/actions/core/auth/actions';
import { editProfile } from '~/actions/core/auth/register';
import SubmitButton from '~/components/custom/Button.Submit';
import Input, { InputPhone } from '~/components/custom/Input';
import { useRegistrationStore, useStore } from '~/store/store';
import { Text } from '~/components/ui/text';

export default function EditProfileForm() {
  const locales = getLocales();
  const { profile, setProfile, setGrantedPolicies } = useStore();
  const { scannedDocument } = useRegistrationStore();
  const [nameInput, setNameInput] = useState(
    scannedDocument?.fields?.firstName || profile?.name || ''
  );
  const [surnameInput, setSurnameInput] = useState(
    scannedDocument?.fields?.lastName || profile?.surname || ''
  );
  const [phoneInput, setPhoneInput] = useState('');
  const defaultCountryCode = locales?.[0].regionCode || 'TR';

  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState<ICountry | null>(
    getCountryByCca2(defaultCountryCode) || null
  );

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const isPhoneValid = selectedPhoneCountry && isValidPhoneNumber(phoneInput, selectedPhoneCountry);
  const isSubmitDisabled = !nameInput || !surnameInput || !isPhoneValid || submitDisabled;

  function handlePhoneInputchange(phoneNumber: string) {
    setPhoneInput(phoneNumber);
  }

  function handlePhoneInputCountryChange(country: ICountry | null) {
    setSelectedPhoneCountry(country);
  }
  function onInputChange() {
    setSubmitDisabled(false);
    setSubmitError(null);
  }

  async function onSubmit() {
    setSubmitDisabled(true);
    setSubmitError(null);

    if (!isPhoneValid) {
      setSubmitError('Lütfen geçerli bir telefon numarası girin.');
      return;
    }

    const updatedProfile = {
      ...profile,
      name: nameInput,
      surname: surnameInput,
      phoneNumber: selectedPhoneCountry.callingCode + phoneInput.replaceAll(' ', ''),
    };

    const response = await editProfile(
      profile!,
      updatedProfile.name,
      updatedProfile.surname,
      updatedProfile.phoneNumber
    );

    if ('type' in response && response.type === 'error') {
      setSubmitError(response.message);
      setSubmitDisabled(false);
      return;
    }

    await getUserData(setProfile, setGrantedPolicies);
    router.back();
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View className="flex flex-row">
            <Input
              label="Adınız"
              value={nameInput}
              onChangeText={(text) => setNameInput(text)}
              onChange={onInputChange}
              icon="person-outline"
            />
          </View>
          <View className="mt-3 flex flex-row">
            <Input
              label="Soyadınız"
              value={surnameInput}
              onChangeText={(text) => setSurnameInput(text)}
              onChange={onInputChange}
              icon="person-outline"
            />
          </View>

          <View className="mt-3 flex flex-row">
            <InputPhone
              label="Telefon"
              defaultValue={profile?.phoneNumber || undefined}
              value={phoneInput}
              popularCountries={['GB', 'PT', 'TR']}
              defaultCountry={
                (defaultCountryCode as PhoneInputProps['defaultCountry']) || undefined
              }
              onChangePhoneNumber={handlePhoneInputchange}
              selectedCountry={selectedPhoneCountry}
              onChangeSelectedCountry={handlePhoneInputCountryChange}
              language="tr"
            />
          </View>
          {submitDisabled && <Text className="mt-4 text-red-700">{submitError} </Text>}

          <SubmitButton
            icon={'chevron-forward'}
            iconColor="white"
            onSubmit={onSubmit}
            disabled={isSubmitDisabled}>
            Profili Kaydet
          </SubmitButton>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
