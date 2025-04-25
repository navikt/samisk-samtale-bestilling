import { renderToString } from 'preact-render-to-string';
import { SamiskSamtaleApp } from './components/SamiskSamtaleApp';
import { LocaleProvider } from './utils/useLocale';
import { Locale } from '../common/localization/localeUtils';

const { BASE_URL } = import.meta.env;

export function render(url: string, locale: Locale) {
    console.log('main-server: Rendering for URL:', url, 'with locale:', locale);

    const html = renderToString(
        <LocaleProvider value={locale}>
            <SamiskSamtaleApp />
        </LocaleProvider>
    );
    return { html };
}
