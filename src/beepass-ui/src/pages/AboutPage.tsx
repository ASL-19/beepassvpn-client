import { css } from "@emotion/react";
import { memo } from "react";

import FormattedMessage from "../components/FormattedMessage";
import ScrollableContent from "../components/ScrollableContent";
import colors from "../style/colors";
import { styles } from "./HelpPage";

import BeepassPoweredByOutlineLogoSvg from "src/components/icons/BeePassPoweredByOutlineLogoSvg";
import { logoPage } from "src/style/logoStyles";

const version = css`
  color: ${colors.lightGray};
  font-size: 12px;

  .versionNumber {
    unicode-bidi: embed;
  }
`;

const AboutPage = memo(() => (
  <ScrollableContent>
    <div css={styles.helpContentContainer}>
      <BeepassPoweredByOutlineLogoSvg css={logoPage} />

      <div css={version}>
        <FormattedMessage
          htmlString
          messageKey="shared.version"
          messageParams={{
            appVersion: `<span class="versionNumber">${
              import.meta.env.VITE_APP_VERSION
            }</span>`,
          }}
        />
      </div>
      <div css={styles.descriptionContainer}>
        <FormattedMessage
          htmlString
          messageKey="AboutPage.aboutBeepass"
          messageParams={{
            beepassUrl: "https://beepassvpn.com",
            jigsawUrl: "https://jigsaw.google.com",
            outlineUrl: "https://github.com/jigsaw-Code/?q=outline",
            shadowsocksUrl: "https://shadowsocks.org",
          }}
        />
      </div>
    </div>
  </ScrollableContent>
));

AboutPage.displayName = "AboutPage";

export default AboutPage;
