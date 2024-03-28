/* eslint-disable @typescript-eslint/consistent-type-definitions */

// copy from outline project

import { Clipboard } from "electron";

import { ElectronRendererMethodChannel } from "../electron/preload";

// This file can be referenced in electron renderer scripts. It defines
// the strongly typed global objects injected by preload.ts

export interface NativeOsApi {
  platform: string;
}

export interface ElectronApi {
  readonly clipboard: Clipboard;
  readonly methodChannel: ElectronRendererMethodChannel;
  readonly os: NativeOsApi;
}

declare global {
  interface Window {
    /**
     * All electron or node features exposed to electron's renderer process.
     */
    electron: ElectronApi;
  }
}
