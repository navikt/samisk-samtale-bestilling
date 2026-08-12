import { LocaleModule } from './localeUtils.js';

export const localeModuleNb: LocaleModule = {
    tittel: 'Bestille en telefonsamtale med Nav på nordsamisk',
    fornavn: 'Fornavn',
    etternavn: 'Etternavn',
    telefonnummer: 'Telefon',
    tidsrom: 'Ønsket tidspunkt for samtale',
    tidsromFormiddag: '08.00-10.00',
    tidsromEttermiddag: '13.30-15.30',
    ingress: `<p class="aksel-body-long aksel-typo--spacing">
            Her kan du bestille en telefonsamtale med Nav på nordsamisk.
            Vi hjelper deg med status i saken din og veileder deg om rettigheter og plikter.
            For å finne informasjon om dine saker og utbetalinger, kan du logge inn på&nbsp;<a href="https://www.nav.no/minside">nav.no</a>.
        </p>
        <p class="aksel-body-long">
            Du kan også ringe Nav på&nbsp;<a href="tel:+4755553333">55&nbsp;55&nbsp;33&nbsp;33</a>&nbsp;og
            be om å bli kontaktet av en samisk veileder.
        </p>`,
    knapp: 'Send bestilling',
    feilmeldingFornavn: 'Skriv fornavnet ditt',
    feilmeldingEtternavn: 'Skriv etternavnet ditt',
    feilmeldingTelefonnummer: 'Skriv telefonnummeret ditt',
    feilmeldingTidsrom: 'Velg tidspunkt for samtale',
    feilmeldingInnsending: 'Feil ved innsending. Prøv igjen senere.',
    kvitteringTekst: 'Meldingen din er sendt',
    varselboksTekst: `Vil du ringe oss på telefon 90&nbsp;29&nbsp;81&nbsp;18?<br>
        Vi tester ut direktetelefon for henvendelser på nord-samisk. Du kan fortsatt bestille en samtale, se under.`,
};
