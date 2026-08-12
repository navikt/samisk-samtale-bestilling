// Types here are checked against the server via `pnpm typecheck` (tsconfig.client.json).

/** @import { FieldErrors } from '../src/submit/validate.js' */

/** @typedef {{ mobiltelefonnummer?: string }} KontaktInfo */

// A broken markup contract should fail loudly here, not as a null deref deep in a handler.

/**
 * @template {Element} T
 * @param {ParentNode} root
 * @param {string} selector
 * @returns {T}
 */
const el = (root, selector) => {
    const found = /** @type {T | null} */ (root.querySelector(selector));
    if (!found) {
        throw new Error(`missing element: ${selector}`);
    }
    return found;
};

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
const byId = (id) => {
    const found = document.getElementById(id);
    if (!found) {
        throw new Error(`missing element: #${id}`);
    }
    return found;
};

// Keyed off the server's FieldErrors: renaming a field there breaks the typecheck here.
/** @type {Record<Exclude<keyof FieldErrors, 'tidsrom'>, (value: string) => boolean>} */
const RULES = {
    fornavn: (value) => {
        const v = value.trim();
        return v.length > 0 && v.length <= 1000;
    },
    etternavn: (value) => {
        const v = value.trim();
        return v.length > 0 && v.length <= 1000;
    },
    telefonnummer: (value) => {
        const v = value.trim();
        return v.length <= 100 && /^\+?\d{8,}$/.test(v);
    },
};

const RULE_NAMES = /** @type {(keyof typeof RULES)[]} */ (Object.keys(RULES));

