import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const HelpSvg: StylableFC = memo((props) => (
  <svg viewBox="0 0 24 25" {...props}>
    <path d="M12 2.03C6.48 2.03 2 6.6 2 12.2c0 5.6 4.48 10.16 10 10.16S22 17.8 22 12.2c0-5.61-4.48-10.17-10-10.17Zm1 17.28h-2v-2.03h2v2.03Zm2.07-7.88-.9.94A3.49 3.49 0 0 0 13 15.24h-2v-.5c0-1.12.45-2.14 1.17-2.88l1.24-1.28A2 2 0 0 0 14 9.15c0-1.12-.9-2.04-2-2.04s-2 .92-2 2.04H8a4.03 4.03 0 0 1 4-4.07c2.2 0 4 1.82 4 4.07 0 .9-.36 1.7-.93 2.28Z" />
  </svg>
));

HelpSvg.displayName = "helpSvg";

export default HelpSvg;
