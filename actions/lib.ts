import {
  AccountServiceClient,
  Volo_Abp_Account_ProfileDto,
} from '@ayasofyazilim/core-saas/AccountService';
import * as SecureStore from 'expo-secure-store';

const HEADERS = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
};

export const ENVIRONMENT = {
  dev: 'http://81.213.78.69:1441',
  live: 'https://uat.unirefund.com',
};

export function isProfileCompleted(profile: Volo_Abp_Account_ProfileDto | undefined) {
  return (
    !!profile?.name && !!profile?.surname && !!profile.phoneNumber && !!profile.phoneNumberConfirmed
  );
}

export async function getAccountServiceClient(customHeaders?: Record<string, string>) {
  const accessToken = (await getToken('access')) || undefined;

  return new AccountServiceClient({
    TOKEN: accessToken,
    BASE: 'https://api.unirefund.com',
    HEADERS: { ...HEADERS, ...customHeaders },
  });
}

export async function saveToken(token: string, type: 'access' | 'refresh') {
  function splitStringByBytes(input: string, maxBytes: number = 2048): string[] {
    const encoder = new TextEncoder();
    const result: string[] = [];
    let current = '';
    let currentBytes = 0;

    for (const char of input) {
      const charBytes = encoder.encode(char).length;
      if (currentBytes + charBytes > maxBytes) {
        result.push(current);
        current = char;
        currentBytes = charBytes;
      } else {
        current += char;
        currentBytes += charBytes;
      }
    }

    if (current) {
      result.push(current);
    }

    return result;
  }

  const parts = splitStringByBytes(token);
  for (let i = 0; i < parts.length; i++) {
    await SecureStore.setItemAsync(`${type}TokenPart${i}`, parts[i]);
  }
  await SecureStore.setItemAsync(`${type}TokenPartCount`, parts.length.toString());
}
export async function getToken(type: 'access' | 'refresh') {
  const count = parseInt((await SecureStore.getItemAsync(`${type}TokenPartCount`)) || '0', 10);
  if (count === 0) return undefined;

  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const part = await SecureStore.getItemAsync(`${type}TokenPart${i}`);
    if (part) {
      parts.push(part);
    }
  }
  return parts.join('');
}
export async function clearTokens() {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}
