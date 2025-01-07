import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { SamiskSamtaleApp } from './components/SamiskSamtaleApp';
import { LocaleProvider } from './utils/useLocale';
import { Locale } from '../common/localization/localeUtils';

const { BASE_URL } = import.meta.env;

export const render = (url: string, locale: Locale) => {
    return renderToString(
        <LocaleProvider value={locale}>
            <StaticRouter basename={BASE_URL} location={url}>
                <SamiskSamtaleApp />
            </StaticRouter>
        </LocaleProvider>
    );
};
