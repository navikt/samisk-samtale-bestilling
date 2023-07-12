import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { DecoratorComponents } from '@navikt/nav-dekoratoren-moduler/ssr';
import { getDecorator } from '../utils/decorator';
import { Locale } from '../localization/LocaleString';

type DocumentProps = {
    Decorator: DecoratorComponents;
};

class MyDocument extends Document<DocumentProps> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        const locale = ctx.locale as Locale;
        const Decorator = await getDecorator(locale);

        return {
            ...initialProps,
            Decorator,
        };
    }

    render() {
        const { Decorator } = this.props;

        return (
            <Html>
                <Head>
                    <Decorator.Styles />
                </Head>
                <body>
                    <Decorator.Header />
                    <Main />
                    <Decorator.Footer />
                    <Decorator.Scripts />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
