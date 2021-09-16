import React, { useState } from 'react';
import style from './SamiskSamtaleOrderForm.module.css';
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Fieldset,
    Panel,
    TextField,
} from '@navikt/ds-react';

type InputState = {
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

    const validateInput = () => {
        setErrorState({
            firstName: !inputState.firstName,
            lastName: !inputState.lastName,
            phoneNo: !isValidPhone(inputState.phoneNo),
            timeSelection: !(inputState.morning || inputState.afternoon),
        });
    };

    return (
        <Panel className={style.panel}>
            <Fieldset legend={''}>
                <TextField
                    label={'Ovdanamma'}
                    error={errorState.firstName && 'Čále ovdanama'}
                    onChange={(e) => {
                        setErrorState({ ...errorState, firstName: false });
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
                        setErrorState({ ...errorState, lastName: false });
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
                        setErrorState({ ...errorState, phoneNo: false });
                        setInputState({
                            ...inputState,
                            phoneNo: e.target.value,
                        });
                    }}
                />
            </Fieldset>
            <CheckboxGroup
                legend={'Goas heive duinna váldit oktavuođa?'}
                className={style.boxgroup}
                error={errorState.timeSelection && 'Vállje áiggi goas heive'}
                onChange={() => {
                    setErrorState({ ...errorState, timeSelection: false });
                }}
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
            <Button className={style.button} onClick={() => validateInput()}>
                {'Sádde jearaldaga'}
            </Button>
        </Panel>
    );
};
