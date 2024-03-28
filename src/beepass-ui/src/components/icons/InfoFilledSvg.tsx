import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const InfoFilledSvg: StylableFC = memo((props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z" />
  </svg>
));

InfoFilledSvg.displayName = "InfoFilledSvg";

export default InfoFilledSvg;
