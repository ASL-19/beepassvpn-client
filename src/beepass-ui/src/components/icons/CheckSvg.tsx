import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const CheckSvg: StylableFC = memo((props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      {...props}
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
});

CheckSvg.displayName = "CheckSvg";

export default CheckSvg;
