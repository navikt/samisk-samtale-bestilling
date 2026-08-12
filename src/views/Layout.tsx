import { raw } from 'hono/html';
import { DecoratorElements } from '@navikt/nav-dekoratoren-moduler/ssr/index.js';
import { Child } from 'hono/jsx';
import { Locale } from '../localization/localeUtils.js';

type LayoutProps = {
    locale: Locale;
    title: string;
    basePath: string;
    decorator: DecoratorElements;
    children?: Child;
};

export const Layout = ({ locale, title, basePath, decorator, children }: LayoutProps) => (
    <html lang={locale}>
        <head>
            <meta charset="UTF-8" />
            <link rel="preload" href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{title}</title>
            <link rel="stylesheet" href="https://cdn.nav.no/aksel/@navikt/ds-css/8.16.1/index.min.css" />
            <link rel="stylesheet" href={`${basePath}/static/app.css`} />
            {raw(decorator.DECORATOR_HEAD_ASSETS)}
        </head>
        <body>
            {raw(decorator.DECORATOR_HEADER)}
            <main id="maincontent" tabindex={-1}>
                {children}
            </main>
            {raw(decorator.DECORATOR_FOOTER)}
            {raw(decorator.DECORATOR_SCRIPTS)}
            <script src={`${basePath}/static/enhance.js`} type="module"></script>
        </body>
    </html>
);
