import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const DropdownSvg: StylableFC = memo((props) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 9.5L12 15.5L18 9.5"
      stroke="currentcolor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

DropdownSvg.displayName = "DropdownSvg";

export default DropdownSvg;
