export type Tidsrom = 'FORMIDDAG' | 'ETTERMIDDAG' | 'BEGGE';

export type SubmitData = {
    fornavn: string;
    etternavn: string;
    telefonnummer: string;
    tidsrom: Tidsrom;
};

export type FormValues = {
    fornavn: string;
    etternavn: string;
    telefonnummer: string;
    formiddag: boolean;
    ettermiddag: boolean;
};

export type FieldErrors = {
    fornavn?: boolean;
    etternavn?: boolean;
    telefonnummer?: boolean;
    tidsrom?: boolean;
};

export type ValidationResult = { ok: true; data: SubmitData } | { ok: false; errors: FieldErrors };

// upper bounds are abuse protection only, far above any real input
const MAX_NAME_LENGTH = 1000;
const MAX_PHONE_LENGTH = 100;

const isValidName = (name: string) => name.length > 0 && name.length <= MAX_NAME_LENGTH;
const isValidPhoneNumber = (phoneNumber: string) => phoneNumber.length <= MAX_PHONE_LENGTH && /^\+?\d{8,}$/.test(phoneNumber);

const asTrimmedString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

// form POST: tidsrom arrives as 0-2 checkbox values
export const parseFormBody = (body: Record<string, unknown>): FormValues => {
    const tidsrom = Array.isArray(body.tidsrom) ? body.tidsrom : [body.tidsrom];
    return {
        fornavn: asTrimmedString(body.fornavn),
        etternavn: asTrimmedString(body.etternavn),
        telefonnummer: asTrimmedString(body.telefonnummer),
        formiddag: tidsrom.includes('FORMIDDAG'),
        ettermiddag: tidsrom.includes('ETTERMIDDAG'),
    };
};

// legacy JSON body from /api/proxy
export const parseJsonBody = (body: Record<string, unknown>): FormValues => ({
    fornavn: asTrimmedString(body.fornavn),
    etternavn: asTrimmedString(body.etternavn),
    telefonnummer: asTrimmedString(body.telefonnummer),
    formiddag: body.tidsrom === 'FORMIDDAG' || body.tidsrom === 'BEGGE',
    ettermiddag: body.tidsrom === 'ETTERMIDDAG' || body.tidsrom === 'BEGGE',
});

export const validateForm = (values: FormValues): ValidationResult => {
    const errors: FieldErrors = {
        fornavn: !isValidName(values.fornavn),
        etternavn: !isValidName(values.etternavn),
        telefonnummer: !isValidPhoneNumber(values.telefonnummer),
        tidsrom: !(values.formiddag || values.ettermiddag),
    };

    if (errors.fornavn || errors.etternavn || errors.telefonnummer || errors.tidsrom) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        data: {
            fornavn: values.fornavn,
            etternavn: values.etternavn,
            telefonnummer: values.telefonnummer,
            tidsrom: values.formiddag && values.ettermiddag ? 'BEGGE' : values.formiddag ? 'FORMIDDAG' : 'ETTERMIDDAG',
        },
    };
};
