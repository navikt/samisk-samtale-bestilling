// runs before test files import - config.ts reads env at import time
process.env.ENV = 'prod';
process.env.APP_PORT = '3006';
process.env.APP_BASEPATH = '/person/bestilling-av-samisk-samtale';
process.env.API_URL = 'http://tilbakemeldingsmottak-api.test';
process.env.KONTAKTINFO_API_URL = 'https://www.nav.no/tms-personopplysninger-api/kontaktinformasjon';

import 'html-validate/vitest';
