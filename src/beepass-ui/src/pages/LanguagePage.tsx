import { css } from "@emotion/react";
import { Divider } from "@mui/material";
import { memo, useCallback } from "react";

import CheckSvg from "../components/icons/CheckSvg";
import ScrollableContent from "../components/ScrollableContent";
import colors from "../style/colors";

import {
  Language,
  useAppDispatch,
  useLocaleCode,
  useStrings,
} from "src/stores/appStore";

namespace styles {
  export const languageItem = ({ isSelect }: { isSelect: boolean }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 3rem;
    padding: 0 1.5rem;

    color: ${isSelect ? colors.blueNeon : colors.blackText};
    font-size: 1rem;
  `;

  export const languageText = ({ language }: { language: Language }) => css`
    /* stylelint-disable-next-line font-family-name-quotes */
    font-family: "${language === "fa" ? "Iran Sans" : "Roboto"}", sans-serif !important;
  `;

  export const iconStyle = css`
    width: 1.5rem;
    height: 1.5rem;

    fill: ${colors.blueNeon};
  `;
}

const LanguagePage = memo(() => {
  const language = useLocaleCode();
  const appDispatch = useAppDispatch();
  const strings = useStrings();

  const handleLanguageChange = useCallback(
    (language: Language) => () => {
      appDispatch({ language, type: "change_language" });
    },
    [appDispatch],
  );

  const checkSvg = <CheckSvg aria-hidden css={styles.iconStyle} />;

  return (
    <ScrollableContent>
      <div role="listbox">
        <button
          css={styles.languageItem({
            isSelect: language === "en",
          })}
          role="option"
          aria-selected={language === "en"}
          onClick={handleLanguageChange("en")}
        >
          <span css={styles.languageText({ language: "en" })}>
            {strings.shared.languages.english}
          </span>

          {language === "en" && checkSvg}
        </button>
        <Divider />
        <button
          css={styles.languageItem({
            isSelect: language === "fa",
          })}
          role="option"
          aria-selected={language === "fa"}
          onClick={handleLanguageChange("fa")}
        >
          <span css={styles.languageText({ language: "fa" })}>
            {strings.shared.languages.persian}
          </span>

          {language === "fa" && checkSvg}
        </button>
      </div>
      <Divider />
    </ScrollableContent>
  );
});

LanguagePage.displayName = "LanguagePage";

export default LanguagePage;
