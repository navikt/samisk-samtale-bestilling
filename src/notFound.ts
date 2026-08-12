const NAVNO_404_URL = 'https://www.nav.no/404';

export type NotFoundPageProvider = () => Promise<string>;

// Fetches and caches nav.no's static 404 page; retries on the next request after failure.
export const createNotFoundPageProvider = (): NotFoundPageProvider => {
    let cached: string | null = null;

    return async () => {
        if (cached) {
            return cached;
        }

        try {
            const res = await fetch(NAVNO_404_URL);
            if (res.status !== 404) {
                throw Error(`${res.status} ${res.statusText}`);
            }
            cached = await res.text();
            return cached;
        } catch (e) {
            console.error(`Failed to fetch 404 html - ${e}`);
            return 'Not found';
        }
    };
};
