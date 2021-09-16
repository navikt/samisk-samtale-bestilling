import React from 'react';
import style from './SamiskSamtaleOrderForm.module.css';
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Fieldset,
    Panel,
    TextField,
} from '@navikt/ds-react';

export const SamiskSamtaleOrderForm = () => {
    return (
        <Panel className={style.panel}>
            <Fieldset legend={''}>
                <TextField label="Ovdanamma" />
                <TextField label="Goargu" />
                <TextField label="Telefovdna*" />
            </Fieldset>
            <CheckboxGroup
                legend="Goas heive duinna váldit oktavuođa?"
                className={style.boxgroup}
            >
                <Checkbox value="morning">{'08.00-10.00'}</Checkbox>
                <Checkbox value="afternoon">{'13.30-15.30'}</Checkbox>
            </CheckboxGroup>
            <Button className={style.button}>{'Sádde jearaldaga'}</Button>
        </Panel>
    );
};
