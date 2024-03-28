import { AddServerModalStrings } from "../components/AddServerModal";
import { AutoConnectModalStrings } from "../components/AutoConnectModal";
import { ServerCardStrings } from "../components/serverCard/ServeCard";
import { FeedbackPageStrings } from "../pages/FeedbackPage";

import { EmptyServerStrings } from "src/components/EmptyServer";
import { LinksGroupButtonStrings } from "src/components/LinksGroupButton";
import { HeaderChildPageContentStrings } from "src/components/navigator/HeaderChildPageContent";
import { HeaderMainPageContentStrings } from "src/components/navigator/HeaderMainPageContent";
import { HeaderNavMenuStrings } from "src/components/navigator/HeaderNavMenu";
import { OnboardingLanguageStepStrings } from "src/components/OnboardingPage/OnboardingLanguageStep";
import { OnboardingSlidesStepString } from "src/components/OnboardingPage/OnboardingSlidesStep";
import { PermissionDialogStrings } from "src/components/PermissionDialog/PermissionDialog";
import { MoreIconAndMenuStrings } from "src/components/serverCard/MoreIconAndMenu";

export type Strings = {
  $schema: string;

  AboutPage: {
    aboutBeepass: string;
    aboutPageTitle: string;
  };

  AddServerModal: AddServerModalStrings;

  AutoConnectModal: AutoConnectModalStrings;

  EmptyServer: EmptyServerStrings;

  FeedbackPage: FeedbackPageStrings;

  /**
   * Header content on child pages (About, Help, and Change Language).
   *
   * Contains page title and back button.
   */
  HeaderChildPageContent: HeaderChildPageContentStrings;

  /**
   * Header content for main (Severs) page.
   *
   * Contains menu button, BeePass logo, and add server (+) button.
   */
  HeaderMainPageContent: HeaderMainPageContentStrings;

  /**
   * Header navigation menu (triggered by the menu button).
   */
  HeaderNavMenu: HeaderNavMenuStrings;

  HelpPage: {
    helpCopy: string;
    helpPageTitle: string;
  };

  LanguagePage: {
    languagePageTitle: string;
  };

  LicensesPage: {
    licensesPageTitle: string;
  };

  LinksGroupButton: LinksGroupButtonStrings;

  MoreIconAndMenu: MoreIconAndMenuStrings;

  OnboardingLanguageStep: OnboardingLanguageStepStrings;

  OnboardingSlidesStep: OnboardingSlidesStepString;

  PermissionDialog: PermissionDialogStrings;

  PrivacyPage: {
    privacy: string;
    privacyPageTitle: string;
    privacyText: string;
    privacyTitle: string;
  };

  ServerCard: ServerCardStrings;

  ServersPage: {
    serversMenuItem: string;
  };

  TermsPage: {
    terms: string;
    termsCopy: string;
    termsPageTitle: string;
  };

  beepassPluginStrings: {
    beepassPluginErrorAdminPermissions: string;
    beepassPluginErrorAntivirus: string;
    beepassPluginErrorInvalidServerCredentials: string;
    beepassPluginErrorRoutingTables: string;
    beepassPluginErrorServerUnreachable: string;
    beepassPluginErrorSystemConfiguration: string;
    beepassPluginErrorUdpForwardingNotEnabled: string;
    beepassPluginErrorUnsupportedRoutingTable: string;
    beepassPluginErrorVpnPermissionNotGranted: string;
    beepassServicesInstallationConfirmation: string;
    beepassServicesInstallationFailed: string;
    beepassServicesInstalled: string;
    beepassServicesInstalling: string;
    errorFeedbackSubmission: string;
    errorInvalidAccessKey: string;
    errorServerAlreadyAdded: string;
    errorServerIncompatible: string;

    // TODO: this only exist in en.json, maybe a mistake in the old JSON file
    errorShadowsocksUnsupportedCipher: string;

    errorTimeout: string;
    errorUnexpected: string;
    nonSystemVpnWarningDetail: string;
    nonSystemVpnWarningTitle: string;
    outlinePluginErrorAdminPermissions: string;
    outlinePluginErrorAntivirus: string;
    outlinePluginErrorInvalidServerCredentials: string;
    outlinePluginErrorRoutingTables: string;
    outlinePluginErrorServerUnreachable: string;
    outlinePluginErrorSystemConfiguration: string;
    outlinePluginErrorUdpForwardingNotEnabled: string;
    outlinePluginErrorUnsupportedRoutingTable: string;
    outlinePluginErrorVpnPermissionNotGranted: string;
  };

  shared: {
    appTitle: string;
    cancel: string;
    close: string;
    fixThis: string;
    getHelp: string;
    /**
     * Language names (should NOT be translated — e.g. `english` should always
     * be "English")
     */
    languages: {
      english: string;
      persian: string;
    };
    learnMore: string;
    quit: string;
    save: string;
    serverAdded: string;
    serverConnected: string;
    serverDisconnected: string;
    serverForgotten: string;
    serverForgottenUndo: string;
    serverRenameComplete: string;
    undoButtonLabel: string;
    updateDownloaded: string;

    version: string;
  };
};

// Via https://stackoverflow.com/a/47058976/7949868

type Join<T extends Array<string>, D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, Array<string>>, D>}`
    : never
  : string;

type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

export type DotSeparatedStringKey = Join<PathsToStringProps<Strings>, ".">;

export type StringKey = DotSeparatedStringKey | string;
