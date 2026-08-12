import { describe, expect, it } from 'vitest';
import { parseFormBody, parseJsonBody, validateForm } from '../src/submit/validate.js';

const validBody = {
    fornavn: 'Ola',
    etternavn: 'Nordmann',
    telefonnummer: '91234567',
    tidsrom: 'FORMIDDAG',
};

describe('parseFormBody', () => {
    it('parses single tidsrom value', () => {
        expect(parseFormBody(validBody)).toEqual({
            fornavn: 'Ola',
            etternavn: 'Nordmann',
            telefonnummer: '91234567',
            formiddag: true,
            ettermiddag: false,
        });
    });

    it('parses multiple tidsrom values', () => {
        const values = parseFormBody({ ...validBody, tidsrom: ['FORMIDDAG', 'ETTERMIDDAG'] });
        expect(values.formiddag).toBe(true);
        expect(values.ettermiddag).toBe(true);
    });

    it('trims whitespace and tolerates missing/non-string fields', () => {
        const values = parseFormBody({ fornavn: '  Ola  ', telefonnummer: 123 });
        expect(values.fornavn).toBe('Ola');
        expect(values.etternavn).toBe('');
        expect(values.telefonnummer).toBe('');
    });

    it('ignores unknown tidsrom values', () => {
        const values = parseFormBody({ ...validBody, tidsrom: 'HACKED' });
        expect(values.formiddag).toBe(false);
        expect(values.ettermiddag).toBe(false);
    });
});

describe('parseJsonBody (legacy /api/proxy shape)', () => {
    it.each([
        ['FORMIDDAG', true, false],
        ['ETTERMIDDAG', false, true],
        ['BEGGE', true, true],
    ])('maps tidsrom %s', (tidsrom, formiddag, ettermiddag) => {
        const values = parseJsonBody({ ...validBody, tidsrom });
        expect(values.formiddag).toBe(formiddag);
        expect(values.ettermiddag).toBe(ettermiddag);
    });
});

describe('validateForm', () => {
    const validValues = parseFormBody(validBody);

    it('accepts valid input and maps tidsrom', () => {
        const result = validateForm(validValues);
        expect(result).toEqual({
            ok: true,
            data: { fornavn: 'Ola', etternavn: 'Nordmann', telefonnummer: '91234567', tidsrom: 'FORMIDDAG' },
        });
    });

    it('maps both checkboxes to BEGGE and single afternoon to ETTERMIDDAG', () => {
        const begge = validateForm({ ...validValues, formiddag: true, ettermiddag: true });
        expect(begge.ok && begge.data.tidsrom).toBe('BEGGE');
        const ettermiddag = validateForm({ ...validValues, formiddag: false, ettermiddag: true });
        expect(ettermiddag.ok && ettermiddag.data.tidsrom).toBe('ETTERMIDDAG');
    });

    it('flags empty names', () => {
        const result = validateForm({ ...validValues, fornavn: '', etternavn: '' });
        expect(result.ok).toBe(false);
        expect(!result.ok && result.errors).toMatchObject({ fornavn: true, etternavn: true });
    });

    it.each([
        ['91234567', true],
        ['+4791234567', true],
        ['9123456', false],
        ['91 23 45 67', false],
        ['ni-en-to-tre', false],
        ['', false],
    ])('validates phone number %s -> valid: %s', (telefonnummer, valid) => {
        const result = validateForm({ ...validValues, telefonnummer });
        expect(result.ok).toBe(valid);
    });

    it('rejects absurdly long values', () => {
        const result = validateForm({ ...validValues, fornavn: 'a'.repeat(1001), telefonnummer: '9'.repeat(101) });
        expect(result.ok).toBe(false);
        expect(!result.ok && result.errors).toMatchObject({ fornavn: true, telefonnummer: true });
    });

    it('flags missing tidsrom', () => {
        const result = validateForm({ ...validValues, formiddag: false, ettermiddag: false });
        expect(result.ok).toBe(false);
        expect(!result.ok && result.errors.tidsrom).toBe(true);
    });
});
