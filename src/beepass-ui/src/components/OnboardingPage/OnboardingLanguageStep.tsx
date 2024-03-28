import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import { FC, memo, useCallback } from "react";

import { useOnboardingContext } from "src/hooks/useOnboardingContext";
import { Language, useAppDispatch, useStrings } from "src/stores/appStore";
import colors from "src/style/colors";

export type OnboardingLanguageStepStrings = {
  /**
   * Note: This doesn’t need to be translated into Arabic or Persian since the
   * language will always be English when this page is rendered (since the
   * default language is English).
   */
  heading: string;
};

export const container = css({
  background: "white",
  bottom: 0,
  left: 0,
  minHeight: "100vh",
  position: "fixed",
  right: 0,
  top: 0,
  width: "100%",
  zIndex: 100,
});

export const changeLanguageSlideContainer = css({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: "2.75rem",
  height: "100%",
  justifyContent: "center",
  width: "100%",
});

const heading = css({
  fontSize: "1.31rem",
  fontweight: 500,
});

const languageButtonsContainer = css({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

const languageButton = css({
  backgroundColor: `${colors.yellow} !important`,
  color: "black",
  fontSize: " 0.875rem",
  height: "2.25rem",
  textTransform: "none",
  width: "8.5rem",
});

const enLanguageButton = css(languageButton, {
  fontFamily: "Roboto, sans-serif !important",
});

const faLanguageButton = css(languageButton, {
  fontFamily: "Iran Sans, sans-serif !important",
});

const OnboardingLanguageStep: FC = memo(() => {
  const appDispatch = useAppDispatch();
  const { setIsLanguageSet } = useOnboardingContext();
  const strings = useStrings();

  const chooseLanguageClick = useCallback(
    (language: Language) => () => {
      setIsLanguageSet(true);

      appDispatch({ language, type: "change_language" });
    },
    [appDispatch, setIsLanguageSet],
  );
  return (
    <div css={container}>
      <div css={changeLanguageSlideContainer}>
        <h2 css={heading}>{strings.OnboardingLanguageStep.heading}</h2>
        <div css={languageButtonsContainer}>
          <Button css={enLanguageButton} onClick={chooseLanguageClick("en")}>
            {strings.shared.languages.english}
          </Button>
          <Button css={faLanguageButton} onClick={chooseLanguageClick("fa")}>
            {strings.shared.languages.persian}
          </Button>
        </div>
      </div>
    </div>
  );
});

OnboardingLanguageStep.displayName = "OnboardingLanguageStep";

export default OnboardingLanguageStep;
