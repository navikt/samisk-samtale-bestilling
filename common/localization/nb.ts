import { LocaleStringId } from './localeUtils';

export const localeModuleNb: {
    [key in LocaleStringId]: string | ((...args: string[]) => string);
} = {
    tittel: 'Bestille en telefonsamtale med NAV på nordsamisk',
    fornavn: 'Fornavn',
    etternavn: 'Etternavn',
    telefonnummer: 'Telefon',
    tidsrom: 'Ønsket tidspunkt for samtale',
    ingress:
        `<p class="navds-body-long navds-typo--spacing">
            Her kan du bestille en telefonsamtale med NAV på nordsamisk.
            Vi hjelper deg med status i saken din og veileder deg om rettigheter og plikter. 
            For å finne informasjon om dine saker og utbetalinger, kan du logge inn på&nbsp;<a href="https://www.nav.no/minside">nav.no</a>.
        </p>
        <p class="navds-body-long">
            Du kan også ringe NAV på&nbsp;<a href="tel:+4755553333">55 55 33 33</a>&nbsp;og be om å bli kontaktet av en samisk veileder.
        </p>`,
    knapp: 'Send bestilling',
    feilmeldingFornavn: 'Skriv fornavnet ditt',
    feilmeldingEtternavn: 'Skriv etternavnet ditt',
    feilmeldingTelefonnummer: 'Skriv telefonnummeret ditt',
    feilmeldingTidsrom: 'Velg tidspunkt for samtale',
    varselboksTekst: 'Vil du ringe oss på telefon 90 29 81 18? Fram til 1. april tester vi ut direktetelefon for henvendelser på nord-samisk. Du kan fortsatt bestille en samtale, se under.',
};
