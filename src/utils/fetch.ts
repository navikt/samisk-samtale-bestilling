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
    fetch(process.env.API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        credentials: 'include',
    });
