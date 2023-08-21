import process from 'process';
import { getAzureadToken } from '../../helpers/auth';
import { Request, Response } from 'express';

export const proxyHandler = async (req: Request, res: Response) => {
    if (req.method === 'POST') {
        const accessToken = await getAzureadToken(
            `api://${process.env.ENV}-gcp.teamserviceklage.tilbakemeldingsmottak-api/.default`
        );

        if (!accessToken) {
            console.log('Failed to fetch access token');
            throw new Error('Failed to fetch access token');
        }

        console.log('Requesting with req.body');
        console.log(req.body);

        try {
            const response = await fetch(
                `${process.env.API_URL}/rest/bestilling-av-samtale`,
                {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return res.status(response.status).json(response.body);
        } catch(e) {
            console.log(`Failed to submit form ${e}`);
            return res.status(500).json(e);
        }
    } else {
        return res.status(405).json('Method Not Allowed');
    }
};
