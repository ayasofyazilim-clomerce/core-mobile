import * as SecureStore from 'expo-secure-store';
import { clearTokens, ENVIRONMENT, getAccountServiceClient } from '../../lib';

export async function logoutUser() {
  const client = await getAccountServiceClient();
  await client.login.getApiAccountLogout();

  await clearTokens();

  const env = (await SecureStore.getItemAsync('env')) as 'dev' | 'live';
  await fetch(`${ENVIRONMENT[env]}/api/m/logout`);

  await SecureStore.setItemAsync('env', 'live');
}
