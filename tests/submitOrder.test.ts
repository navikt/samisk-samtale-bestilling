import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SubmitData } from '../src/submit/validate.js';

const data: SubmitData = { fornavn: 'Ola', etternavn: 'Nordmann', telefonnummer: '91234567', tidsrom: 'FORMIDDAG' };

const tokenResponse = (status = 200) =>
    new Response(JSON.stringify({ token_type: 'Bearer', expires_in: 3600, access_token: 'test-token' }), { status });

// modules reset per test: azureToken caches in module state
const importFresh = async () => (await import('../src/submit/submitOrder.js')).submitOrder;

describe('submitOrder', () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.resetModules();
        fetchMock.mockReset();
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('posts validated data upstream with the bearer token', async () => {
        fetchMock.mockResolvedValueOnce(tokenResponse()).mockResolvedValueOnce(new Response('', { status: 200 }));

        const submitOrder = await importFresh();
        const result = await submitOrder(data);

        expect(result).toEqual({ ok: true, status: 200 });
        expect(fetchMock).toHaveBeenCalledTimes(2);

        const [tokenUrl] = fetchMock.mock.calls[0];
        expect(String(tokenUrl)).toContain('login.microsoftonline.com');

        const [upstreamUrl, upstreamInit] = fetchMock.mock.calls[1];
        expect(String(upstreamUrl)).toBe('http://tilbakemeldingsmottak-api.test/rest/bestilling-av-samtale');
        expect(upstreamInit.headers.Authorization).toBe('Bearer test-token');
        expect(JSON.parse(upstreamInit.body)).toEqual(data);
    });

    it('caches the token between submissions', async () => {
        fetchMock
            .mockResolvedValueOnce(tokenResponse())
            .mockResolvedValueOnce(new Response('', { status: 200 }))
            .mockResolvedValueOnce(new Response('', { status: 200 }));

        const submitOrder = await importFresh();
        await submitOrder(data);
        await submitOrder(data);

        // 1 token call + 2 submissions
        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(String(fetchMock.mock.calls[2][0])).toContain('bestilling-av-samtale');
    });

    it('fails without calling upstream when the token fetch fails', async () => {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'nope' }), { status: 401 }));

        const submitOrder = await importFresh();
        const result = await submitOrder(data);

        expect(result).toEqual({ ok: false, status: 500 });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('reports upstream failure statuses', async () => {
        fetchMock.mockResolvedValueOnce(tokenResponse()).mockResolvedValueOnce(new Response('', { status: 500 }));

        const submitOrder = await importFresh();
        const result = await submitOrder(data);

        expect(result).toEqual({ ok: false, status: 500 });
    });

    it('handles network errors against upstream', async () => {
        fetchMock.mockResolvedValueOnce(tokenResponse()).mockRejectedValueOnce(new Error('ECONNREFUSED'));

        const submitOrder = await importFresh();
        const result = await submitOrder(data);

        expect(result).toEqual({ ok: false, status: 500 });
    });
});
