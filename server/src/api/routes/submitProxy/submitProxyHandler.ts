import process from 'process';
import { getAzureadToken } from '../../helpers/auth';
import { Request, Response } from 'express';

export const proxyHandler = async (req: Request, res: Response) => {
    if (req.method !== 'POST') {
        res.status(405).json('Method Not Allowed');
    }

    const accessToken = await getAzureadToken(`api://${process.env.ENV}-gcp.teamserviceklage.tilbakemeldingsmottak-api/.default`);

    if (!accessToken) {
        console.error('Failed to fetch access token');
        res.status(500);
    }

    try {
        const response = await fetch(`${process.env.API_URL}/rest/bestilling-av-samtale`, {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log(`Submitted form with response ${response.status}`);

        res.status(response.status).json(response.body);
    } catch (e) {
        console.error(`Failed to submit form ${e}`);
        res.status(500);
    }
};
