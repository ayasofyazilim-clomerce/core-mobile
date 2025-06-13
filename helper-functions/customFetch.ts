import { ApiError } from '@ayasofyazilim/core-saas/AccountService';
import { fetchNewAccessTokenByRefreshToken } from '~/actions/core/auth/fetchNewAccessToken';
import { clearTokens } from '~/actions/lib';

export async function fetchRequest<T>(request: () => Promise<T>, apiName: string) {
  let res = null;
  try {
    const response = await request();
    res = response;
  } catch (err) {
    console.log(err);
    if (err instanceof ApiError) {
      if (err.status === 401) {
        // Refresh the token and retry the request
        if (await fetchNewAccessTokenByRefreshToken()) {
          res = (await fetchRequest(request, apiName)) as T | undefined;
          console.log(res);
          return res;
        } else {
          console.log('Failed to refresh token');
          await clearTokens();
          res = new Error('Failed to refresh token');
        }
      }
      res = err;
    } else if (typeof err === 'string') {
      res = new Error(err);
    } else {
      res = new Error('An unknown error occurred');
    }
  }
  if (res instanceof Error) {
    console.log(`Error fetching ${apiName};`, res);
    return undefined;
  }
  return res;
}
