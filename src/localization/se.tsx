import React from 'react';
import { LocaleModule } from './nb';

export const localeModuleSe: LocaleModule = {
    tittel: 'Jearaldat bagadallama oažžut sámegillii telefovnnas',
    fornavn: 'Ovdanamma',
    etternavn: 'Goargu',
    telefonnummer: 'Telefovdna',
    tidsrom: 'Goas heive duinna váldit oktavuođa?',
    ingress: () => (
        <>
            Diŋgo dás davvisámegilli bálvalusa mas vástiduvvo dutnje sámegillii
            buot NAV – bálvalusain ja oajuin. Mii veahkehit gávdnat mo du áššiin
            manná, ja veahkehit du dovdat rivttiid ja geatnegasvuođaid mat leat
            álbmotoadjolága njuolggadusain. Don gávnnat dieđuid iežat áššis
            neahttabálvalusas&nbsp;
            <a href="https://www.nav.no/minside">Min side</a>. Don sáhtát iskat
            mii dutnje lea máksojuvvon dás: <br />
            <br />
            Don sáhtat ain riŋget NAV-bálvalussii&nbsp;
            <a href="tel:55553333">55 55 33 33</a>&nbsp; ja dáhtot ahte
            davvisámegielat bagadalli riŋge dutnje. Muite addit riegadan- ja
            persunnummara ja maid telefunnummara masa davvisámegielat galga
            riŋget.
        </>
    ),
    knapp: 'Sádde jearaldaga',
    feilmeldingFornavn: 'Čále ovdanama',
    feilmeldingEtternavn: 'Čále goarggu',
    feilmeldingTelefonnummer: 'Čále telefon-nummara',
    feilmeldingTidsrom: 'Vállje áiggi goas heive',
};
