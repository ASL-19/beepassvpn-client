import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const AddSvg: StylableFC = memo((props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 34 34"
      {...props}
    >
      <path
        fill="#F8E241"
        fillRule="evenodd"
        d="M17 1 3 9.08v16.17l14 8.08 14-8.08V9.08L17 1Z"
        clipRule="evenodd"
      />
      <path
        fill="#010101"
        d="M23.3 17.76h-5.27v5.08h-1.76v-5.08H11v-1.69h5.27V11h1.76v5.07h5.28v1.7Z"
      />
    </svg>
  );
});

AddSvg.displayName = "AddSvg";

export default AddSvg;
