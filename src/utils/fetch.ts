import * as process from 'process';

export const objectToQueryString = (params?: object, firstChar = '?') =>
    params
        ? Object.entries(params).reduce(
              (acc, [k, v], i) =>
                  v !== undefined
                      ? `${acc}${i ? '&' : firstChar}${k}=${encodeURIComponent(
                            typeof v === 'object' ? JSON.stringify(v) : v
                        )}`
                      : acc,
              ''
          )
        : '';

export type SubmitData = {
    fornavn: string;
    etternavn: string;
    telefonnummer: string;
    tidsrom: 'FORMIDDAG' | 'ETTERMIDDAG' | 'BEGGE';
};

export const fetchFormSubmit = async (data: SubmitData) =>
    fetch(`${process.env.APP_ORIGIN}${process.env.APP_BASEPATH}/api/proxy`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        credentials: 'include',
    });

export type KontaktInfoResponse = {
    epostadresse: string;
    kanVarsles: boolean;
    mobiltelefonnummer: string;
    reservert: boolean;
};

export const fetchKontaktInfo = async (): Promise<KontaktInfoResponse | null> =>
    fetch(process.env.KONTAKTINFO_API_URL)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }

            if (res.status === 401) {
                return null;
            }

            throw new Error(
                `Error fetching kontaktinfo: ${res.status} ${res.statusText}`
            );
        })
        .catch((e) => {
            console.error(e);
            return null;
        });
