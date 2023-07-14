import { buildHtmlTemplate } from './templateBuilder';
import { ViteDevServer } from 'vite';
import { render } from '../../_ssr-dist/main-server';
import { Locale, defaultLocale, localeString } from '../../../../common/localization/localeUtils';

export type HtmlRenderer = (locale: Locale, url: string, context?: AppContext) => Promise<string>;

export type AppContext = {
    [key: string]: string | number | boolean | null | AppContext;
};

const processTemplate = async (locale: Locale, templateHtml: string, appHtml: string, appContext: AppContext = {}) => {
    return templateHtml
        .replace('<!--ssr-app-html-->', appHtml)
        .replace('%%LANG%%', locale || defaultLocale)
        .replace('%%TITLE%%', localeString('tittel', locale))
        .replace('"ssr-app-context"', JSON.stringify(appContext));
};

export const prodRender: HtmlRenderer = async (locale, url, context) => {
    try {
        const template = await buildHtmlTemplate(locale);
        const appHtml = render(url, locale);
        return processTemplate(locale, template, appHtml, context);
    } catch (e) {
        console.error(`Rendering failed ${e}`);
        return '';
    }
};

export const devRender =
    (vite: ViteDevServer): HtmlRenderer =>
    async (locale, url, context) => {
        console.log(`Rendering for development with locale ${locale}`);
        try {
            const template = await buildHtmlTemplate(locale);
            const { render } = await vite.ssrLoadModule('/src/main-server.tsx');
            const appHtml = render(url, locale);
            const html = await vite.transformIndexHtml(url, template);
            return processTemplate(locale, html, appHtml, context);
        } catch (e) {
            vite.ssrFixStacktrace(e as Error);
            console.error(`Dev render error: ${e}`);
            return '';
        }
    };
