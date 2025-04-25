declare module 'wouter-preact/static' {
    import { FunctionComponent } from 'preact';

    export interface StaticRouterProps {
        base?: string;
        location: string;
        children?: preact.ComponentChildren;
    }

    export const StaticRouter: FunctionComponent<StaticRouterProps>;
}
