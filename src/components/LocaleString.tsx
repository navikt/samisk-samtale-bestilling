import { defaultLocale, localeModules } from '../../common/localization/localeUtils';
import { LocaleStringId } from '../../common/localization/localeUtils';

type Props = {
    id: LocaleStringId;
};

export const LocaleString = ({ id }: Props) => {
    // const locale = (router.locale || router.defaultLocale || defaultLocale) as Locale;
    const locale = defaultLocale;

    const value = localeModules[locale][id] || localeModules[defaultLocale][id];
    if (!value) {
        return <>{id}</>;
    }

    return <div dangerouslySetInnerHTML={{ __html: value }} />;
};
