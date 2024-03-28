import { IconButton } from "@mui/material";
import { Fragment, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { match } from "ts-pattern";

import ArrowBack from "src/components/icons/ArrowBack";
import { useLocaleCode, useStrings } from "src/stores/appStore";
import {
  navLogoContainer,
  navSideIconContainer,
  navSvgIcon,
} from "src/style/navStyles";

export type HeaderChildPageContentStrings = {
  /**
   * A11y label for the back (to servers page) button.
   */
  backButtonA11yLabel: string;
};

const HeaderChildPageContent = memo(() => {
  const navigate = useNavigate();

  const localeCode = useLocaleCode();

  const strings = useStrings();

  const memorizedNavigate = useCallback(() => {
    navigate("/servers");
  }, [navigate]);

  const screenName = match(location.hash)
    .with("#/about", () => strings.AboutPage.aboutPageTitle)
    .with("#/feedback", () => strings.FeedbackPage.feedbackPageTitle)
    .with("#/help", () => strings.HelpPage.helpPageTitle)
    .with("#/language", () => strings.LanguagePage.languagePageTitle)
    .with("#/licenses", () => strings.LicensesPage.licensesPageTitle)
    .otherwise(() => "");

  return (
    <Fragment>
      <div css={navSideIconContainer}>
        <IconButton
          onClick={memorizedNavigate}
          aria-label={strings.HeaderChildPageContent.backButtonA11yLabel}
        >
          <ArrowBack css={navSvgIcon({ localeCode })} />
        </IconButton>
      </div>
      <div css={navLogoContainer}>{screenName}</div>
      <div css={navSideIconContainer} />
    </Fragment>
  );
});
HeaderChildPageContent.displayName = "HeaderChildPageContent";

export default HeaderChildPageContent;
