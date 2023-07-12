import { BodyLong, GuidePanel, Heading } from '@navikt/ds-react';
import { SamiskSamtaleOrderForm } from './SamiskSamtaleOrderForm';
import style from './SamiskSamtaleApp.module.css';
import { LocaleString } from '../localization/LocaleString';

type Props = {
    appContext: unknown;
};

export const SamiskSamtaleApp = ({ appContext }: Props) => {
    console.log(`App context: ${JSON.stringify(appContext)}`);

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
