import React from 'react';
import { BodyLong, GuidePanel, Heading } from '@navikt/ds-react';
import { SamiskSamtaleOrderForm } from './form/samisk-samtale-order-form/SamiskSamtaleOrderForm';
import style from './SamiskSamtaleApp.module.css';

export const SamiskSamtaleApp = () => {
    return (
        <div className={style.appContainer}>
            <Heading size={'2xlarge'} className={style.title}>
                {'Jearaldat bagadallama oažžut sámegillii telefovnnas'}
            </Heading>
            <GuidePanel poster={true} className={style.ingressPanel}>
                <BodyLong className={style.ingress}>
                    {
                        'Diŋgo dás davvisámegilli bálvalusa mas vástiduvvo dutnje sámegillii buot NAV – bálvalusain ja oajuin. Mii veahkehit gávdnat mo du áššiin manná, ja veahkehit du dovdat rivttiid ja geatnegasvuođaid mat leat álbmotoadjolága njuolggadusain. Don gávnnat dieđuid iežat áššis neahttabálvalusas nav.no Ditt NAV. Don sáhtát iskat mii dutnje lea máksojuvvon dás:'
                    }
                    <br />
                    <br />
                    {
                        'Don sáhtat ain riŋget NAV-bálvalussii 55 55 33 33 ja dáhtot ahte davvisámegielat bagadalli riŋge dutnje. Muite addit riegadan- ja persunnummara ja maid telefunnummara masa davvisámegielat galga riŋget.'
                    }
                </BodyLong>
            </GuidePanel>
            <SamiskSamtaleOrderForm />
        </div>
    );
};
