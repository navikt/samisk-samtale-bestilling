// Replicates @navikt/ds-react@8.16.1 markup, verified against production SSR.
// Classes belong to ds-css (CDN URL pinned in Layout.tsx) - re-verify visually on upgrade.
import { raw } from 'hono/html';
import { PropsWithChildren } from 'hono/jsx';
import { alertIcon, errorMessageIcon } from './icons.js';

type AlertVariant = 'info' | 'success' | 'error';

const alertDataColor: Record<AlertVariant, string> = {
    info: 'info',
    success: 'success',
    error: 'danger',
};

type AlertBoxProps = PropsWithChildren<{
    variant: AlertVariant;
    /** Must be unique per document */
    iconId: string;
    class?: string;
}>;

export const AlertBox = ({ variant, iconId, class: className, children }: AlertBoxProps) => (
    <div
        role="alert"
        data-color={alertDataColor[variant]}
        data-variant={variant}
        class={`${className ? `${className} ` : ''}aksel-alert aksel-alert--${variant} aksel-alert--medium`}
    >
        {raw(alertIcon(variant, iconId))}
        <div class="aksel-alert__wrapper aksel-alert__wrapper--maxwidth aksel-body-long aksel-body-long--medium">{children}</div>
    </div>
);

export const ErrorMessage = ({ children }: PropsWithChildren) => (
    <p class="aksel-error-message aksel-label aksel-error-message--show-icon">
        {raw(errorMessageIcon)}
        {children}
    </p>
);

type TextFieldProps = {
    id: string;
    name: string;
    label: string;
    autocomplete: string;
    /** Always rendered as a data attribute for enhance.js */
    errorMessage: string;
    value?: string;
    /** Server-side error render state */
    showError?: boolean;
};

export const TextField = ({ id, name, label, autocomplete, errorMessage, value, showError }: TextFieldProps) => (
    <div
        class={`aksel-form-field aksel-form-field--medium${showError ? ' aksel-text-field--error' : ''}`}
        data-field={name}
        data-error-message={errorMessage}
    >
        <label for={id} class="aksel-form-field__label aksel-label">
            {label}
        </label>
        <input
            id={id}
            name={name}
            type="text"
            autocomplete={autocomplete}
            value={value || undefined}
            aria-invalid={showError ? 'true' : undefined}
            aria-describedby={showError ? `${id}-error` : undefined}
            class="aksel-text-field__input aksel-body-short aksel-body-short--medium"
        />
        <div id={`${id}-error`} aria-relevant="additions removals" aria-live="polite" class="aksel-form-field__error">
            {showError && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </div>
    </div>
);
