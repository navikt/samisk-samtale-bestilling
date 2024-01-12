import { Alert, GuidePanel, Heading } from '@navikt/ds-react';
import { SamiskSamtaleOrderForm } from './SamiskSamtaleOrderForm';
import { LocaleString } from './LocaleString';

import style from './SamiskSamtaleApp.module.css';
import { useEffect } from 'react';
import { initializeFaro } from '@grafana/faro-web-sdk';

export const SamiskSamtaleApp = () => {
    useEffect(() => {
        initializeFaro({
            url: 'https://telemetry.nav.no/collect',
            app: {
                name: 'samisk-samtale-bestilling',
            },
        });
    }, []);

    return (
        <div className={style.appContainer}>
            <Heading size={'xlarge'} className={style.title}>
                <LocaleString id={'varselboksTekst'} />
            </Heading>
            <Alert role="alert" variant="info">
                {'Obs! Denne siden er i beta og kun ment for intern testing.'}
            </Alert>
            <GuidePanel poster={true} className={style.ingressPanel}>
                <LocaleString id={'ingress'} />
            </GuidePanel>
            <SamiskSamtaleOrderForm />
        </div>
    );
};
