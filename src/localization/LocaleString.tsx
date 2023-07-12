import { LocaleModule, localeModuleNb, LocaleStringId } from './nb';
import { localeModuleSe } from './se';

export type Locale = 'se' | 'nb';

const defaultLocale: Locale = 'se';

const localeModules: { [key in Locale]: LocaleModule } = {
    nb: localeModuleNb,
    se: localeModuleSe,
};

type Props = {
    id: LocaleStringId;
    args?: string[];
};

export const localeString = (id: Props['id'], locale: Locale = defaultLocale, args: Props['args'] = []): string => {
    const value = localeModules[locale][id] || localeModules[defaultLocale][id];
    if (!value) {
        return id;
    }

    const finalValue = typeof value === 'function' ? value(...args) : value;

    return typeof finalValue === 'string' ? finalValue : id;
};

export const LocaleString = ({ id, args = [] }: Props) => {
    // const locale = (router.locale || router.defaultLocale || defaultLocale) as Locale;
    const locale = defaultLocale;

    const value = localeModules[locale][id] || localeModules[defaultLocale][id];
    if (!value) {
        return <>{id}</>;
    }

    const finalValue = typeof value === 'function' ? value(...args) : value;

    return <>{finalValue}</>;
};
