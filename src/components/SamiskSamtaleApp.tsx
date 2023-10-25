import { BodyLong, GuidePanel, Heading } from '@navikt/ds-react';
import { SamiskSamtaleOrderForm } from './SamiskSamtaleOrderForm';
import style from './SamiskSamtaleApp.module.css';
import { LocaleString } from './LocaleString';

export const SamiskSamtaleApp = () => {
    return (
        <main id="maincontent" className={style.appContainer}>
            <Heading size={'xlarge'} className={style.title}>
                <LocaleString id={'tittel'} />
            </Heading>
            <GuidePanel poster={true} className={style.ingressPanel}>
                <BodyLong className={style.ingress}>
                    <LocaleString id={'ingress'} />
                </BodyLong>
            </GuidePanel>
            <SamiskSamtaleOrderForm />
        </main>
    );
};