/** @param {HTMLFormElement} form */
const enhance = (form) => {
    const submitButton = /** @type {HTMLButtonElement} */ (el(form, 'button[type="submit"]'));
    const loader = /** @type {HTMLElement} */ (el(form, '.app-loader'));
    const panel = /** @type {HTMLElement} */ (form.closest('.app-panel'));
    const errorMessageTemplate = /** @type {HTMLTemplateElement} */ (el(form, '#error-message-template'));
    const fieldset = /** @type {HTMLElement} */ (el(form, 'fieldset[data-field="tidsrom"]'));
    const checkboxes = [...form.querySelectorAll('input[name="tidsrom"]')].map((node) => /** @type {HTMLInputElement} */ (node));
    const successBox = byId('js-success');
    const errorBox = byId('js-submit-error');

    /** @param {string} name */
    const textInput = (name) => /** @type {HTMLInputElement} */ (el(form, `input[name="${name}"]`));

    // --- field errors (same markup the server renders) ---

    /** @param {string} text */
    const buildErrorMessage = (text) => {
        const fragment = /** @type {DocumentFragment} */ (errorMessageTemplate.content.cloneNode(true));
        el(fragment, 'p').append(text);
        return fragment;
    };

    /** @param {HTMLInputElement} input */
    const showFieldError = (input) => {
        const wrapper = /** @type {HTMLElement} */ (input.closest('[data-field]'));
        const container = byId(`${input.id}-error`);
        wrapper.classList.add('aksel-text-field--error');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `${input.id}-error`);
        if (!container.firstChild) {
            container.append(buildErrorMessage(wrapper.dataset.errorMessage ?? ''));
        }
    };

    /** @param {HTMLInputElement} input */
    const clearFieldError = (input) => {
        const wrapper = /** @type {HTMLElement} */ (input.closest('[data-field]'));
        const container = byId(`${input.id}-error`);
        wrapper.classList.remove('aksel-text-field--error');
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        container.textContent = '';
    };

    const showTidsromError = () => {
        const container = byId('tidsrom-error');
        fieldset.classList.add('aksel-fieldset--error');
        for (const checkbox of checkboxes) {
            checkbox.closest('.aksel-checkbox')?.classList.add('aksel-checkbox--error');
            checkbox.setAttribute('aria-describedby', 'tidsrom-error');
        }
        if (!container.firstChild) {
            container.append(buildErrorMessage(fieldset.dataset.errorMessage ?? ''));
        }
    };

    const clearTidsromError = () => {
        const container = byId('tidsrom-error');
        fieldset.classList.remove('aksel-fieldset--error');
        for (const checkbox of checkboxes) {
            checkbox.closest('.aksel-checkbox')?.classList.remove('aksel-checkbox--error');
            checkbox.removeAttribute('aria-describedby');
        }
        container.textContent = '';
    };

    // --- validation ---

    // returns the first invalid input
    const validateAll = () => {
        /** @type {HTMLInputElement | null} */
        let firstInvalid = null;
        for (const name of RULE_NAMES) {
            const input = textInput(name);
            if (RULES[name](input.value)) {
                clearFieldError(input);
            } else {
                showFieldError(input);
                firstInvalid ??= input;
            }
        }
        if (checkboxes.some((checkbox) => checkbox.checked)) {
            clearTidsromError();
        } else {
            showTidsromError();
            firstInvalid ??= checkboxes[0];
        }
        return firstInvalid;
    };

    // field errors from the server's 400 response
    /** @param {FieldErrors} errors */
    const showServerFieldErrors = (errors) => {
        /** @type {HTMLInputElement | null} */
        let firstInvalid = null;
        for (const name of RULE_NAMES) {
            if (errors[name]) {
                const input = textInput(name);
                showFieldError(input);
                firstInvalid ??= input;
            }
        }
        if (errors.tidsrom) {
            showTidsromError();
            firstInvalid ??= checkboxes[0];
        }
        firstInvalid?.focus();
    };

    // --- submit ---

    /** @param {boolean} waiting */
    const setWaiting = (waiting) => {
        submitButton.disabled = waiting;
        loader.hidden = !waiting;
    };

    // also removes a server-rendered error alert from a previous no-JS submit
    const hideSubmitErrors = () => {
        errorBox.hidden = true;
        for (const alert of form.querySelectorAll('.app-error')) {
            if (!errorBox.contains(alert)) {
                alert.remove();
            }
        }
    };

    const showConfirmation = () => {
        panel.hidden = true;
        successBox.hidden = false;
        successBox.focus();
        // refresh after success shows the receipt, not an empty form
        history.replaceState(null, '', `${location.pathname}?sendt=1`);
    };

    /** @param {SubmitEvent} event */
    const onSubmit = async (event) => {
        event.preventDefault();
        hideSubmitErrors();

        const firstInvalid = validateAll();
        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        setWaiting(true);
        try {
            const fields = [...new FormData(form)].map(([key, value]) => [key, String(value)]);
            const res = await fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new URLSearchParams(fields),
                credentials: 'same-origin',
            });

            if (res.status === 400) {
                const body = /** @type {{ errors?: FieldErrors }} */ (await res.json());
                showServerFieldErrors(body?.errors ?? {});
                return;
            }
            const body = /** @type {{ ok?: boolean }} */ (res.ok ? await res.json() : {});
            if (!body.ok) {
                throw new Error(`submit failed (${res.status})`);
            }

            showConfirmation();
        } catch {
            errorBox.hidden = false;
            errorBox.focus();
        } finally {
            setWaiting(false);
        }
    };

    // --- phone prefill (401 = not logged in) ---

    const prefillPhone = async () => {
        const url = form.dataset.kontaktinfoUrl;
        if (!url) {
            return;
        }
        try {
            const res = await fetch(url);
            if (!res.ok) {
                return;
            }
            const { mobiltelefonnummer } = /** @type {KontaktInfo} */ (await res.json());
            const input = textInput('telefonnummer');
            if (mobiltelefonnummer && !input.value) {
                input.value = mobiltelefonnummer;
                clearFieldError(input);
            }
        } catch {
            // not logged in / network error - leave empty
        }
    };

    // --- wiring ---

    // field error clears on first keystroke
    for (const name of RULE_NAMES) {
        const input = textInput(name);
        input.addEventListener('input', () => clearFieldError(input));
    }
    for (const checkbox of checkboxes) {
        checkbox.addEventListener('change', clearTidsromError);
    }

    // bfcache restore may otherwise leave the button disabled
    window.addEventListener('pageshow', () => setWaiting(false));

    form.addEventListener('submit', onSubmit);

    prefillPhone();
};

const form = /** @type {HTMLFormElement | null} */ (document.querySelector('form[data-enhance]'));
if (form) {
    enhance(form);
}
