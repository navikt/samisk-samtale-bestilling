import { describe, expect, it } from 'vitest';
import { renderOrderPage } from '../src/views/render.js';
import { stubDecorator } from './helpers.js';

// enhance.js is not executed in tests (no jsdom); this pins the DOM contract it relies on.
const HOOKS = [
    'data-enhance',
    'data-kontaktinfo-url="',
    'data-field="fornavn"',
    'data-field="etternavn"',
    'data-field="telefonnummer"',
    'data-field="tidsrom"',
    'data-error-message="',
    'id="fornavn-error"',
    'id="etternavn-error"',
    'id="telefonnummer-error"',
    'id="tidsrom-error"',
    'name="tidsrom"',
    'class="app-loader"',
    'class="app-panel',
    'id="js-success"',
    'id="js-submit-error"',
    'id="error-message-template"',
    'type="submit"',
];

describe('enhance.js DOM contract', () => {
    const html = renderOrderPage('nb', stubDecorator, {});

    it.each(HOOKS)('rendered form contains %s', (hook) => {
        expect(html).toContain(hook);
    });

    it('server-rendered submit error alert is removable by the retry cleanup', () => {
        const errorHtml = renderOrderPage('nb', stubDecorator, {
            values: { fornavn: 'Ola', etternavn: 'Nordmann', telefonnummer: '91234567', formiddag: true, ettermiddag: false },
            submitError: true,
        });
        // visible server-rendered alert + hidden js variant, both cleaned up on retry
        expect(errorHtml.match(/class="app-error/g)?.length).toBe(2);
    });
});
