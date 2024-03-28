import { css } from "@emotion/react";

import iranSans400NormalWoffUrl from "src/static/fonts/iranSans400Normal.woff";
import iranSans400NormalWoff2Url from "src/static/fonts/iranSans400Normal.woff2";
import iranSans500NormalWoffUrl from "src/static/fonts/iranSans500Normal.woff";
import iranSans500NormalWoff2Url from "src/static/fonts/iranSans500Normal.woff2";
import iranSans700NormalWoffUrl from "src/static/fonts/iranSans700Normal.woff";
import iranSans700NormalWoff2Url from "src/static/fonts/iranSans700Normal.woff2";
import robotoV29Latin400ItalicWoffUrl from "src/static/fonts/robotoV29Latin400Italic.woff";
import robotoV29Latin400ItalicWoff2Url from "src/static/fonts/robotoV29Latin400Italic.woff2";
import robotoV29Latin400NormalWoffUrl from "src/static/fonts/robotoV29Latin400Normal.woff";
import robotoV29Latin400NormalWoff2Url from "src/static/fonts/robotoV29Latin400Normal.woff2";
import robotoV29Latin500ItalicWoffUrl from "src/static/fonts/robotoV29Latin500Italic.woff";
import robotoV29Latin500ItalicWoff2Url from "src/static/fonts/robotoV29Latin500Italic.woff2";
import robotoV29Latin500NormalWoffUrl from "src/static/fonts/robotoV29Latin500Normal.woff";
import robotoV29Latin500NormalWoff2Url from "src/static/fonts/robotoV29Latin500Normal.woff2";
import robotoV29Latin700ItalicWoffUrl from "src/static/fonts/robotoV29Latin700Italic.woff";
import robotoV29Latin700ItalicWoff2Url from "src/static/fonts/robotoV29Latin700Italic.woff2";
import robotoV29Latin700NormalWoffUrl from "src/static/fonts/robotoV29Latin700Normal.woff";
import robotoV29Latin700NormalWoff2Url from "src/static/fonts/robotoV29Latin700Normal.woff2";
import swiperStyles from "src/style/swiperStyles";

const globalStyles = css`
  @font-face {
    font-weight: 400;
    font-family: "Iran Sans";
    font-style: normal;
    src: url("${iranSans400NormalWoff2Url}") format("woff2"),
      url("${iranSans400NormalWoffUrl}") format("woff");
    font-display: swap;
  }
  @font-face {
    font-weight: 500;
    font-family: "Iran Sans";
    font-style: normal;
    src: url("${iranSans500NormalWoff2Url}") format("woff2"),
      url("${iranSans500NormalWoffUrl}") format("woff");
    font-display: swap;
  }
  @font-face {
    font-weight: 700;
    font-family: "Iran Sans";
    font-style: normal;
    src: url("${iranSans700NormalWoff2Url}") format("woff2"),
      url("${iranSans700NormalWoffUrl}") format("woff");
    font-display: swap;
  }
  @font-face {
    font-weight: 400;
    font-family: "Roboto";
    font-style: normal;
    src: url("${robotoV29Latin400NormalWoff2Url}") format("woff2"),
      url("${robotoV29Latin400NormalWoffUrl}") format("woff");
    font-display: swap;
  }
  @font-face {
    font-weight: 400;
    font-family: "Roboto";
    font-style: italic;
    src: url("${robotoV29Latin400ItalicWoff2Url}") format("woff2"),
      url("${robotoV29Latin400ItalicWoffUrl}") format("woff");
    font-display: swap;
  }
  @font-face {
    font-weight: 500;
    font-family: "Roboto";
    font-style: normal;
    src: url("${robotoV29Latin500NormalWoff2Url}") format("woff2"),
      url("${robotoV29Latin500NormalWoffUrl}") format("woff");
    font-display: swap;
  }
  @font-face {
    font-weight: 500;
    font-family: "Roboto";
    font-style: italic;
    src: url("${robotoV29Latin500ItalicWoff2Url}") format("woff2"),
      url("${robotoV29Latin500ItalicWoffUrl}") format("woff");
    font-display: swap;
  }
  @font-face {
    font-weight: 700;
    font-family: "Roboto";
    font-style: normal;
    src: url("${robotoV29Latin700NormalWoff2Url}") format("woff2"),
      url("${robotoV29Latin700NormalWoffUrl}") format("woff");
    font-display: swap;
  }
  @font-face {
    font-weight: 700;
    font-family: "Roboto";
    font-style: italic;
    src: url("${robotoV29Latin700ItalicWoff2Url}") format("woff2"),
      url("${robotoV29Latin700ItalicWoffUrl}") format("woff");
    font-display: swap;
  }

  html {
    width: 100%;

    background-color: white;
    background-repeat: no-repeat;

    color: black;
    font-weight: 400;
    font-size: 100%;
    /* disable window scrolling */
    overflow-y: hidden;
    overflow-x: hidden;
    /* Safari only supports the prefixed version of text-size-adjust */
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }
  html.ltr {
    direction: ltr;
    text-align: left;
  }
  html.rtl {
    direction: rtl;
    text-align: right;
  }
  /* Apply 3D transformation to all macOS elements except <g> (since it would
  break connection animation). This is a workaround to prevent parts of the UI
  from breaking in newer versions of macOS, where the deprecated WebView seems
  to have issues consistently rendering elements that aren’t forced into GPU
  compositing.

  This is probably bad for performance but there’s no other obvious solution
  until Jigsaw migrates the app to WKWebView.

  Wrapped in :where() to reduce CSS specificity.
  */
  :where(html.osx *:not(g)) {
    transform: translate3d(0, 0, 0);
  }

  html.en * {
    font-family: "Roboto", sans-serif;
  }
  html.fa * {
    font-family: "Iran Sans", sans-serif;
  }

  html.focusOutlinesHidden * {
    outline: none !important;
  }

  body {
    overflow: hidden;
    margin: 0;
  }
  body * {
    box-sizing: border-box;
  }

  /* Flex layout containing two items: Navigator (flex: 0 0 auto) and
  PageContainer (flex: 1 1 auto)  */
  #root {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  img {
    border: none;
  }

  button,
  input[type="button"],
  input[type="submit"] {
    cursor: pointer;
  }

  button {
    margin: 0;
    padding: 0;

    background-color: initial;
    border: none;

    appearance: none;
  }
  input,
  textarea,
  keygen,
  select,
  button {
    border-radius: 0;

    font-size: inherit;
    font-family: inherit;
  }

  /* On iOS devices inputs should never have font sizes smaller than 16px
  because Safari will forcibly zoom the viewport.  */
  html.userAgentIsIos input,
  html.userAgentIsIos textarea,
  html.userAgentIsIos keygen,
  html.userAgentIsIos select,
  html.userAgentIsIos button {
    font-size: 16px;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  ul,
  p {
    margin: 0;
  }
  a {
    text-decoration: none;
  }
  ul {
    padding: 0;

    list-style: none;
  }
  li {
    list-style: none;
  }

  .fresnel-container {
    display: contents;
    /* Note: these styles are only applied if display: contents is unsupported */
    grid-column: 1 / -1;
    width: 100%;
  }

  /* ${swiperStyles}; */
`;

export default globalStyles;
