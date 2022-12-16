import React from 'react';
import { BodyLong, GuidePanel, Heading, Link } from '@navikt/ds-react';
import { SamiskSamtaleOrderForm } from './SamiskSamtaleOrderForm';
import style from './SamiskSamtaleApp.module.css';

export const SamiskSamtaleApp = () => {
    return (
        <div role={'main'} className={style.appContainer}>
            <Heading size={'xlarge'} className={style.title}>
                {'Jearaldat bagadallama oažžut sámegillii telefovnnas'}
            </Heading>
            <GuidePanel poster={true} className={style.ingressPanel}>
                <BodyLong className={style.ingress}>
                    {
                        'Diŋgo dás davvisámegilli bálvalusa mas vástiduvvo dutnje sámegillii buot NAV – bálvalusain ja oajuin. Mii veahkehit gávdnat mo du áššiin manná, ja veahkehit du dovdat rivttiid ja geatnegasvuođaid mat leat álbmotoadjolága njuolggadusain. Don gávnnat dieđuid iežat áššis neahttabálvalusas '
                    }
                    <Link href={'https://www.nav.no/minside/'}>
                        {'Min side'}
                    </Link>
                    {'. Don sáhtát iskat mii dutnje lea máksojuvvon dás:'}
                </BodyLong>
                <BodyLong className={style.ingress}>
                    {'Don sáhtat ain riŋget NAV-bálvalussii '}
                    <Link href={'tel:55553333'}>{'55 55 33 33'}</Link>
                    {
                        ' ja dáhtot ahte davvisámegielat bagadalli riŋge dutnje. Muite addit riegadan- ja persunnummara ja maid telefunnummara masa davvisámegielat galga riŋget.'
                    }
                </BodyLong>
            </GuidePanel>
            <SamiskSamtaleOrderForm />
        </div>
    );
};
