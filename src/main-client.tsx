// Import global style early to ensure the later component-level imports
// gets higher specificity
import './global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';

const parseAppContext = () => {
    try {
        const contextElement = document.getElementById('app-context');
        return contextElement ? JSON.parse(contextElement.innerText) : {};
    } catch (e) {
        console.error(`Failed to parse app context - ${e}`);
        return {};
    }
};

const AppWithContext = () => {
    return (
        <React.StrictMode>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <App appContext={parseAppContext()} />
            </BrowserRouter>
        </React.StrictMode>
    );
};

const renderOrHydrate = () => {
    const rootElement = document.getElementById('app') as HTMLElement;

    // We should only attempt to hydrate if the root element has child elements
    // to hydrate. Also, hydration causes glitches with our HMR workaround
    // below, used in dev mode.
    if (rootElement.hasChildNodes() && import.meta.env.PROD) {
        console.log('Hydrating!');
        ReactDOM.hydrateRoot(rootElement, <AppWithContext />);
    } else {
        console.log('Rendering!');
        const root = ReactDOM.createRoot(rootElement);
        root.render(<AppWithContext />);
    }
};

renderOrHydrate();

if (import.meta.hot) {
    /*
     * Workaround for HMR not triggering module updates for some reason!
     * We do a full re-render of the component tree, which is at least better
     * than doing a full page reload. This will be tree-shaken away in
     * production mode (see Vite docs)
     * */

    const { pathname } = new URL(import.meta.url);

    import.meta.hot.on('vite:beforeUpdate', (payload) => {
        if (!payload) {
            console.log('"payload" was not defined');
            return;
        }

        console.log('Update payload: ', payload);

        const { type, updates } = payload;
        if (type !== 'update') {
            console.log(`"type" was not "update" ("${type}")`);
            return;
        }
        if (!updates) {
            console.log('"updates" was not defined');
            return;
        }

        const hasJsUpdate = updates.some((update) => {
            const { type, path } = update;
            if (type !== 'js-update') {
                console.log(`"type" was not "js-update" ("${type}")`);
                return false;
            }
            console.log(`Updating for "${path}"!`);
            return true;
        });

        if (hasJsUpdate) {
            import(/* @vite-ignore */ `${pathname}?t=${Date.now()}`);
        }
    });
}
