// ../vite.config.ts
import { defineConfig, loadEnv } from "file:///Users/terje/Dev/samisk-samtale-bestilling/node_modules/vite/dist/node/index.js";
import preact from "file:///Users/terje/Dev/samisk-samtale-bestilling/node_modules/@preact/preset-vite/dist/esm/index.mjs";
import { visualizer } from "file:///Users/terje/Dev/samisk-samtale-bestilling/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };
  process.env.ENV = process.env.ENV || "production";
  return {
    plugins: [preact(), ...process.env.ANALYZE ? [visualizer({ gzipSize: true, open: true, sourcemap: true })] : []],
    esbuild: {
      legalComments: "none"
    },
    target: "es2018",
    ssr: {
      // Dependencies containing React components must not be externalized
      // from the SSR bundle, in order to work with preact/compat. This
      // list must also include transitive dependencies.
      noExternal: ["@navikt/ds-react", "@navikt/ds-icons", "@navikt/aksel-icons", "@navikt/ds-css", "react-router", "react-router-dom"]
    },
    base: process.env.VITE_APP_BASEPATH,
    css: {
      modules: {
        // Create stable (but verbose!) classnames in dev mode, in order
        // to support HMR
        ...process.env.ENV === "development" && {
          generateScopedName: "[path][name]__[local]"
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vdml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdGVyamUvRGV2L3NhbWlzay1zYW10YWxlLWJlc3RpbGxpbmdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy90ZXJqZS9EZXYvc2FtaXNrLXNhbXRhbGUtYmVzdGlsbGluZy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdGVyamUvRGV2L3NhbWlzay1zYW10YWxlLWJlc3RpbGxpbmcvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCBwcmVhY3QgZnJvbSAnQHByZWFjdC9wcmVzZXQtdml0ZSc7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgICBwcm9jZXNzLmVudiA9IHsgLi4ucHJvY2Vzcy5lbnYsIC4uLmxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpIH07XG4gICAgcHJvY2Vzcy5lbnYuRU5WID0gcHJvY2Vzcy5lbnYuRU5WIHx8ICdwcm9kdWN0aW9uJztcblxuICAgIHJldHVybiB7XG4gICAgICAgIHBsdWdpbnM6IFtwcmVhY3QoKSwgLi4uKHByb2Nlc3MuZW52LkFOQUxZWkUgPyBbdmlzdWFsaXplcih7IGd6aXBTaXplOiB0cnVlLCBvcGVuOiB0cnVlLCBzb3VyY2VtYXA6IHRydWUgfSldIDogW10pXSxcbiAgICAgICAgZXNidWlsZDoge1xuICAgICAgICAgICAgbGVnYWxDb21tZW50czogJ25vbmUnLFxuICAgICAgICB9LFxuICAgICAgICB0YXJnZXQ6ICdlczIwMTgnLFxuICAgICAgICBzc3I6IHtcbiAgICAgICAgICAgIC8vIERlcGVuZGVuY2llcyBjb250YWluaW5nIFJlYWN0IGNvbXBvbmVudHMgbXVzdCBub3QgYmUgZXh0ZXJuYWxpemVkXG4gICAgICAgICAgICAvLyBmcm9tIHRoZSBTU1IgYnVuZGxlLCBpbiBvcmRlciB0byB3b3JrIHdpdGggcHJlYWN0L2NvbXBhdC4gVGhpc1xuICAgICAgICAgICAgLy8gbGlzdCBtdXN0IGFsc28gaW5jbHVkZSB0cmFuc2l0aXZlIGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgIG5vRXh0ZXJuYWw6IFsnQG5hdmlrdC9kcy1yZWFjdCcsICdAbmF2aWt0L2RzLWljb25zJywgJ0BuYXZpa3QvYWtzZWwtaWNvbnMnLCAnQG5hdmlrdC9kcy1jc3MnLCAncmVhY3Qtcm91dGVyJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgfSxcbiAgICAgICAgYmFzZTogcHJvY2Vzcy5lbnYuVklURV9BUFBfQkFTRVBBVEgsXG4gICAgICAgIGNzczoge1xuICAgICAgICAgICAgbW9kdWxlczoge1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBzdGFibGUgKGJ1dCB2ZXJib3NlISkgY2xhc3NuYW1lcyBpbiBkZXYgbW9kZSwgaW4gb3JkZXJcbiAgICAgICAgICAgICAgICAvLyB0byBzdXBwb3J0IEhNUlxuICAgICAgICAgICAgICAgIC4uLihwcm9jZXNzLmVudi5FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYge1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVNjb3BlZE5hbWU6ICdbcGF0aF1bbmFtZV1fX1tsb2NhbF0nLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULFNBQVMsY0FBYyxlQUFlO0FBQ3RWLE9BQU8sWUFBWTtBQUNuQixTQUFTLGtCQUFrQjtBQUczQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN0QyxVQUFRLE1BQU0sRUFBRSxHQUFHLFFBQVEsS0FBSyxHQUFHLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDcEUsVUFBUSxJQUFJLE1BQU0sUUFBUSxJQUFJLE9BQU87QUFFckMsU0FBTztBQUFBLElBQ0gsU0FBUyxDQUFDLE9BQU8sR0FBRyxHQUFJLFFBQVEsSUFBSSxVQUFVLENBQUMsV0FBVyxFQUFFLFVBQVUsTUFBTSxNQUFNLE1BQU0sV0FBVyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBRTtBQUFBLElBQ2pILFNBQVM7QUFBQSxNQUNMLGVBQWU7QUFBQSxJQUNuQjtBQUFBLElBQ0EsUUFBUTtBQUFBLElBQ1IsS0FBSztBQUFBO0FBQUE7QUFBQTtBQUFBLE1BSUQsWUFBWSxDQUFDLG9CQUFvQixvQkFBb0IsdUJBQXVCLGtCQUFrQixnQkFBZ0Isa0JBQWtCO0FBQUEsSUFDcEk7QUFBQSxJQUNBLE1BQU0sUUFBUSxJQUFJO0FBQUEsSUFDbEIsS0FBSztBQUFBLE1BQ0QsU0FBUztBQUFBO0FBQUE7QUFBQSxRQUdMLEdBQUksUUFBUSxJQUFJLFFBQVEsaUJBQWlCO0FBQUEsVUFDckMsb0JBQW9CO0FBQUEsUUFDeEI7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
