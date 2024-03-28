/* eslint-disable @typescript-eslint/no-explicit-any */

import { ElectronApi } from "preload";
import { match } from "ts-pattern";

import type { ElectronRendererMethodChannel } from "../../../electron/preload";
import { TunnelStatus } from "../../../www/app/tunnel";
import * as errors from "../../../www/model/errors";

import setTestSafeTimeout from "src/utils/setTestSafeTimeout";

// Via https://www.reddit.com/r/typescript/comments/wv3d5m/comment/ild6f0q/
type PublicOf<T> = { [K in keyof T]: T[K] };

// Since can't mock electron connection event and electron `on` function,
// Mock the whole connection process as sync, onces click on connect button, change
// connection status
export class MockElectronRendererMethodChannel
  implements PublicOf<ElectronRendererMethodChannel>
{
  serverListener: (status: TunnelStatus) => void;

  public readonly send = (channel: string, ...args: Array<unknown>) => {
    console.info(
      `[MockElectronRendererMethodChannel] send ${channel} with: ${JSON.stringify(
        args,
      )}`,
    );

    if (channel === "openLandingPage") {
      window.open("https://beepassvpn.com", "_blank");
    }
  };

  public readonly invoke = (channel: string, ...args: Array<unknown>) => {
    console.info(
      `[MockElectronRendererMethodChannel] invoke ${channel} with: ${JSON.stringify(
        args,
        null,
        2,
      )}`,
    );

    return (
      match(channel)
        .with(
          "is-server-reachable",
          () =>
            new Promise((resolve) =>
              setTestSafeTimeout(() => resolve(true), 500),
            ),
        )
        // .with("is-server-reachable", () => Promise.resolve(true))
        .with(
          "start-proxying",
          () =>
            new Promise((resolve) =>
              setTestSafeTimeout(() => {
                // setTimeout(() => {
                this.serverListener(TunnelStatus.CONNECTED);

                resolve(errors.ErrorCode.NO_ERROR);
              }, 1000),
            ),
        )
        .with("stop-proxying", () => {
          this.serverListener(TunnelStatus.DISCONNECTED);

          return new Promise((resolve) =>
            setTestSafeTimeout(() => {
              this.serverListener(TunnelStatus.CONNECTED);

              resolve(true);
            }, 500),
          );
        })
        .otherwise(() => {
          console.warn(
            `[MockElectronRendererMethodChannel] ${channel} not handled!`,
          );

          return Promise.resolve(true);
        })
    );
  };

  public readonly on = (
    channel: string,
    listener: (e?: any, ...args: Array<unknown>) => void,
  ) => {
    // console.info(`on ${channel}`);

    return match(channel)
      .with(
        "update-download",
        () =>
          new Promise<void>((resolve) =>
            setTestSafeTimeout(() => {
              listener();
              resolve();
            }, 6000),
          ),
      )
      .otherwise(() => {});
  };

  public readonly once = (
    channel: string,
    listener: (e?: any, ...args: Array<unknown>) => void,
  ) => {
    // console.info(`once ${channel}`);

    listener();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public readonly removeAllListener = (channel: string) => {
    // console.info(`remove ${channel} listener`);
  };

  public readonly registerListener = (
    serverListener: (status: TunnelStatus) => void,
  ) => {
    console.info(`[MockElectronRendererMethodChannel] registerListener`);

    this.serverListener = serverListener;
  };
}

const mockElectron: Partial<ElectronApi> = {
  // @ts-expect-error (can’t match private properties, but in
  // MockElectronRendererMethodChannel declaration we check that it conforms to
  // ElectronRendererMethodChannel’s public methods)
  //
  // See https://www.reddit.com/r/typescript/comments/wv3d5m/comment/ild6f0q/
  methodChannel: new MockElectronRendererMethodChannel(),
};

export const electron =
  import.meta.env.VITE_BUILD_TYPE === "electron-mock"
    ? mockElectron
    : window.electron;
