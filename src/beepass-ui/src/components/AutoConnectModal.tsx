import { focusElement } from "@asl-19/js-dom-utils";
import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { Button } from "@mui/material";
import { memo, useEffect, useId, useRef } from "react";

import colors from "../style/colors";

import { useStrings } from "src/stores/appStore";

// TODO
// 1. add tip icon

export type AutoConnectModalStrings = {
  autoConnectDialogDetail: string;
  autoConnectDialogTitle: string;
  gotIt: string;
  tips: string;
};

namespace styles {
  export const modalContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 80px;
    padding: 8px 0 16px;

    background-color: ${colors.blueNeon};

    text-align: center;
  `;
  export const tipsTitle = css`
    padding: 8px 0;

    color: ${colors.tipsGray};
    font-size: 12px;
  `;
  export const detailsDescription = (color: string) => css`
    width: 75%;
    margin: 8px auto;

    color: ${color};
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  `;
  export const modalButton = css`
    color: ${colors.tipsGray};
  `;
}

const AutoConnectModal: StylableFC<{
  onClose: () => void;
}> = memo(({ onClose, ...remainingProps }) => {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const { AutoConnectModal: strings } = useStrings();

  const headingId = useId();
  const hasFocussedSelf = useRef(false);

  // Focus self when first rendered (so screen reader users are aware it’s
  // entered)
  useEffect(() => {
    if (!hasFocussedSelf.current) {
      focusElement(modalContainerRef.current);
      hasFocussedSelf.current = true;
    }
  }, []);

  return (
    <aside
      css={styles.modalContainer}
      ref={modalContainerRef}
      role="log"
      aria-live="polite"
      aria-labelledby={headingId}
      {...remainingProps}
    >
      <div css={styles.tipsTitle}>{strings.tips}</div>
      <h2 css={styles.detailsDescription(colors.highlightGray)} id={headingId}>
        {strings.autoConnectDialogTitle}
      </h2>
      <div css={styles.detailsDescription(colors.tipsGray)}>
        {strings.autoConnectDialogDetail}
      </div>
      <Button css={styles.modalButton} onClick={onClose}>
        {strings.gotIt}
      </Button>
    </aside>
  );
});

AutoConnectModal.displayName = "AutoConnectModal";

export default AutoConnectModal;
