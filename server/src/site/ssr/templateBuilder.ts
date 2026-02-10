import path from 'path';
import fs from 'fs';
import { injectWithDecorator } from '../../utils/decorator';
import { Locale } from '../../../../common/localization/localeUtils';
import { DecoratorParams } from '@navikt/nav-dekoratoren-moduler';

const templatePath =
    process.env.NODE_ENV === 'development'
        ? path.resolve(process.cwd(), '..', 'index.html')
        : path.resolve(process.cwd(), 'server', 'dist', 'client', 'index.html');

const getUndecoratedTemplate = () => fs.readFileSync(templatePath, { encoding: 'utf-8' });

export const buildHtmlTemplate = async (locale: Locale) => {
    const partialParams: DecoratorParams = { language: locale };
    const templateWithDecorator = await injectWithDecorator(templatePath, partialParams);

    if (!templateWithDecorator) {
        console.error('Failed to fetch decorator, using undecorated template');
        return getUndecoratedTemplate();
    }

    return templateWithDecorator;
};
