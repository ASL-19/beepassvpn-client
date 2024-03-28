/// <reference types="vite/client" />

/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable no-var */
declare module "*.png";
declare module "*.txt";
declare module "*.woff";
declare module "*.woff2";

type ValidEnv =
  import("./src/utils/environment/loadAndValidateEnvironmentVariables").ValidEnv;

interface ImportMetaEnv {
  /**
   *
   * Sentry DSN. We need to set this (rather than `VITE_SENTRY_DSN` since
   * the value is used in Outline’s native build code).
   *
   * @see https://docs.sentry.io/product/sentry-basics/dsn-explainer/
   */
  SENTRY_DSN: string;

  /**
   * App version
   *
   * This is automatically set in craco.config.ts based on the content of the
   * root Cordova `config.xml` file.
   */
  VITE_APP_VERSION: string;

  /**
   * Frontend build type
   *
   * Based on different platforms to build frontend
   */
  VITE_BUILD_TYPE: ValidEnv["VITE_BUILD_TYPE"];

  /**
   * [OPTIONAL] Default access key.
   *
   * If set the server list will include this server (named with
   * ServerCard.serverDefaultName) by default on first start.
   */
  VITE_DEFAULT_ACCESS_KEY?: string;

  /**
   * [OPTIONAL] Should the feedback page be accessible in the navigation menu?
   *
   * Must be set to "true" or "" if provided.
   */
  VITE_ENABLE_FEEDBACK_PAGE?: ValidEnv["VITE_ENABLE_FEEDBACK_PAGE"];

  /**
   * [OPTIONAL] Should app connect to standalone React DevTools?
   *
   * Should only be used in development.
   *
   * Must be set to "true" or "" if provided.
   *
   * @see
   * https://github.com/facebook/react/tree/master/packages/react-devtools#usage-with-react-dom
   */
  VITE_ENABLE_STANDALONE_REACT_DEVTOOLS?: ValidEnv["VITE_ENABLE_STANDALONE_REACT_DEVTOOLS"];

  /**
   * Landing page endpoint URL
   */
  VITE_LANDING_PAGE_ENDPOINT: string;

  /**
   * Landing page IP header name
   */
  VITE_LANDING_PAGE_IP_HEADER_NAME: string;

  /**
   * Landing page type header name
   */
  VITE_LANDING_PAGE_TYPE_HEADER_NAME: string;

  /**
   * Landing page type header value
   */
  VITE_LANDING_PAGE_TYPE_HEADER_VALUE: string;

  /**
   * Sentry DSN
   *
   * This is automatically set based on the value of `SENTRY_DSN`.
   */
  VITE_SENTRY_DSN: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

declare namespace globalThis {
  var asl19StoreStates;
  var cordova: typeof import("@types/cordova");
}

interface Navigator {
  // Cordova augments window.navigator with app property
  app: {
    exitApp: () => void;
  };
}
