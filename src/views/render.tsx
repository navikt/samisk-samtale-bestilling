import { DecoratorElements } from '@navikt/nav-dekoratoren-moduler/ssr/index.js';
import { config } from '../config.js';
import { Locale, localeString } from '../localization/localeUtils.js';
import { Layout } from './Layout.js';
import { OrderPage, OrderPageState } from './OrderPage.js';

export const renderOrderPage = (locale: Locale, decorator: DecoratorElements, state: OrderPageState = {}): string =>
    '<!DOCTYPE html>' +
    (
        <Layout locale={locale} title={localeString('tittel', locale)} basePath={config.appBasePath} decorator={decorator}>
            <OrderPage locale={locale} kontaktinfoUrl={config.kontaktinfoApiUrl} state={state} />
        </Layout>
    ).toString();
