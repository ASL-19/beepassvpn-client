import { css } from "@emotion/react";

import colors from "src/style/colors";

export const buttonsContainer = css({
  alignItems: "center",
  flexFlow: "column",
  fontSize: "0.875rem",
  gap: "1rem",
});

export const confirmButton = css([
  {
    backgroundColor: colors.yellow,
    color: colors.blackText,
    fontWeight: 500,
    height: "2.25rem",
    lineHeight: "2rem",
    maxWidth: "12rem",
    padding: "0.1rem 2.5rem",
    whiteSpace: "nowrap",
    width: "100%",
  },
  {
    "&:hover": {
      backgroundColor: colors.yellow,
    },
  },
]);

export const cancelButton = css({
  color: colors.lightGray,
  fontWeight: 400,
  lineHeight: "1.25rem",
});
