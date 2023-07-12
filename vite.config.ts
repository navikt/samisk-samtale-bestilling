import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';

    return {
        plugins: [
            preact(),
            ...(process.env.ANALYZE
                ? [visualizer({ gzipSize: true, open: true, sourcemap: true })]
                : []),
        ],
        build: {
            sourcemap: true,
        },
        ssr: {
            // Dependencies containing React components must not be externalized
            // from the SSR bundle, in order to work with preact/compat. This
            // list must also include transitive dependencies.
            noExternal: [
                '@navikt/ds-react',
                '@navikt/ds-icons',
                'react-router',
                'react-router-dom',
            ],
        },
        base: process.env.APP_BASEPATH,
        css: {
            modules: {
                // Create stable (but verbose!) classnames in dev mode, in order
                // to support HMR
                ...(process.env.NODE_ENV === 'development' && {
                    generateScopedName: '[path][name]__[local]',
                }),
            },
        },
    };
});
