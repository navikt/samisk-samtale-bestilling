import { raw } from 'hono/html';
import { Locale, localeString } from '../localization/localeUtils.js';
import { FieldErrors, FormValues } from '../submit/validate.js';
import { AlertBox, ErrorMessage, TextField } from './aksel.js';
import { checkboxIcon, loaderIcon } from './icons.js';

type CheckboxProps = {
    id: string;
    value: string;
    label: string;
    checked?: boolean;
    showError?: boolean;
};

const Checkbox = ({ id, value, label, checked, showError }: CheckboxProps) => (
    <div class={`aksel-checkbox aksel-checkbox--medium${showError ? ' aksel-checkbox--error' : ''}`}>
        <div data-standalone="false" class="aksel-checkbox__input-wrapper">
            <input
                id={id}
                name="tidsrom"
                value={value}
                type="checkbox"
                checked={checked}
                aria-describedby={showError ? 'tidsrom-error' : undefined}
                class="aksel-checkbox__input"
            />
            {raw(checkboxIcon)}
        </div>
        <label for={id} class="aksel-checkbox__label aksel-body-short aksel-body-short--medium">
            {label}
        </label>
    </div>
);

type OrderFormProps = {
    locale: Locale;
    kontaktinfoUrl: string;
    values?: FormValues;
    errors?: FieldErrors;
    submitError?: boolean;
};

export const OrderForm = ({ locale, kontaktinfoUrl, values, errors = {}, submitError }: OrderFormProps) => {
    const text = (id: Parameters<typeof localeString>[0]) => localeString(id, locale);

    return (
        <>
            <div class="app-panel aksel-box">
                <form method="post" data-enhance="" data-kontaktinfo-url={kontaktinfoUrl}>
                    <div class="app-fields">
                        <TextField
                            id="fornavn"
                            name="fornavn"
                            label={text('fornavn')}
                            autocomplete="given-name"
                            errorMessage={text('feilmeldingFornavn')}
                            value={values?.fornavn}
                            showError={errors.fornavn}
                        />
                        <TextField
                            id="etternavn"
                            name="etternavn"
                            label={text('etternavn')}
                            autocomplete="family-name"
                            errorMessage={text('feilmeldingEtternavn')}
                            value={values?.etternavn}
                            showError={errors.etternavn}
                        />
                        <TextField
                            id="telefonnummer"
                            name="telefonnummer"
                            label={text('telefonnummer')}
                            autocomplete="tel"
                            errorMessage={text('feilmeldingTelefonnummer')}
                            value={values?.telefonnummer}
                            showError={errors.telefonnummer}
                        />
                        <fieldset
                            aria-labelledby="tidsrom-legend"
                            data-field="tidsrom"
                            data-error-message={text('feilmeldingTidsrom')}
                            class={`aksel-checkbox-group aksel-checkbox-group--medium aksel-fieldset aksel-fieldset--medium${
                                errors.tidsrom ? ' aksel-fieldset--error' : ''
                            }`}
                        >
                            <legend id="tidsrom-legend" class="aksel-fieldset__legend aksel-label">
                                {text('tidsrom')}
                            </legend>
                            <div class="aksel-checkboxes">
                                <Checkbox
                                    id="tidsrom-formiddag"
                                    value="FORMIDDAG"
                                    label={text('tidsromFormiddag')}
                                    checked={values?.formiddag}
                                    showError={errors.tidsrom}
                                />
                                <Checkbox
                                    id="tidsrom-ettermiddag"
                                    value="ETTERMIDDAG"
                                    label={text('tidsromEttermiddag')}
                                    checked={values?.ettermiddag}
                                    showError={errors.tidsrom}
                                />
                            </div>
                            <div id="tidsrom-error" aria-relevant="additions removals" aria-live="polite" class="aksel-fieldset__error">
                                {errors.tidsrom && <ErrorMessage>{text('feilmeldingTidsrom')}</ErrorMessage>}
                            </div>
                        </fieldset>
                    </div>
                    <button type="submit" data-variant="primary" class="app-button aksel-button aksel-button--medium">
                        <span class="aksel-label">
                            <span class="app-loader" hidden>
                                {raw(loaderIcon)}
                            </span>
                            {text('knapp')}
                        </span>
                    </button>
                    {submitError && (
                        <AlertBox variant="error" iconId="alert-icon-error" class="app-error">
                            {text('feilmeldingInnsending')}
                        </AlertBox>
                    )}
                    <div id="js-submit-error" tabindex={-1} hidden>
                        <AlertBox variant="error" iconId="alert-icon-error-js" class="app-error">
                            {text('feilmeldingInnsending')}
                        </AlertBox>
                    </div>
                    <template id="error-message-template">
                        <ErrorMessage>{''}</ErrorMessage>
                    </template>
                </form>
            </div>
            <div id="js-success" tabindex={-1} hidden>
                <AlertBox variant="success" iconId="alert-icon-success" class="app-submit-info">
                    {text('kvitteringTekst')}
                </AlertBox>
            </div>
        </>
    );
};
