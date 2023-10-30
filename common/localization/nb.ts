import { LocaleStringId } from './localeUtils';

export const localeModuleNb: {
    [key in LocaleStringId]: string | ((...args: string[]) => string);
} = {
    tittel: 'Bestille en telefonsamtale med NAV på nordsamisk',
    fornavn: 'Fornavn',
    etternavn: 'Etternavn',
    telefonnummer: 'Telefon',
    tidsrom: 'Ønsket tidspunkt for samtale',
    ingress: `
            Her kan du bestille en telefonsamtale med NAV på nordsamisk. Vi
            hjelper deg med status i saken din og veileder deg om rettigheter og
            plikter. <br /> For å finne informasjon om dine saker og
            utbetalinger, kan du logge inn på&nbsp;
            <a href="https://www.nav.no/minside">nav.no</a>. <br /> Du kan også
            ringe NAV på <a href="tel:+4755553333">55 55 33 33</a>
            &nbsp;og be om å bli kontaktet av en samisk veileder.
            `,
    knapp: 'Send bestilling',
    feilmeldingFornavn: 'Skriv fornavnet ditt',
    feilmeldingEtternavn: 'Skriv etternavnet ditt',
    feilmeldingTelefonnummer: 'Skriv telefonnummeret ditt',
    feilmeldingTidsrom: 'Velg tidspunkt for samtale',
};
