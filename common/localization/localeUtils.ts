import { localeModuleNb } from './nb';
import { localeModuleSe } from './se';

export type Locale = 'se' | 'nb';

export const defaultLocale: Locale = 'se';

export type LocaleModule = typeof localeModuleNb;

export type LocaleStringId =
    | 'tittel'
    | 'fornavn'
    | 'etternavn'
    | 'telefonnummer'
    | 'tidsrom'
    | 'ingress'
    | 'knapp'
    | 'feilmeldingFornavn'
    | 'feilmeldingEtternavn'
    | 'feilmeldingTelefonnummer'
    | 'feilmeldingTidsrom';

export const localeModules: { [key in Locale]: LocaleModule } = {
    nb: localeModuleNb,
    se: localeModuleSe,
};

export const localeString = (id: LocaleStringId, locale: Locale = defaultLocale): string => {
    const value = localeModules[locale][id] || localeModules[defaultLocale][id];
    if (!value) {
        return id;
    }

    return typeof value === 'string' ? value : id;
};
