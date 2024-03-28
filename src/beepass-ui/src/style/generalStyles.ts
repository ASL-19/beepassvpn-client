import { css } from "@emotion/react";

export const invisible = css`
  position: absolute !important;

  overflow: hidden;
  float: none !important;
  height: auto !important;
  margin: 0;
  padding: 0;

  line-height: initial !important;
  white-space: nowrap;

  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
`;
