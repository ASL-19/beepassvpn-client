import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import { FC, memo } from "react";

import { useAddServerModalContext } from "../hooks/useAddServerModalContext";
import colors from "../style/colors";
import BeepassDisconnectSvg from "./icons/BeepassDisconnectSvg";
import HexaSvg from "./icons/HexaSvg";

import LinksGroupButton from "src/components/LinksGroupButton";
import { useLocaleCode, useStrings } from "src/stores/appStore";

export type EmptyServerStrings = {
  description: string;
  emailLinkLabel: string;
  heading: string;
  installationGuideLink: string;
  serverLinksHeading: string;
  telegramLinkLabel: string;
};

namespace styles {
  export const emptyServerContainer = css`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    min-height: 100%;
  `;

  export const emptyAddSection = css`
    display: flex;
    flex: 1 1 auto;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-bottom: 2rem;
  `;

  export const disconnectSvg = css`
    width: 12.5rem;
    height: 12.5rem;
  `;

  export const mainTextContainer = css`
    display: flex;
    flex-direction: column;
    gap: 0.3125rem;

    line-height: 1.25rem;
    text-align: center;
  `;

  export const heading = css`
    color: ${colors.lightGray};
    font-weight: 600;
    font-size: 0.875rem;
  `;

  export const description = css`
    color: ${colors.lightGray};
    font-size: 0.8125rem;
  `;

  export const buttonStyle = css`
    min-width: 13rem;
    height: 2.5rem;
    margin-top: 2rem;

    background-color: ${colors.yellow} !important;

    color: ${colors.blackText};
    font-weight: 600;
  `;

  export const emptyButtonGroupSection = css`
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    width: 100%;
    padding: 1.25rem 0;

    background-color: ${colors.modalBackgroundGray};
  `;

  export const serverLinksHeading = css`
    color: ${colors.lightGray};
    font-size: 0.875rem;
  `;

  export const serverLink = css`
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    color: ${colors.blueNeon};
  `;

  export const serverLinkIcon = css`
    width: 2.125rem;
    height: fit-content;
  `;

  export const installationGuideLink = css`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    width: 100%;
  `;

  export const installationGuideLinkIcon = css`
    width: 1.25rem;
    height: 1.25rem;
  `;

  export const installationGuideLinkText = css`
    color: ${colors.blueNeon};
    font-size: 0.875rem;
    line-height: 2;
  `;
}

const EmptyServer: FC = memo(() => {
  const { handleAddServerModalOpen } = useAddServerModalContext();
  const { AddServerModal: strings, EmptyServer: emptyServerStrings } =
    useStrings();
  const language = useLocaleCode();

  return (
    <div css={styles.emptyServerContainer}>
      <div css={styles.emptyAddSection}>
        <BeepassDisconnectSvg css={styles.disconnectSvg} />

        <div css={styles.mainTextContainer}>
          <h2 css={styles.heading}>{emptyServerStrings.heading}</h2>

          <p css={styles.description}>{emptyServerStrings.description}</p>

          <a
            css={styles.installationGuideLink}
            href={`https://s3.amazonaws.com/beepassvpn/${language}/index.html#installation-guide`}
          >
            <HexaSvg css={styles.installationGuideLinkIcon} />

            <span css={styles.installationGuideLinkText}>
              {emptyServerStrings.installationGuideLink}
            </span>
          </a>
        </div>

        <Button css={styles.buttonStyle} onClick={handleAddServerModalOpen}>
          {strings.serverAddZeroStateInstructions}
        </Button>
      </div>
      <div css={styles.emptyButtonGroupSection}>
        <p css={styles.serverLinksHeading}>
          {emptyServerStrings.serverLinksHeading}
        </p>
        <LinksGroupButton />
      </div>
    </div>
  );
});

EmptyServer.displayName = "EmptyServer";

export default EmptyServer;
