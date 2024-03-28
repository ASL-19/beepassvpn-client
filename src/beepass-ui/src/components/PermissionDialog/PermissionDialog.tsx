import { css } from "@emotion/react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { DOMAttributes, FunctionComponent, useCallback, useState } from "react";
import { FC, memo, useMemo } from "react";
import { match, P } from "ts-pattern";

import DropdownSvg from "src/components/icons/DropdownSvg";
import ScrollableContent from "src/components/ScrollableContent";
import { useStrings } from "src/stores/appStore";
import colors from "src/style/colors";

export type PermissionDialogContentStrings = {
  contentHtml: string;
  heading: string;
};

export type PermissionDialogStrings = {
  agreeButton: string;
  connectAnywayButton: string;
  readMoreButton: string;
  understandButton: string;
};

export type ButtonGroupType = {
  close: () => void;
  onConfirmButtonClick: () => void;
  permissionDialogSharedStrings: PermissionDialogStrings;
  variant?: "info" | "confirmation";
};

const dialogContentLayout = css({
  display: "flex",
  flexFlow: "column",
  overflow: "hidden",
  rowGap: "1rem",
});

const lineClamp = css({
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: "3",
});

const contentAndReadMoreButtonContainer = css({
  alignItems: "center",
  display: "flex",
  flex: "1 1 auto",
  flexFlow: "column",
  minHeight: 0,
});

const privacyScrollableContent = css({
  minWidth: 0,
  position: "relative",
});

const privacyWrapperLineHeight = "1.25rem";

const privacyWrapper = css([
  {
    color: colors.lightGray,
    display: "flex",
    flexFlow: "column",
    fontSize: "0.8125rem",
    fontWeight: 400,
    lineHeight: privacyWrapperLineHeight,
    rowGap: "1rem",
  },
  {
    li: {
      listStyle: "disc inside !important",
    },
  },
]);

const privacyWrapperCollapsed = css(privacyWrapper, lineClamp, {
  "&:[data-overlayscrollbars-viewport]": lineClamp,
});

const privacyWrapperExpanded = css(privacyWrapper, {
  maxHeight: "17.5rem",
  paddingInlineEnd: "0.5rem",
});

export const shadowbox = css({
  background: `linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 1) 100%
  )`,
  bottom: 0,
  display: "block",
  height: privacyWrapperLineHeight,
  pointerEvents: "none",
  position: "absolute",
  width: "100%",
});

const readMoreButton = css([
  {
    color: colors.blueNeon,
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: "1.25rem",
    textTransform: "none",
  },
  {
    /* TODO: Remove once we implement stylis-plugin-rtl */
    ".MuiButton-endIcon": {
      marginInlineStart: "8px",
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      marginInlineEnd: "-4px",
    },
  },
]);

const PermissionDialog: FC<{
  ButtonGroup: FunctionComponent<ButtonGroupType>;
  close: () => void;
  isOpen: boolean;
  onConfirmButtonClick: () => void;
  permissionDialogContentStrings: PermissionDialogContentStrings;
  variant?: "info" | "confirmation";
}> = memo(
  ({
    ButtonGroup,
    close,
    isOpen,
    onConfirmButtonClick,
    permissionDialogContentStrings,
    variant,
  }) => {
    const { PermissionDialog: sharedStrings } = useStrings();
    const [contentIsExpanded, setContentIsExpanded] = useState(false);

    const onReadMoreButtonClick = useCallback(
      () => setContentIsExpanded(true),
      [],
    );

    const dialogTransitionProps = useMemo<TransitionProps>(
      () => ({
        // Set expanded to false once dialog fully leaves (so user doesn’t see it
        // changing)
        onExited: () => setContentIsExpanded(false),
      }),
      [],
    );

    const contentDangerouslySetInnerHTML = useMemo<
      DOMAttributes<HTMLDivElement>["dangerouslySetInnerHTML"]
    >(
      () => ({ __html: permissionDialogContentStrings.contentHtml }),
      [permissionDialogContentStrings.contentHtml],
    );

    const firstParagraphContent =
      permissionDialogContentStrings.contentHtml.match(
        /^<p>([^<]*)<\/p>/,
      )?.[1] ?? (false as const);

    return (
      <Dialog
        open={isOpen}
        onClose={close}
        TransitionProps={dialogTransitionProps}
      >
        <DialogTitle>{permissionDialogContentStrings.heading}</DialogTitle>
        <DialogContent css={dialogContentLayout}>
          <div css={contentAndReadMoreButtonContainer}>
            <ScrollableContent css={privacyScrollableContent}>
              {match({
                contentIsExpanded,
                firstParagraphContent,
              })
                // In Safari <17 (and maybe other platforms?) line clamping
                // (display: -webkit-box;   -webkit-line-clamp;) is buggy unless
                // applied directly to a text element, so we get the first
                // paragraph’s text and apply the line clamping directly to it.
                .with(
                  {
                    contentIsExpanded: false,
                    firstParagraphContent: P.string,
                  },
                  ({ firstParagraphContent }) => (
                    <p css={privacyWrapperCollapsed}>{firstParagraphContent}</p>
                  ),
                )
                // This shouldn’t ever happen unless we change the
                // PermissionDialog permissionDialogContentStrings prop’s
                // contentHtml text to something malformed.
                .with(
                  {
                    contentIsExpanded: false,
                    firstParagraphContent: false,
                  },
                  () => {
                    console.warn(
                      "PermissionDialog permissionDialogContentStrings prop’s contentHtml is malformed — should contain text wrapped in <p></p>. This may cause rendering issues in macOS and iOS.",
                    );

                    return (
                      <div
                        css={privacyWrapperCollapsed}
                        dangerouslySetInnerHTML={contentDangerouslySetInnerHTML}
                      />
                    );
                  },
                )
                // Expanded state
                .with(
                  {
                    contentIsExpanded: true,
                  },
                  () => (
                    <div
                      css={privacyWrapperExpanded}
                      dangerouslySetInnerHTML={contentDangerouslySetInnerHTML}
                    />
                  ),
                )
                .exhaustive()}

              {!contentIsExpanded && <div css={shadowbox}></div>}
            </ScrollableContent>
            {!contentIsExpanded && (
              <Button
                css={readMoreButton}
                endIcon={<DropdownSvg css={css({ color: colors.blueNeon })} />}
                onClick={onReadMoreButtonClick}
                variant="text"
              >
                {sharedStrings.readMoreButton}
              </Button>
            )}
          </div>

          <ButtonGroup
            onConfirmButtonClick={onConfirmButtonClick}
            close={close}
            variant={variant}
            permissionDialogSharedStrings={sharedStrings}
          />
        </DialogContent>
      </Dialog>
    );
  },
);

PermissionDialog.displayName = "PermissionDialog";

export default PermissionDialog;
