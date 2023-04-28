import { NextApiRequest, NextApiResponse } from 'next';
import process from 'process';
import { getAzureadToken } from '../../auth/azuread';

const proxyHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        console.log("Henter token")
        const accessToken = await getAzureadToken(
            `api://${process.env.ENV}-gcp.teamserviceklage.tilbakemeldingsmottak-api/.default`
        );
        console.log("Token hentet")
        console.log(`Sender request til ${process.env.API_URL}/rest/mottak/bestilling-av-samtale`)
        const response = await fetch(
            `${process.env.API_URL}/rest/mottak/bestilling-av-samtale`,
            {
                method: 'POST',
                body: JSON.stringify(req.body),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        console.log(`Mottatt respons med status ${response.status}`)
        return res.status(response.status).json(response.body);
    } else {
        return res.status(405).json('Method Not Allowed');
    }
};

export default proxyHandler;
