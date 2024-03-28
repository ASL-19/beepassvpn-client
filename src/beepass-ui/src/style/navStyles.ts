import { css } from "@emotion/react";

import { Language } from "src/stores/appStore";

export const navSideIconContainer = css`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 30px;
`;
export const navSvgIcon = ({ localeCode }: { localeCode: Language }) => css`
  width: 1.5rem;
  height: 1.5rem;

  ${localeCode === "fa" && `transform:rotate(180deg)`}
`;
export const navLogoContainer = css`
  display: flex;
  flex: 2 1 100%;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 0.5rem;

  font-size: 1.25rem;

  svg {
    max-width: 12.5rem;
    height: 100%;
  }
`;
