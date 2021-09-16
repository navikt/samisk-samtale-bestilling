import { NextApiRequest, NextApiResponse } from 'next';
import { InputState } from '../../components/form/samisk-samtale-order-form/SamiskSamtaleOrderForm';

type SubmitData = {
    fornavn: string;
    etternavn: string;
    telefonnummer: string;
    tidsrom: 'FORMIDDAG' | 'ETTERMIDDAG' | 'BEGGE';
};

const inputToSubmitData = ({
    firstName,
    lastName,
    phoneNo,
    morning,
    afternoon,
}: InputState): SubmitData | null => {
    if (!firstName || !lastName || !phoneNo || !(morning || afternoon)) {
        return null;
    }

    const tidsrom =
        morning && afternoon ? 'BEGGE' : morning ? 'FORMIDDAG' : 'ETTERMIDDAG';

    return {
        fornavn: firstName,
        etternavn: lastName,
        telefonnummer: phoneNo,
        tidsrom,
    };
};

const submitHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const submitData = inputToSubmitData(req.query as InputState);

    if (!submitData) {
        return res.status(400).send('Ugyldige input-parametre');
    }

    return res.status(200).send('Ok!');
};

export default submitHandler;
