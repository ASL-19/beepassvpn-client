import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const EmailSvg: StylableFC = memo((props) => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.49963 4H20.4996C21.5996 4 22.4996 4.9 22.4996 6V18C22.4996 19.1 21.5996 20 20.4996 20H4.49963C3.39963 20 2.49963 19.1 2.49963 18L2.50963 6C2.50963 4.9 3.39963 4 4.49963 4ZM12.5 13L20.5 8.00003V6.00003L12.5 11L4.49999 6.00003V8.00003L12.5 13Z"
      fill="black"
    />
  </svg>
));

EmailSvg.displayName = "EmailSvg";

export default EmailSvg;
