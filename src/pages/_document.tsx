import React from 'react';
// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, {
    DocumentContext,
    Head,
    Html,
    Main,
    NextScript,
} from 'next/document';
import { getDecoratorComponents } from '../utils/decorator';
import { Components } from '@navikt/nav-dekoratoren-moduler/ssr';

type DocumentProps = {
    Decorator: Components;
};

class MyDocument extends Document<DocumentProps> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        const Decorator = await getDecoratorComponents();

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
