import { raw } from 'hono/html';
import { Locale, localeString } from '../localization/localeUtils.js';
import { FieldErrors, FormValues } from '../submit/validate.js';
import { AlertBox } from './aksel.js';
import { Confirmation } from './Confirmation.js';
import { guideIllustration, guideTail } from './icons.js';
import { OrderForm } from './OrderForm.js';

export type OrderPageState = {
    confirmation?: boolean;
    values?: FormValues;
    errors?: FieldErrors;
    submitError?: boolean;
};

type OrderPageProps = {
    locale: Locale;
    kontaktinfoUrl: string;
    state: OrderPageState;
};

export const OrderPage = ({ locale, kontaktinfoUrl, state }: OrderPageProps) => (
    <div class="app-container">
        <h1 class="app-title aksel-heading aksel-heading--xlarge">{localeString('tittel', locale)}</h1>
        <AlertBox variant="info" iconId="alert-icon-info" class="app-alert">
            <div>{raw(localeString('varselboksTekst', locale))}</div>
        </AlertBox>
        <div data-color="info" data-responsive="false" data-poster="true" class="aksel-guide-panel app-ingress-panel">
            <div class="aksel-guide">{raw(guideIllustration)}</div>
            <div class="aksel-guide-panel__content">
                {raw(guideTail)}
                <div data-color="accent" class="aksel-guide-panel__content-inner">
                    <div>{raw(localeString('ingress', locale))}</div>
                </div>
            </div>
        </div>
        {state.confirmation ? (
            <Confirmation locale={locale} />
        ) : (
            <OrderForm locale={locale} kontaktinfoUrl={kontaktinfoUrl} values={state.values} errors={state.errors} submitError={state.submitError} />
        )}
    </div>
);
