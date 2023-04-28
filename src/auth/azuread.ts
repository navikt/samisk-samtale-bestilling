import * as querystring from 'querystring';

import Cache from 'node-cache';

const cacheKey = 'authHeader';

const cache = new Cache({
    deleteOnExpire: true,
});

const azureAdTokenApi = `https://login.microsoftonline.com/${process.env.AZURE_APP_TENANT_ID}/oauth2/v2.0/token`;

type TokenResponse = {
    token_type: 'Bearer';
    expires_in: number;
    access_token: string;
};

const fetchAccessToken = async (
    scope: string
): Promise<TokenResponse | null> => {
    console.log('Refreshing access token...');

    const response = await fetch(azureAdTokenApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
        },
        body: querystring.stringify({
            grant_type: 'client_credentials',
            client_id: process.env.AZURE_APP_CLIENT_ID,
            client_secret: process.env.AZURE_APP_CLIENT_SECRET,
            scope: scope,
        }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
        console.error('Bad response from token service', responseJson);
        return null;
    }

    return responseJson;
};

export const getAzureadToken = async (scope: string) => {
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    const accessToken = await fetchAccessToken(scope);
    if (!accessToken) {
        return null;
    }

    cache.set(cacheKey, accessToken.access_token, accessToken.expires_in - 60);

    return accessToken.access_token;
};
