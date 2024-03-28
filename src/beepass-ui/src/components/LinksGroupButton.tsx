import { css } from "@emotion/react";
import { IconButton } from "@mui/material";
import { memo } from "react";

import ColorEmailSvg from "src/components/icons/ColorEmailSvg";
import ColorTelegramSvg from "src/components/icons/ColorTelegramSvg";
import { useStrings } from "src/stores/appStore";
import colors from "src/style/colors";

export type LinksGroupButtonStrings = {
  emailLink: string;
  emailLinkLabel: string;
  telegramLink: string;
  telegramLinkLabel: string;
};

const groupButton = css`
  display: flex;
  gap: 3.75rem;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const getServerButton = css`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 5rem;
  height: 5rem;

  color: ${colors.blueNeon};
`;

const getServerButtonIcon = css`
  width: auto;
  height: 1.75rem;
`;

const getServerButtonText = css`
  font-size: 0.875rem;
  line-height: 1.4;
`;

const LinksGroupButton = memo(() => {
  const { LinksGroupButton: strings } = useStrings();

  return (
    <div css={groupButton}>
      <IconButton
        css={getServerButton}
        target="_blank"
        href={strings.telegramLink}
      >
        <ColorTelegramSvg css={getServerButtonIcon} />
        <div css={getServerButtonText}>{strings.telegramLinkLabel}</div>
      </IconButton>
      <IconButton css={getServerButton} href={strings.emailLink}>
        <ColorEmailSvg css={getServerButtonIcon} />
        <div css={getServerButtonText}>{strings.emailLinkLabel}</div>
      </IconButton>
    </div>
  );
});

LinksGroupButton.displayName = "LinksGroupButton";

export default LinksGroupButton;
