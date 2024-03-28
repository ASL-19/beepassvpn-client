import { css } from "@emotion/react";
import { memo } from "react";

import FormattedMessage from "../components/FormattedMessage";
import ScrollableContent from "../components/ScrollableContent";
import colors from "../style/colors";

import BeepassPoweredByOutlineLogoSvg from "src/components/icons/BeePassPoweredByOutlineLogoSvg";
import { useLocaleCode } from "src/stores/appStore";
import { logoPage } from "src/style/logoStyles";

export namespace styles {
  export const helpContentContainer = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    padding: 1.5rem;
  `;
  export const logo = css`
    width: 5.375rem;
    height: 5.375rem;
  `;
  export const descriptionContainer = css`
    width: 100%;
    max-width: 19.75rem;
    padding-top: 1rem;

    color: ${colors.darkGreen};
    line-height: 1.375rem;

    a {
      color: ${colors.blueNeon};
    }

    @media (max-height: 550px) {
      font-size: 0.875rem;
    }
  `;
}
const HelpPage = memo(() => {
  const localeCode = useLocaleCode();

  return (
    <ScrollableContent>
      <div css={styles.helpContentContainer}>
        <BeepassPoweredByOutlineLogoSvg css={logoPage} />

        <div css={styles.descriptionContainer}>
          <FormattedMessage
            htmlString
            messageKey="HelpPage.helpCopy"
            messageParams={{
              beepassEmail: "mailto:support@beepassvpn.com",
              beepassUrl: `https://beepassvpn.com/${localeCode}/`,
              telegramUrl: "https://t.me/beepassvpn_hd_bot",
            }}
          />
        </div>
      </div>
    </ScrollableContent>
  );
});

HelpPage.displayName = "HelpPage";

export default HelpPage;
