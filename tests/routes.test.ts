import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { AppDeps } from '../src/app.js';
import { BASE_PATH, createStubDeps } from './helpers.js';

const formBody = (fields: Record<string, string | string[]>) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(fields)) {
        for (const v of Array.isArray(value) ? value : [value]) {
            params.append(key, v);
        }
    }
    return params;
};

const validFields = {
    fornavn: 'Ola',
    etternavn: 'Nordmann',
    telefonnummer: '91234567',
    tidsrom: ['FORMIDDAG', 'ETTERMIDDAG'],
};

describe('routes', () => {
    let deps: AppDeps;
    let app: ReturnType<typeof createApp>;

    beforeEach(() => {
        deps = createStubDeps();
        app = createApp(deps);
    });

    it('serves nais probes on the exact paths from .nais/config.yaml', async () => {
        const alive = await app.request(`${BASE_PATH}/api/internal/isAlive`);
        expect(alive.status).toBe(200);
        expect(await alive.text()).toBe('I am alive!');

        const ready = await app.request(`${BASE_PATH}/api/internal/isReady`);
        expect(ready.status).toBe(200);
        expect(await ready.json()).toEqual({ message: 'I am ready!' });
    });

    it('matches trailing-slash variants (parity with the old Express app)', async () => {
        expect((await app.request(`${BASE_PATH}/`)).status).toBe(200);
        expect((await app.request(`${BASE_PATH}/nb/`)).status).toBe(200);
    });

    it('renders the se page on the root path and nb on /nb', async () => {
        const se = await app.request(BASE_PATH);
        expect(se.status).toBe(200);
        expect(await se.text()).toContain('<html lang="se">');

        const nb = await app.request(`${BASE_PATH}/nb`);
        expect(nb.status).toBe(200);
        expect(await nb.text()).toContain('<html lang="nb">');
    });

    it('sets the CSP header on page responses', async () => {
        const res = await app.request(BASE_PATH);
        expect(res.headers.get('Content-Security-Policy')).toBe("default-src 'self'");
    });

    it('renders the page even when the CSP header is unavailable', async () => {
        app = createApp(createStubDeps({ getCspHeader: vi.fn(async () => null) }));
        const res = await app.request(BASE_PATH);
        expect(res.status).toBe(200);
        expect(res.headers.get('Content-Security-Policy')).toBeNull();
    });

    it('returns 404 with the nav.no 404 page for unknown paths', async () => {
        const res = await app.request(`${BASE_PATH}/finnes-ikke`);
        expect(res.status).toBe(404);
        expect(await res.text()).toContain('Fant ikke siden');
    });

    it('returns the custom 404 page outside the basepath too', async () => {
        const res = await app.request('/helt-annen-sti');
        expect(res.status).toBe(404);
        expect(await res.text()).toContain('Fant ikke siden');
    });

    describe('form POST (no-JS baseline)', () => {
        it('redirects with 303 to ?sendt=1 on success (PRG)', async () => {
            const res = await app.request(BASE_PATH, { method: 'POST', body: formBody(validFields) });
            expect(res.status).toBe(303);
            expect(res.headers.get('location')).toBe(`${BASE_PATH}?sendt=1`);
            expect(deps.submitOrder).toHaveBeenCalledWith({
                fornavn: 'Ola',
                etternavn: 'Nordmann',
                telefonnummer: '91234567',
                tidsrom: 'BEGGE',
            });
        });

        it('redirects to the nb path for nb submissions', async () => {
            const res = await app.request(`${BASE_PATH}/nb`, { method: 'POST', body: formBody(validFields) });
            expect(res.status).toBe(303);
            expect(res.headers.get('location')).toBe(`${BASE_PATH}/nb?sendt=1`);
        });

        it('renders the confirmation on GET ?sendt=1', async () => {
            const res = await app.request(`${BASE_PATH}?sendt=1`);
            expect(res.status).toBe(200);
            const html = await res.text();
            expect(html).toContain('Meldingen din er sendt');
            expect(html).not.toContain('<form');
        });

        it('re-renders with 400, preserved values and localized errors on validation failure', async () => {
            const res = await app.request(`${BASE_PATH}/nb`, {
                method: 'POST',
                body: formBody({ fornavn: 'Ola', etternavn: '', telefonnummer: 'abc' }),
            });
            expect(res.status).toBe(400);
            const html = await res.text();
            expect(html).toContain('value="Ola"');
            expect(html).toContain('Skriv etternavnet ditt');
            expect(html).toContain('Skriv telefonnummeret ditt');
            expect(html).toContain('Velg tidspunkt for samtale');
            expect(deps.submitOrder).not.toHaveBeenCalled();
        });

        it('re-renders with 502 and a localized error when upstream fails', async () => {
            app = createApp(createStubDeps({ submitOrder: vi.fn(async () => ({ ok: false, status: 500 })) }));
            const res = await app.request(BASE_PATH, { method: 'POST', body: formBody(validFields) });
            expect(res.status).toBe(502);
            expect(await res.text()).toContain('Feil ved innsending');
        });
    });

    describe('form POST (enhanced, Accept: application/json)', () => {
        const jsonHeaders = { Accept: 'application/json' };

        it('returns {ok:true} on success', async () => {
            const res = await app.request(BASE_PATH, { method: 'POST', body: formBody(validFields), headers: jsonHeaders });
            expect(res.status).toBe(200);
            expect(await res.json()).toEqual({ ok: true });
        });

        it('returns 400 with field errors on validation failure', async () => {
            const res = await app.request(BASE_PATH, { method: 'POST', body: formBody({}), headers: jsonHeaders });
            expect(res.status).toBe(400);
            const json = await res.json();
            expect(json.ok).toBe(false);
            expect(json.errors).toMatchObject({ fornavn: true, etternavn: true, telefonnummer: true, tidsrom: true });
        });

        it('returns 502 when upstream fails', async () => {
            app = createApp(createStubDeps({ submitOrder: vi.fn(async () => ({ ok: false, status: 503 })) }));
            const res = await app.request(BASE_PATH, { method: 'POST', body: formBody(validFields), headers: jsonHeaders });
            expect(res.status).toBe(502);
            expect(await res.json()).toEqual({ ok: false });
        });
    });

    describe('legacy /api/proxy alias', () => {
        it('accepts the old JSON contract', async () => {
            const res = await app.request(`${BASE_PATH}/api/proxy`, {
                method: 'POST',
                body: JSON.stringify({ fornavn: 'Ola', etternavn: 'Nordmann', telefonnummer: '91234567', tidsrom: 'BEGGE' }),
                headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            });
            expect(res.status).toBe(200);
            expect(await res.json()).toEqual({ ok: true });
            expect(deps.submitOrder).toHaveBeenCalledWith({
                fornavn: 'Ola',
                etternavn: 'Nordmann',
                telefonnummer: '91234567',
                tidsrom: 'BEGGE',
            });
        });

        it('rejects invalid payloads with 400 without calling upstream', async () => {
            const res = await app.request(`${BASE_PATH}/api/proxy`, {
                method: 'POST',
                body: JSON.stringify({ tidsrom: 'ALDRI' }),
                headers: { 'Content-Type': 'application/json' },
            });
            expect(res.status).toBe(400);
            expect(deps.submitOrder).not.toHaveBeenCalled();
        });

        it('rejects non-JSON bodies with 400', async () => {
            const res = await app.request(`${BASE_PATH}/api/proxy`, { method: 'POST', body: 'ikke json' });
            expect(res.status).toBe(400);
        });
    });
});
