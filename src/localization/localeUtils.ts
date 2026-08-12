import { localeModuleNb } from './nb.js';
import { localeModuleSe } from './se.js';

export type Locale = 'se' | 'nb';

export const defaultLocale: Locale = 'se';

export type LocaleStringId =
    | 'tittel'
    | 'fornavn'
    | 'etternavn'
    | 'telefonnummer'
    | 'tidsrom'
    | 'tidsromFormiddag'
    | 'tidsromEttermiddag'
    | 'ingress'
    | 'knapp'
    | 'feilmeldingFornavn'
    | 'feilmeldingEtternavn'
    | 'feilmeldingTelefonnummer'
    | 'feilmeldingTidsrom'
    | 'feilmeldingInnsending'
    | 'kvitteringTekst'
    | 'varselboksTekst';

export type LocaleModule = Record<LocaleStringId, string>;

export const localeModules: Record<Locale, LocaleModule> = {
    nb: localeModuleNb,
    se: localeModuleSe,
};

export const localeString = (id: LocaleStringId, locale: Locale = defaultLocale): string =>
    localeModules[locale][id] || localeModules[defaultLocale][id] || id;
