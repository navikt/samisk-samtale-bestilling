import { describe, expect, it } from 'vitest';
import 'html-validate/vitest';
import { Locale } from '../src/localization/localeUtils.js';
import { FormValues } from '../src/submit/validate.js';
import { OrderPageState } from '../src/views/OrderPage.js';
import { renderOrderPage } from '../src/views/render.js';
import { stubDecorator } from './helpers.js';

const emptyValues: FormValues = { fornavn: '', etternavn: '', telefonnummer: '', formiddag: false, ettermiddag: false };
const filledValues: FormValues = { fornavn: 'Ola', etternavn: 'Nordmann', telefonnummer: '+4791234567', formiddag: true, ettermiddag: false };

const states: Record<string, OrderPageState> = {
    'skjema (initielt)': {},
    'skjema med alle valideringsfeil': {
        values: emptyValues,
        errors: { fornavn: true, etternavn: true, telefonnummer: true, tidsrom: true },
    },
    'skjema med innsendingsfeil': { values: filledValues, submitError: true },
    kvittering: { confirmation: true },
};

const locales: Locale[] = ['se', 'nb'];

describe('rendered pages are valid HTML', () => {
    for (const locale of locales) {
        for (const [name, state] of Object.entries(states)) {
            it(`${locale}: ${name}`, () => {
                const html = renderOrderPage(locale, stubDecorator, state);
                expect(html).toHTMLValidate();
            });
        }
    }
});

describe('rendered page content', () => {
    it('escapes user-supplied values on re-render', () => {
        const html = renderOrderPage('nb', stubDecorator, {
            values: { ...emptyValues, fornavn: '<script>alert(1)</script>' },
            errors: { fornavn: false },
        });
        expect(html).not.toContain('<script>alert(1)</script>');
        expect(html).toContain('&lt;script&gt;');
    });

    it('renders lang and localized title per locale', () => {
        const se = renderOrderPage('se', stubDecorator, {});
        const nb = renderOrderPage('nb', stubDecorator, {});
        expect(se).toContain('<html lang="se">');
        expect(se).toContain('<title>Jearaldat bagadallama oažžut sámegillii telefovnnas</title>');
        expect(nb).toContain('<html lang="nb">');
        expect(nb).toContain('<title>Bestille en telefonsamtale med Nav på nordsamisk</title>');
    });

    it('loads enhance.js as an es module', () => {
        const html = renderOrderPage('se', stubDecorator, {});
        expect(html).toContain('/static/enhance.js" type="module">');
    });

    it('places decorator fragments in the right positions', () => {
        const html = renderOrderPage('se', stubDecorator, {});
        expect(html.indexOf('stub-decorator-header')).toBeGreaterThan(html.indexOf('head-assets'));
        expect(html.indexOf('maincontent')).toBeGreaterThan(html.indexOf('stub-decorator-header'));
        expect(html.indexOf('stub-decorator-footer')).toBeGreaterThan(html.indexOf('maincontent'));
        expect(html.indexOf('stub-decorator.js')).toBeGreaterThan(html.indexOf('stub-decorator-footer'));
    });

    it('preserves posted values and shows field errors on validation re-render', () => {
        const html = renderOrderPage('nb', stubDecorator, {
            values: { ...filledValues, telefonnummer: '' },
            errors: { telefonnummer: true },
        });
        expect(html).toContain('value="Ola"');
        expect(html).toContain('Skriv telefonnummeret ditt');
        expect(html).toContain('aria-invalid="true"');
        expect(html).toContain('checked');
    });

    it('renders confirmation instead of form when confirmed', () => {
        const html = renderOrderPage('nb', stubDecorator, { confirmation: true });
        expect(html).toContain('Meldingen din er sendt');
        expect(html).not.toContain('<form');
    });
});
