import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../global.css';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>{`Bestilling av samtale - nav.no`}</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
};

export default App;
