import { asType } from "@asl-19/js-utils";

import { Server } from "src/stores/appStore";

const serverTestDataById = {
  // TODO: Currently updateCachedServerWithDefaultServer adds a default server
  // even if this is set. Can we fix this?

  // default: asType<Server>({
  //   connectionState: "disconnected",
  //   id: "default",
  //   accessKey: "ssconf://localhost:3000/FAKE_KEY.json",
  //   isDefaultServer: true,
  // }),

  custom1: asType<Server>({
    accessKey:
      "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTp1bmRlZmluZWQ@127.0.0.1:123/#Custom%20Server%201",
    connectionState: "disconnected",
    id: "custom1",
    isDefaultServer: false,
    name: "Custom Server 1",
  }),
  custom2: asType<Server>({
    accessKey:
      "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTp1bmRlZmluZWQ@192.0.2.1:123/#Custom%20Server%202",
    connectionState: "disconnected",
    id: "custom2",
    isDefaultServer: false,
    name: "Custom Server 2",
  }),
  custom3: asType<Server>({
    accessKey:
      "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTp1bmRlZmluZWQ@10.0.0.24:123/#Custom%20Server%203",
    connectionState: "disconnected",
    id: "custom3",
    isDefaultServer: false,
    name: "Custom Server 3",
  }),
};

export default serverTestDataById;
