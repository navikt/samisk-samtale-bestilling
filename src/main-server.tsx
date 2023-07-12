import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { SamiskSamtaleApp } from './components/SamiskSamtaleApp';

const { BASE_URL } = import.meta.env;

export const render = (url: string, appContext: unknown) => {
    console.log(url, BASE_URL);

    return renderToString(
        <StaticRouter basename={BASE_URL} location={url}>
            <SamiskSamtaleApp appContext={appContext} />
        </StaticRouter>
    );
};
