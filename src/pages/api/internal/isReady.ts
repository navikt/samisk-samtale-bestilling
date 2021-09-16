import { NextApiRequest, NextApiResponse } from 'next';

const isReadyHandler = (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).json({ message: 'Ok!' });
};

export default isReadyHandler;
