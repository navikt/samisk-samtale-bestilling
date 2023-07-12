import path from 'path';
import fs from 'fs';
import { injectWithDecorator } from '../../utils/decorator';

const templatePath =
    process.env.NODE_ENV === 'development'
        ? path.resolve(process.cwd(), '..', 'index.html')
        : path.resolve(process.cwd(), 'dist', 'client', 'index.html');

const getUndecoratedTemplate = () =>
    fs.readFileSync(templatePath, { encoding: 'utf-8' });

export const buildHtmlTemplate = async () => {
    const templateWithDecorator = await injectWithDecorator(templatePath);

    if (!templateWithDecorator) {
        console.error(`Failed to fetch decorator, using undecorated template`);
        return getUndecoratedTemplate();
    }

    return templateWithDecorator;
};
