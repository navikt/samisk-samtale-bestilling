export type FetchErrorResponse = {
    error: true;
    statusCode: number;
    message: string;
};

export const fetchErrorResponse = (
    code: number,
    message: string
): FetchErrorResponse => ({
    error: true,
    statusCode: code,
    message: `Error code ${code} - ${message}`,
});

export const fetchJson = async <T = any>(
    url: string,
    options?: Record<string, any>
): Promise<T | FetchErrorResponse> => {
    const urlWithQuery = url;

    try {
        const res = await fetch(urlWithQuery, {
            ...options,
            headers: {
                accept: 'application/json',
                ...(options?.headers && { ...options.headers }),
            },
        });

        const isJson = res.headers
            ?.get('content-type')
            ?.includes?.('application/json');

        if (res.ok && isJson) {
            return (await res.json()) as T;
        }

        if (res.ok) {
            return fetchErrorResponse(
                500,
                `Did not receive a JSON-response from ${urlWithQuery}`
            );
        }

        const errorJson = await res.json();

        console.error('Error fetching json:', errorJson);

        const errorMsg =
            errorJson.message || errorJson.error_description || res.statusText;

        return fetchErrorResponse(res.status, errorMsg);
    } catch (e: any) {
        return fetchErrorResponse(500, e?.toString());
    }
};
