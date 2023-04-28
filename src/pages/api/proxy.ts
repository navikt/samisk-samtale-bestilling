import { NextApiRequest, NextApiResponse } from 'next';
import process from 'process';
import { getAzureadToken } from '../../auth/azuread';

const proxyHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const accessToken = await getAzureadToken(
            `api://${process.env.ENV}-gcp.teamserviceklage.tilbakemeldingsmottak-api/.default`
        );

        if (!accessToken) {
            return res.status(500).json('Failed to fetch access token');
        }

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
    } else {
        return res.status(405).json('Method Not Allowed');
    }
};

export default proxyHandler;
