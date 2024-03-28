import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const ServersSvg: StylableFC = memo((props) => (
  <svg viewBox="0 0 28 28" {...props}>
    <path d="m8.47 6.13 5.25-2.63 5.25 2.62v5.25L13.72 14l-5.25-2.63V6.13ZM7.58 14l-5.25 2.63v5.25l5.25 2.62 5.25-2.63v-5.25L7.58 14Zm12.84 0-5.25 2.63v5.25l5.25 2.62 5.25-2.63v-5.25L20.42 14Z" />
  </svg>
));

ServersSvg.displayName = "ServersSvg";

export default ServersSvg;
