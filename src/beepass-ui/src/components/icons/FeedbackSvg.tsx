import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const FeedbackSvg: StylableFC = memo((props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M20 2H4a2 2 0 0 0-1.99 2L2 22l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-7 12h-2v-2h2v2Zm0-4h-2V6h2v4Z" />
  </svg>
));

FeedbackSvg.displayName = "FeedbackSvg";

export default FeedbackSvg;
