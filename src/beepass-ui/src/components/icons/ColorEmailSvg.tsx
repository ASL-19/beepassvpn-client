import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const ColorEmailSvg: StylableFC = memo((props) => (
  <svg
    fill="currentcolor"
    viewBox="0 0 34 28"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.66649 0.666626H30.3332C32.1665 0.666626 33.6665 2.16663 33.6665 3.99996V24C33.6665 25.8333 32.1665 27.3333 30.3332 27.3333H3.66649C1.83316 27.3333 0.33316 25.8333 0.33316 24L0.349827 3.99996C0.349827 2.16663 1.83316 0.666626 3.66649 0.666626ZM17.0003 15.6667L30.3337 7.33333V4L17.0003 12.3333L3.66699 4V7.33333L17.0003 15.6667Z"
    />
  </svg>
));

ColorEmailSvg.displayName = "ColorEmailSvg";

export default ColorEmailSvg;
