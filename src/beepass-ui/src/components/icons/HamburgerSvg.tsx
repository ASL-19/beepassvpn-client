import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const HamburgerSvg: StylableFC = memo((props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#000"
        fillRule="evenodd"
        d="M3 7.7V5.77h15V7.7H3Zm0 4.8h18v-1.92H3v1.93Zm0 4.82h15v-1.93H3v1.93Z"
        clipRule="evenodd"
      />
    </svg>
  );
});

HamburgerSvg.displayName = "HamburgerSvg";

export default HamburgerSvg;
