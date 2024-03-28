import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const QuestionSvg: StylableFC = memo((props) => {
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
        fill="#000"
        d="M13.25 14.05a.32.32 0 0 0 .32.33h1.1c.19 0 .33-.15.36-.33.12-.88.72-1.52 1.79-1.52.92 0 1.75.46 1.75 1.56 0 .85-.5 1.24-1.28 1.83-.9.66-1.61 1.42-1.56 2.66v.29a.33.33 0 0 0 .33.32h1.09a.33.33 0 0 0 .33-.33v-.14c0-.96.36-1.24 1.35-1.98.81-.62 1.66-1.3 1.66-2.75 0-2.02-1.7-2.99-3.57-2.99-1.69 0-3.54.79-3.67 3.05Zm2.08 7.7c0 .7.57 1.23 1.35 1.23.8 0 1.37-.52 1.37-1.24 0-.73-.56-1.25-1.37-1.25-.78 0-1.35.52-1.35 1.25Z"
      />
    </svg>
  );
});

QuestionSvg.displayName = "questionSvg";

export default QuestionSvg;
