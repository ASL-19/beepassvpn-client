import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const KeySvg: StylableFC = memo((props) => (
  <svg
    width="17"
    height="10"
    viewBox="0 0 17 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.63636 0.5C6.65318 0.5 8.36864 1.7525 9.00227 3.5H17V6.5H15.4545V9.5H12.3636V6.5H9.00227C8.36864 8.2475 6.65318 9.5 4.63636 9.5C2.07864 9.5 0 7.4825 0 5C0 2.5175 2.07864 0.5 4.63636 0.5ZM3 5C3 5.825 3.675 6.5 4.5 6.5C5.325 6.5 6 5.825 6 5C6 4.175 5.325 3.5 4.5 3.5C3.675 3.5 3 4.175 3 5Z"
      fill="#AAAAAA"
    />
  </svg>
));

KeySvg.displayName = "KeySvg";

export default KeySvg;
