import { OperationTimedOut } from "../../../infrastructure/timeout_promise";
import * as errors from "../../../www/model/errors";

import { DotSeparatedStringKey, StringKey } from "src/strings/stringTypes";

// TODO:
// 1. add buttonKey, buttonLink and buttonHandler
export const mapErrorMessageKey = (e?: Error) => {
  let messageKey: DotSeparatedStringKey;
  let messageParams: { [key: string]: StringKey } | undefined;
  // let buttonKey: string;
  // let buttonHandler: () => void;
  // let buttonLink: string;

  // TODO: Use ts-pattern instanceof patterns for this:
  // https://github.com/gvergnaud/ts-pattern#Pinstanceof-patterns
  if (e instanceof errors.VpnPermissionNotGranted) {
    messageKey =
      "beepassPluginStrings.beepassPluginErrorVpnPermissionNotGranted";
  } else if (e instanceof errors.InvalidServerCredentials) {
    messageKey =
      "beepassPluginStrings.beepassPluginErrorInvalidServerCredentials";
  } else if (e instanceof errors.RemoteUdpForwardingDisabled) {
    messageKey =
      "beepassPluginStrings.beepassPluginErrorUdpForwardingNotEnabled";
  } else if (e instanceof errors.ServerUnreachable) {
    messageKey = "beepassPluginStrings.beepassPluginErrorServerUnreachable";
  } else if (e instanceof errors.FeedbackSubmissionError) {
    messageKey = "beepassPluginStrings.errorFeedbackSubmission";
  } else if (e instanceof errors.ServerUrlInvalid) {
    messageKey = "beepassPluginStrings.errorInvalidAccessKey";
  } else if (e instanceof errors.ServerIncompatible) {
    messageKey = "beepassPluginStrings.errorServerIncompatible";
  } else if (e instanceof OperationTimedOut) {
    messageKey = "beepassPluginStrings.errorTimeout";
  } else if (
    e instanceof errors.ShadowsocksStartFailure &&
    !("cordova" in window)
  ) {
    // Fall through to `error-unexpected` for other platforms.
    messageKey = "beepassPluginStrings.beepassPluginErrorAntivirus";
    // buttonKey = 'fix-this';
    // buttonLink = 'https://s3.amazonaws.com/outline-vpn/index.html#/en/support/antivirusBlock';
  } else if (e instanceof errors.ConfigureSystemProxyFailure) {
    messageKey = "beepassPluginStrings.beepassPluginErrorRoutingTables";
    // buttonKey = 'feedback-page-title';
    // buttonHandler = () => {
    //   // TODO: Drop-down has no selected item, why not?
    //   this.rootEl.changePage('feedback');
    // };
  } else if (e instanceof errors.NoAdminPermissions) {
    messageKey = "beepassPluginStrings.beepassPluginErrorAdminPermissions";
  } else if (e instanceof errors.UnsupportedRoutingTable) {
    messageKey =
      "beepassPluginStrings.beepassPluginErrorUnsupportedRoutingTable";
  } else if (e instanceof errors.ReactServerAlreadyAdded) {
    messageKey = "beepassPluginStrings.errorServerAlreadyAdded";

    messageParams = {
      serverName: "serverCardStrings.serverDefaultName",
    };
  } else if (e instanceof errors.SystemConfigurationException) {
    messageKey = "beepassPluginStrings.beepassPluginErrorSystemConfiguration";
  } else if (e instanceof errors.ShadowsocksUnsupportedCipher) {
    messageKey = "beepassPluginStrings.errorShadowsocksUnsupportedCipher";
    messageParams = {
      cipher: e.cipher,
    };
  } else {
    messageKey = "beepassPluginStrings.errorUnexpected";
  }
  return {
    messageKey,
    messageParams,
  };
};
