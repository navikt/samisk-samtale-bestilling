// Mock of the app's upstream services for local dev. Starts on import
// (dev-server.ts) or standalone via `pnpm mock`. Never built or shipped.
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const port = Number(process.env.MOCK_UPSTREAM_PORT) || 3999;

const app = new Hono();

// Azure AD token (AZURE_OPENID_CONFIG_TOKEN_ENDPOINT)
app.post('/token', (c) => c.json({ token_type: 'Bearer', expires_in: 3600, access_token: 'mock-token' }));

// tilbakemeldingsmottak-api (API_URL)
app.post('/rest/bestilling-av-samtale', async (c) => {
    console.log('[mock-upstream] mottok bestilling:', await c.req.json());
    return c.json({});
});

// kontaktinfo api (KONTAKTINFO_API_URL), fetched cross-origin by the browser
app.use('/kontaktinformasjon', cors());
app.get('/kontaktinformasjon', (c) =>
    c.json({
        epostadresse: 'test@nav.no',
        kanVarsles: true,
        mobiltelefonnummer: '99887766',
        reservert: false,
    })
);

serve({ fetch: app.fetch, port }, () => {
    console.log(`[mock-upstream] lytter på port ${port}`);
});
