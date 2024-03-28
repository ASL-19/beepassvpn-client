import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { ComponentProps, memo, ReactNode, useMemo } from "react";

import { useAppOverlayScrollbarsComponent } from "src/stores/appStore";
import { pageMinWidth } from "src/values/layoutValues";

type ScrollableContentProps = {
  children: ReactNode;
};

const container = css`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  min-width: ${pageMinWidth};
  overflow-x: hidden;
  overflow-y: auto;
  /* This may prevent scroll chaining in some webviews */
  overscroll-behavior: contain;
  /* This may enable overflow scroll bounce in some webviews */
  -webkit-overflow-scrolling: touch;

  /* Override macOS globalStyles transform (intended to reduce WebView rendering
  issues, but causes scroll bars to break) */
  transform: none;
`;

const ScrollableContent: StylableFC<ScrollableContentProps> = memo(
  ({ children, className }) => {
    const OverlayScrollbarsDynamic = useAppOverlayScrollbarsComponent();
    const overlayScrollbarsOptions = useMemo<
      ComponentProps<typeof OverlayScrollbarsComponent>["options"]
    >(
      () => ({
        scrollbars: {
          autoHide: "scroll",
        },
      }),
      [],
    );

    if (OverlayScrollbarsDynamic) {
      return (
        <OverlayScrollbarsDynamic
          className={className}
          css={container}
          options={overlayScrollbarsOptions}
        >
          {children}
        </OverlayScrollbarsDynamic>
      );
    } else {
      return (
        <div className={className} css={container}>
          {children}
        </div>
      );
    }
  },
);

ScrollableContent.displayName = "PageLayout";

export default ScrollableContent;
