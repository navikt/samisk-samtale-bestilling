import { NextApiRequest, NextApiResponse } from 'next';
import process from 'process';

const proxyHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        console.log(req.body)
        const response = await fetch(`${process.env.API_URL}`, {
            method: 'POST',
            body: req.body,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });
        return res.status(response.status).json(response.body);
    } else {
        return res.status(405).json("Method Not Allowed")
    }
};

export default proxyHandler;
