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
import { fetchFormSubmit } from '../../../utils/fetch';

export type InputState = {
    firstName?: string;
    lastName?: string;
    phoneNo?: string;
    morning?: boolean;
    afternoon?: boolean;
};

type ErrorState = {
    firstName?: boolean;
    lastName?: boolean;
    phoneNo?: boolean;
    timeSelection?: boolean;
};

const isValidPhone = (phoneNo?: string) =>
    !!phoneNo && /^\+?[0-9 ]+$/.test(phoneNo);

export const SamiskSamtaleOrderForm = () => {
    const [inputState, setInputState] = useState<InputState>({});
    const [errorState, setErrorState] = useState<ErrorState>({});
    const [submitted, setSubmitted] = useState(false);
    const [fetchError, setFetchError] = useState('');

    const submitForm = () => {
        const errors = {
            firstName: !inputState.firstName,
            lastName: !inputState.lastName,
            phoneNo: !isValidPhone(inputState.phoneNo),
            timeSelection: !(inputState.morning || inputState.afternoon),
        };

        setErrorState(errors);

        if (
            errors.firstName ||
            errors.lastName ||
            errors.phoneNo ||
            errors.timeSelection
        ) {
            return;
        }

        fetchFormSubmit(inputState)
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
                    error={errorState.firstName && 'Čále ovdanama'}
                    onChange={(e) => {
                        setErrorState({
                            ...errorState,
                            firstName: false,
                        });
                        setInputState({
                            ...inputState,
                            firstName: e.target.value,
                        });
                    }}
                />
                <TextField
                    label={'Goargu'}
                    error={errorState.lastName && 'Čále goarggu'}
                    onChange={(e) => {
                        setErrorState({
                            ...errorState,
                            lastName: false,
                        });
                        setInputState({
                            ...inputState,
                            lastName: e.target.value,
                        });
                    }}
                />
                <TextField
                    label={'Telefovdna'}
                    error={errorState.phoneNo && 'Čále telefon-nummara'}
                    onChange={(e) => {
                        setErrorState({
                            ...errorState,
                            phoneNo: false,
                        });
                        setInputState({
                            ...inputState,
                            phoneNo: e.target.value,
                        });
                    }}
                />
            </Fieldset>
            <CheckboxGroup
                legend={'Goas heive duinna váldit oktavuođa?'}
                error={errorState.timeSelection && 'Vállje áiggi goas heive'}
                onChange={() => {
                    setErrorState({
                        ...errorState,
                        timeSelection: false,
                    });
                }}
                className={style.boxgroup}
            >
                <Checkbox
                    value="morning"
                    onChange={(e) => {
                        setInputState({
                            ...inputState,
                            morning: e.target.checked,
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
                            afternoon: e.target.checked,
                        });
                    }}
                >
                    {'13.30-15.30'}
                </Checkbox>
            </CheckboxGroup>
            <Button className={style.button} onClick={() => submitForm()}>
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
