import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Store } from '~/store/types';
import { getGrantedPoliciesApi, getUserProfileApi } from '../AccountService/actions';
import { ENVIRONMENT } from '../../lib';
import * as SecureStore from 'expo-secure-store';

export async function isUserHasAnAccessToken() {
  const accessToken = (await AsyncStorage.getItem('accessToken')) || undefined;
  if (!accessToken) {
    return false;
  }
  return true;
}

export async function loginWithCredentials(username: string, password: string, tenantId?: string) {
  try {
    const env = (await SecureStore.getItemAsync('env')) as Store['env'];
    const response = await fetch('https://api.unirefund.com/connect/token', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(tenantId ? { __tenant: tenantId } : {}),
      },
      body: new URLSearchParams({
        username: username,
        password: password,
        client_id: 'Angular',
        grant_type: 'password',
        scope:
          'openid offline_access email profile phone roles address AdministrationService AccountService IdentityService SaasService SettingService TravellerService LocationService ContractService CRMService TagService RefundService ExportValidationService FinanceService ReportService FileService',
      }).toString(),
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.error_description) {
        return data.error_description as string;
      }
      return 'Unknown error';
    }
    await AsyncStorage.setItem('refreshToken', data.refresh_token);
    await AsyncStorage.setItem('accessToken', data.access_token);
    await fetch(`${ENVIRONMENT[env]}/api/m/?access_token=${data.access_token}`);
    return true;
  } catch (error) {
    console.log('Login error:', error);
    return 'Unknown error';
  }
}

export async function getUserData(
  setProfile: Store['setProfile'],
  setGrantedPolicies: Store['setGrantedPolicies']
) {
  const userProfile = await getUserProfileApi();
  if (!userProfile) {
    console.log('Error fetching user profile:', userProfile);
    return false;
  }
  setProfile(userProfile);
  const grantedPolicies = await getGrantedPoliciesApi();
  setGrantedPolicies(grantedPolicies);
  return userProfile;
}
