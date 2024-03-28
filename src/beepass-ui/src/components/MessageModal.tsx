import { css } from "@emotion/react";
import { memo, useEffect, useRef, useState } from "react";

import colors from "../style/colors";
import FormattedMessage from "./FormattedMessage";

import { useAppDispatch, useMessageInfos } from "src/stores/appStore";
import { notificationHeight } from "src/values/layoutValues";

const animationDuration = 400;

namespace styles {
  export const modalContainer = (open: boolean) => css`
    position: fixed;
    bottom: ${open ? "0rem" : "-6.25rem"};
    z-index: 100;

    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: ${notificationHeight};
    padding: 0.31rem 0.625rem;

    background-color: ${colors.blueNeon};
    opacity: ${open ? 1 : 0};

    color: ${colors.modalGray};
    font-size: 0.75rem;

    transition: all linear ${animationDuration}ms;
  `;
}
// Idea: MessageModal subscribe to error store, if error message exist, open the
// modal, otherwise close modal
const MessageModal = memo(() => {
  const messageKeys = useMessageInfos();
  const appDispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(messageKeys.length > 0);
  const containerRef = useRef<HTMLDivElement>(null);

  // modalVanishInterval: When current drawer is active, if more messages have
  // been dispatched in the same time, should clear previous message immediately
  // (Still setTimeout to 600 ms for drawer close animation). Otherwise drawer
  // should be disappeared in 8s.
  useEffect(() => {
    // set to false to trigger modal open animation
    setDrawerOpen(false);
    let modalVanishInterval: NodeJS.Timeout;
    if (messageKeys.length > 1) {
      modalVanishInterval = setTimeout(() => {
        setDrawerOpen(true);
        appDispatch({
          type: "clean_message",
        });
      }, animationDuration);
    } else {
      setDrawerOpen(messageKeys.length > 0);
      modalVanishInterval = setTimeout(() => {
        appDispatch({
          type: "clean_message",
        });
      }, 8000);
    }
    return () => {
      clearTimeout(modalVanishInterval);
    };
  }, [appDispatch, messageKeys.length]);

  return (
    <div
      css={styles.modalContainer(drawerOpen)}
      ref={containerRef}
      aria-hidden={messageKeys.length <= 0}
      aria-live="polite"
      role="log"
    >
      {messageKeys[0] && (
        <FormattedMessage
          messageKey={messageKeys[0].messageKey}
          messageParams={messageKeys[0].messageParams}
        />
      )}
    </div>
  );
});

MessageModal.displayName = "MessageModal";

export default MessageModal;
