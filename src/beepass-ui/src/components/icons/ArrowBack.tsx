import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const ArrowBack: StylableFC = memo((props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#263238"
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"
      />
    </svg>
  );
});

ArrowBack.displayName = "ArrowBack";

export default ArrowBack;
