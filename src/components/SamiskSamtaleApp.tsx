import { BodyLong, GuidePanel, Heading, Link } from '@navikt/ds-react';
import { SamiskSamtaleOrderForm } from './SamiskSamtaleOrderForm';
import style from './SamiskSamtaleApp.module.css';
import { onLanguageSelect, setParams } from '@navikt/nav-dekoratoren-moduler';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getDecoratorParams } from '../utils/decorator';
import { Locale, LocaleString } from '../localization/LocaleString';

export const SamiskSamtaleApp = () => {
    const router = useRouter();
    const locale = router.locale as unknown as Locale;

    return (
        <div role={'main'} className={style.appContainer}>
            <Heading size={'xlarge'} className={style.title}>
                <LocaleString id={'tittel'} />
            </Heading>
            <GuidePanel poster={true} className={style.ingressPanel}>
                <BodyLong className={style.ingress}>
                    <LocaleString id={'ingress'} />
                </BodyLong>
            </GuidePanel>
            <SamiskSamtaleOrderForm />
        </div>
    );
};
