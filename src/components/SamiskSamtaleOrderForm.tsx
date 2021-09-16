import React, { useState } from 'react';
import style from './SamiskSamtaleOrderForm.module.css';
import {
    Alert,
    Button,
    Checkbox,
    CheckboxGroup,
    Fieldset,
    Panel,
    TextField,
} from '@navikt/ds-react';
import { fetchFormSubmit, SubmitData } from '../utils/fetch';

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

const isValidPhoneNumber = (phoneNumber?: string) =>
    !!phoneNumber && /^\+?[0-9 ]+$/.test(phoneNumber);

const hasErrors = (errorState: ErrorState) =>
    errorState.fornavn ||
    errorState.etternavn ||
    errorState.telefonnummer ||
    errorState.tidsrom;

export const SamiskSamtaleOrderForm = () => {
    const [inputState, setInputState] = useState<InputState>({});
    const [errorState, setErrorState] = useState<ErrorState>({});
    const [submitted, setSubmitted] = useState(false);
    const [fetchError, setFetchError] = useState('');

    const submitForm = () => {
        const { formiddag, etternavn, telefonnummer, fornavn, ettermiddag } =
            inputState;

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

        fetchFormSubmit({
            fornavn,
            etternavn,
            telefonnummer,
            tidsrom:
                formiddag && ettermiddag
                    ? 'BEGGE'
                    : formiddag
                    ? 'FORMIDDAG'
                    : 'ETTERMIDDAG',
        } as SubmitData)
            .then((res) => {
                if (res.ok) {
                    setInputState({});
                    setSubmitted(true);
                } else {
                    throw new Error(res.statusText);
                }
            })
            .catch((e) => {
                setFetchError(e);
            });
    };

    return submitted ? (
        <Alert variant={'success'} className={style.submitInfo}>
            {'Meldingen din er sendt'}
        </Alert>
    ) : (
        <Panel className={style.panel}>
            <Fieldset legend={''}>
                <TextField
                    label={'Ovdanamma'}
                    error={errorState.fornavn && 'Čále ovdanama'}
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
                    label={'Goargu'}
                    error={errorState.etternavn && 'Čále goarggu'}
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
                    label={'Telefovdna'}
                    error={errorState.telefonnummer && 'Čále telefon-nummara'}
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
            </Fieldset>
            <CheckboxGroup
                legend={'Goas heive duinna váldit oktavuođa?'}
                error={errorState.tidsrom && 'Vállje áiggi goas heive'}
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
            <Button
                className={style.button}
                onClick={() => submitForm()}
                disabled={hasErrors(errorState)}
            >
                {'Sádde jearaldaga'}
            </Button>
            {fetchError && (
                <Alert
                    variant={'error'}
                    className={style.error}
                >{`Feil ved innsending: ${fetchError}`}</Alert>
            )}
        </Panel>
    );
};
