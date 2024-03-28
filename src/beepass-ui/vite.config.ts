/// <reference types="vitest" />

import pluginReactSwc from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, PluginOption } from "vite";

import loadAndValidateEnvironmentVariables from "./src/utils/environment/loadAndValidateEnvironmentVariables";

const viteConfig = defineConfig(({ mode }) => {
  const env = loadAndValidateEnvironmentVariables({ mode });

  const injectCordovaScriptTagPlugin = (): PluginOption => ({
    name: "htmlTransform",
    transformIndexHtml: (html) =>
      html.replace(
        // Must match placeholder comment in index.html!
        "<!-- CORDOVA_SCRIPT_TAG_PLACEHOLDER -->",
        env.VITE_BUILD_TYPE === "cordova-native"
          ? `<script src="cordova.js" type="text/javascript"></script>`
          : "",
      ),
  });

  return {
    // cordova using relative path to access file
    base: "./",
    build: {
      outDir: "build",
      // Should be the same as tsconfig.json compilerOptions.target
      target: "es2019",
    },
    define: {
      // To override env variable, have to stringify the variable first.
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(env.VITE_APP_VERSION),
      "import.meta.env.VITE_SENTRY_DSN": JSON.stringify(env.SENTRY_DSN),
    },
    plugins: [
      pluginReactSwc({
        jsxImportSource: "@emotion/react",
        plugins: [["@swc/plugin-emotion", {}]],
      }),
      injectCordovaScriptTagPlugin(),
    ],
    resolve: {
      alias: {
        src: path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
    },
    test: {
      environment: "jsdom",
      globals: true,
      include: ["**/*.test.ts?(x)"],
      setupFiles: "src/setupTests.js",
      testTimeout: 10000,
    },
  };
});

export default viteConfig;
