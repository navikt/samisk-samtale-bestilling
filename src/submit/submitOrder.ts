import { getAzureadToken } from '../auth/azureToken.js';
import { config } from '../config.js';
import { SubmitData } from './validate.js';

export type SubmitResult = {
    ok: boolean;
    status: number;
};

export type SubmitOrder = (data: SubmitData) => Promise<SubmitResult>;

export const submitOrder: SubmitOrder = async (data) => {
    const scope = `api://${config.env}-gcp.teamserviceklage.tilbakemeldingsmottak-api/.default`;
    const accessToken = await getAzureadToken(scope);

    if (!accessToken) {
        console.error('Failed to fetch access token');
        return { ok: false, status: 500 };
    }

    try {
        const response = await fetch(`${config.apiUrl}/rest/bestilling-av-samtale`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log(`Submitted form with response ${response.status}`);

        return { ok: response.ok, status: response.status };
    } catch (e) {
        console.error(`Failed to submit form ${e}`);
        return { ok: false, status: 500 };
    }
};
