import { RequestHandler } from 'express';

export const isAliveHandler: RequestHandler = (req, res) => {
    res.status(200).send('I am alive!');
};
