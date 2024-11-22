import { useEffect, useState } from 'react';
import style from './SamiskSamtaleOrderForm.module.css';
import { Alert, Box, Button, Checkbox, CheckboxGroup, Loader, TextField } from '@navikt/ds-react';
import { fetchFormSubmit, fetchKontaktInfo, SubmitData } from '../utils/fetch';
import { LocaleString } from './LocaleString';

export type InputState = {
    fornavn?: string;
    etternavn?: string;
    telefonnummer?: string;
    formiddag?: boolean;
    ettermiddag?: boolean;
};

type ErrorState = {
    fornavn?: boolean;
    etternavn?: boolean;
    telefonnummer?: boolean;
    tidsrom?: boolean;
};

const isValidPhoneNumber = (phoneNumber?: string) => !!phoneNumber && /^\+?\d{8,}$/.test(phoneNumber);

const hasErrors = (errorState: ErrorState) => errorState.fornavn || errorState.etternavn || errorState.telefonnummer || errorState.tidsrom;

export const SamiskSamtaleOrderForm = () => {
    const [inputState, setInputState] = useState<InputState>({});
    const [errorState, setErrorState] = useState<ErrorState>({});
    const [isWaiting, setIsWaiting] = useState(false);
    const [submitAcked, setSubmitAcked] = useState(false);
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        fetchKontaktInfo().then((res) => {
            if (!inputState.telefonnummer && res?.mobiltelefonnummer) {
                setInputState({
                    ...inputState,
                    telefonnummer: res.mobiltelefonnummer,
                });
            }
        });
        /* eslint-disable-next-line */
    }, []);

    const submitForm = () => {
        const { formiddag, etternavn, telefonnummer, fornavn, ettermiddag } = inputState;

        const errors: ErrorState = {
            fornavn: !fornavn,
            etternavn: !etternavn,
            telefonnummer: !isValidPhoneNumber(telefonnummer),
            tidsrom: !(formiddag || ettermiddag),
        };

        setErrorState(errors);

        if (hasErrors(errors)) {
            return;
        }

        setIsWaiting(true);

        fetchFormSubmit({
            fornavn,
            etternavn,
            telefonnummer,
            tidsrom: formiddag && ettermiddag ? 'BEGGE' : formiddag ? 'FORMIDDAG' : 'ETTERMIDDAG',
        } as SubmitData)
            .then((res) => {
                if (res.ok) {
                    setInputState({});
                    setSubmitAcked(true);
                } else {
                    throw new Error(res.statusText);
                }
            })
            .catch((e) => {
                setFetchError(e);
            })
            .finally(() => setIsWaiting(false));
    };

    return submitAcked ? (
        <Alert role="status" variant="success" className={style.submitInfo}>
            {'Meldingen din er sendt'}
        </Alert>
    ) : (
        <Box className={style.panel}>
            <div className={style.fields}>
                <TextField
                    label={<LocaleString id={'fornavn'} />}
                    autoComplete="given-name"
                    error={errorState.fornavn && <LocaleString id={'feilmeldingFornavn'} />}
                    value={inputState.fornavn || ''}
                    onChange={(e) => {
                        setErrorState({
                            ...errorState,
                            fornavn: false,
                        });
                        setInputState({
                            ...inputState,
                            fornavn: e.target.value,
                        });
                    }}
                />
                <TextField
                    label={<LocaleString id={'etternavn'} />}
                    autoComplete="family-name"
                    error={errorState.etternavn && <LocaleString id={'feilmeldingEtternavn'} />}
                    value={inputState.etternavn || ''}
                    onChange={(e) => {
                        setErrorState({
                            ...errorState,
                            etternavn: false,
                        });
                        setInputState({
                            ...inputState,
                            etternavn: e.target.value,
                        });
                    }}
                />
                <TextField
                    label={<LocaleString id={'telefonnummer'} />}
                    autoComplete="tel"
                    value={inputState.telefonnummer || ''}
                    error={errorState.telefonnummer && <LocaleString id={'feilmeldingTelefonnummer'} />}
                    onChange={(e) => {
                        setErrorState({
                            ...errorState,
                            telefonnummer: false,
                        });
                        setInputState({
                            ...inputState,
                            telefonnummer: e.target.value,
                        });
                    }}
                />
                <CheckboxGroup
                    legend={<LocaleString id={'tidsrom'} />}
                    error={errorState.tidsrom && <LocaleString id={'feilmeldingTidsrom'} />}
                    onChange={() => {
                        setErrorState({
                            ...errorState,
                            tidsrom: false,
                        });
                    }}
                    className={style.boxgroup}
                >
                    <Checkbox
                        value="morning"
                        onChange={(e) => {
                            setInputState({
                                ...inputState,
                                formiddag: e.target.checked,
                            });
                        }}
                    >
                        {'08.00-10.00'}
                    </Checkbox>
                    <Checkbox
                        value="afternoon"
                        onChange={(e) => {
                            setInputState({
                                ...inputState,
                                ettermiddag: e.target.checked,
                            });
                        }}
                    >
                        {'13.30-15.30'}
                    </Checkbox>
                </CheckboxGroup>
            </div>
            <Button className={style.button} onClick={() => submitForm()} disabled={hasErrors(errorState) || isWaiting}>
                {isWaiting && <Loader />}
                {<LocaleString id={'knapp'} />}
            </Button>
            {fetchError && <Alert role="alert" variant="error" className={style.error}>{`Feil ved innsending: ${fetchError}`}</Alert>}
        </Box>
    );
};
