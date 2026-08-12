type TokenResponse = {
    token_type: 'Bearer';
    expires_in: number;
    access_token: string;
};

type CachedToken = {
    token: string;
    expiresAt: number;
};

// cached per scope
const tokenCache = new Map<string, CachedToken>();

// Nais injects the full token endpoint; fallback for older setups
const azureAdTokenApi = () =>
    process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT || `https://login.microsoftonline.com/${process.env.AZURE_APP_TENANT_ID}/oauth2/v2.0/token`;

const fetchAccessToken = async (scope: string): Promise<TokenResponse | null> => {
    console.log('Refreshing access token!');

    try {
        const response = await fetch(azureAdTokenApi(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                accept: 'application/json',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.AZURE_APP_CLIENT_ID ?? '',
                client_secret: process.env.AZURE_APP_CLIENT_SECRET ?? '',
                scope,
            }).toString(),
        });

        const responseJson = (await response.json()) as TokenResponse;

        if (!response.ok) {
            console.error(`Failed to fetch access token: ${JSON.stringify(responseJson)}`);
            return null;
        }

        return responseJson;
    } catch (e) {
        console.error(`Failed to fetch access token: ${e}`);
        return null;
    }
};

export const getAzureadToken = async (scope: string): Promise<string | null> => {
    const cached = tokenCache.get(scope);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.token;
    }

    const accessToken = await fetchAccessToken(scope);
    if (!accessToken) {
        return null;
    }

    tokenCache.set(scope, {
        token: accessToken.access_token,
        expiresAt: Date.now() + (accessToken.expires_in - 60) * 1000,
    });

    return accessToken.access_token;
};
