import { fetchRequest } from '~/helper-functions/customFetch';
import { getAccountServiceClient } from '~/actions/lib';
import type { GrantedPolicies } from './types';

export async function getUserProfileApi() {
  return await fetchRequest(async () => {
    const client = await getAccountServiceClient();
    return await client.profile.getApiAccountMyProfile();
  }, 'getUserProfileApi');
}
export async function getGrantedPoliciesApi() {
  return await fetchRequest(async () => {
    const client = await getAccountServiceClient();
    const response = await client.abpApplicationConfiguration.getApiAbpApplicationConfiguration({
      includeLocalizationResources: false,
    });
    return response.auth?.grantedPolicies as GrantedPolicies;
  }, 'getGrantedPoliciesApi');
}
export async function getTenantByNameApi(name: string) {
  return await fetchRequest(async () => {
    const client = await getAccountServiceClient();
    return await client.abpTenant.getApiAbpMultiTenancyTenantsByNameByName({ name });
  }, 'getTenantByNameApi');
}
