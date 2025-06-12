import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { getTenantByNameApi } from '~/actions/core/AccountService/actions';
import SubmitButton from '~/components/custom/Button.Submit';
import Input from '~/components/custom/Input';
import { Text } from '~/components/ui/text';
import { useDebounce } from '~/hooks/useDebounce';
import { useStore } from '~/store/store';

export default function Modal() {
  const router = useRouter();
  const { tenant, setTenant } = useStore();
  const [tenantNameInput, setTenantNameInput] = useState(tenant?.name || '');

  const [error, setError] = useState(false);
  const tenantName = useDebounce(tenantNameInput || '', 500);
  const getTenantName = async () => {
    const tenant = await getTenantByNameApi(tenantName);
    if (tenant?.name && tenant?.tenantId) {
      setTenant(tenant);
      setError(false);
      router.back();
      return;
    }
    setTenant(null);
    setError(true);
  };
  return (
    <View className="flex-1">
      <View className="items-end p-4">
        <Icon name="close" size={24} onPress={() => router.back()} />
      </View>
      <View style={styles.container}>
        <View>
          <View className="flex flex-row">
            <Input
              label="Tenant Adı"
              value={tenantNameInput}
              icon="earth"
              autoFocus={true}
              onChangeText={(text) => setTenantNameInput(text)}
            />
          </View>
          {error && <Text className="mt-2 text-red-700">Bu tenant adı bulunamadı. </Text>}
        </View>
        <SubmitButton
          className="mt-4"
          disabled={!tenantName}
          onSubmit={getTenantName}
          iconColor="#fff"
          icon={'chevron-forward'}>
          Devam Et
        </SubmitButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
