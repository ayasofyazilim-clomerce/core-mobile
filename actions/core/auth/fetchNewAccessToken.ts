import { clearTokens, getToken, saveToken } from '~/actions/lib';

export async function fetchNewAccessTokenByRefreshToken() {
  try {
    console.log('Fetching new access token using refresh token...');
    const refreshToken = (await getToken('refresh')) || undefined;
    if (!refreshToken) {
      console.log('No refresh token found, removing access token...');

      await clearTokens();
      throw new Error('No refresh token found');
    }
    const response = await fetch('https://api.unirefund.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: 'Angular',
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });
    const data = await response.json();
    if (!response.ok) {
      console.log('refresh token error:' + response.statusText, response.body);
      throw new Error('Refresh token fetch failed');
    }
    console.log('New access token fetched successfully', Object.keys(data));
    await saveToken(data.access_token, 'access');
    await saveToken(data.refresh_token, 'refresh');
    return true;
  } catch (error) {
    console.log('Login error:', error);
    return false;
  }
}
