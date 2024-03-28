# BeePass UI

(This is the documentation for BeePass. You can find some general Outline project documentation [at the root](../../README.md).)

- [General instructions](#general-instructions)
- [Prerequisites](#prerequisites)
  - [Environment variables](#environment-variables)
- [Browser](#browser)
  - [Build and start development server](#build-and-start-development-server)
  - [Build and start production server](#build-and-start-production-server)
  - [Run linters and tests](#run-linters-and-tests)
- [Android](#android)
  - [Prerequisites](#prerequisites-1)
  - [Build and start debug version](#build-and-start-debug-version)
  - [Build and start release version](#build-and-start-release-version)
- [iOS and macOS](#ios-and-macos)
  - [Prerequisites](#prerequisites-2)
  - [Managing Xcode versions](#managing-xcode-versions)
  - [Apple Developer Certificates](#apple-developer-certificates)
  - [Before build app](#before-build-app)
  - [macOS](#macos)
    - [Build debug version](#build-debug-version)
    - [Build release version](#build-release-version)
    - [Managing the system VPN configuration](#managing-the-system-vpn-configuration)
  - [iOS](#ios)
    - [Build debug version](#build-debug-version-1)
    - [Build release version](#build-release-version-1)
    - [Copying DeviceSupport files](#copying-devicesupport-files)
    - [Distributing to the App Store/Mac App Store](#distributing-to-the-app-storemac-app-store)
- [Windows](#windows)
  - [Prerequisites](#prerequisites-3)
  - [Fixing macOS Wine warnings](#fixing-macos-wine-warnings)
  - [Syncing builds to Windows](#syncing-builds-to-windows)
    - [macOS setup](#macos-setup)
    - [Windows setup](#windows-setup)

## General instructions

When developing BeePass you should open the `src/beepass-ui` directory in VS Code and run all scripts from this subdirectory.

There are some BeePass-specific files and file modifications outside of `src/beepass-ui` but we generally try to keep as much of our code as possible in this subdirectory.

If a build isn’t working correctly it can sometimes help to run `npm run clean`, though you generally shouldn’t need to do this as a matter of course (if you do please open an issue!).

## Prerequisites

- Node.js 18.x and NPM 9.x (bundled with Node 18.x) installed and in the shell’s PATH.
- All required [environment variables](#environment-variables) must be set.

### Environment variables

Environment variables are documented in [beepassReactEnv.d.ts](./beepassReactEnv.d.ts).

For local development we recommend copying [`.env.local.template`](./.env.local.template) to `.env.local` and modifying the contents as needed. The content of `.env.local` will be automatically loaded when the site builds.

You can find development environment values in the project wiki.

**Note**: Any variable beginning with `VITE_` is [exposed in front-end JS files][env-vars-vite], so must not include any private passwords, URLs, or keys!

[env-vars-vite]: https://v2.vitejs.dev/guide/env-and-mode.html

## Browser

For development purposes you can run the UI in a web browser with the native networking code mocked (see `src/utils/__mocks__/server.ts`).

This is much more convenient and faster than making a native build (e.g. you can use the browser dev tools and take advantage of React Fast Refresh), but note that the web UI won’t behave the same way as the app running natively, so ultimately new functionality should be tested on real devices. This is because:

1. Native devices may send different/unexpected status events in response to our `window.cordova.exec` calls. In the future we can add mock servers that e.g. fail to connect or time out, but we can’t cover every scenario.

2. Native devices will have different webviews and webview characteristics. e.g. We can test in macOS Safari to have some idea of how it will work in the macOS webview or iOS webview, but it won’t be identical.

3. After updating the native code the native builds processes may fail in ways unrelated to our web builds.

### Build and start development server

```sh
npm install
npm run dev
```

### Build and start production server

```bash
npm install
npm run dev-build-serve
```

### Run linters and tests

```bash
npm install
npm run lint-test
```

## Android

### Prerequisites

In addition to the [shared prerequisites](#prerequisites):

* [Android Studio](https://developer.android.com/studio) (once installed `~/Library/Android/sdk` should exist)
* Gradle 7+ (`brew install gradle`)
* Connected Android device with [developer options enabled](https://developer.android.com/studio/debug/dev-options#enable) and [USB debugging enabled](https://developer.android.com/studio/debug/dev-options#Enable-debugging) (BeePass isn’t compatible with the Android emulator)

Our `dev-android-*` scripts should handle the shell environment and installing the required SDK tools on macOS. If not check the the [Outline Android documentation](../../README.md#building-the-android-app) for instructions on how to do this manually.

If you have any Java configuration (e.g. `JAVA_HOME` or Java-specific `PATH` overrides) in your shell configuration (e.g. `.config/fish/fish.config` or `.zshrc`) you should remove/comment it to avoid conflicts with our auto-loaded environment config (`.env.macos-dev-android`).

### Build and start debug version

This command will build the app, install, and (re)start the app on your connected device:

```sh
npm run dev-android-build-and-start-debug
```

### Build and start release version

To run this you need the `BEEPASS_ANDROID_KEYALIAS`, `BEEPASS_ANDROID_KEYSTORE`, `BEEPASS_ANDROID_KEYPASS`, and `BEEPASS_ANDROID_STOREPASS` environment variables set.

For development purposes you probably don’t need to run this unless you’re in charge of producing release code!

```sh
npm run dev-android-build-and-start-release
```

## iOS and macOS

### Prerequisites

In addition to the [shared prerequisites](#prerequisites):

* [Xcode 14.2+](https://xcodereleases.com) (must be located at `/Applications/Xcode.app`)
* Xcode command line tools (`xcode-select --install`; almost definitely already installed if you’ve done any other development on this machine!)

### Managing Xcode versions

**Currently (2023-02-07) this isn’t necessary!** In the future it will likely be necessary to either hold off on updating Xcode, or keep an older version installed in order to build since Xcode versions are tied to specific Swift versions.

In this scenario, install the latest version of Xcode to `/Applications/Xcode.app`, and rename the older version to e.g. `/Applications/Xcode 14.2.app`. Then to use the older version of Xcode for builds (and as the default app for `.xcodeproj` and `.xcodeworkspace` files) run:

```sh
sudo xcode-select -s "/Applications/Xcode 14.2.app/Contents/Developer"
```

Or to return to using `Xcode.app`:

```sh
sudo xcode-select -s "/Applications/Xcode.app/Contents/Developer"
```

(See `man xcode-select` for more details.)

### Apple Developer Certificates

Running the iOS and macOS apps requires an Apple Development certificate in the “ASL19 Inc.” team. Xcode should automatically generate this if you have your ASL19 Apple Developer account set up in Xcode → Preferences → Accounts.

In the project settings “Signing & Capabilities” section you should see the following for the “Outline” and “VpnExtension” targets:

![](./docs/img/xcode-macos-signing-and-capabilities.png)

### Before build app

It's better to clean up project before you build app, it will prevent you seeing error like `Redefinition of xxx` on Xcode

**Clean up `beepass-ui` project and reinstall by run:**

    npm run clean

    npm install

**Clean up Xcode build:**

   Open Xcode -> Go to top tool bar -> Product -> Clean build folder


### macOS

These commands generate an Xcode project at `outline-client/platforms/osx/Outline.xcodeproj`. You can build and run the app by opening this project in Xcode:

#### Build debug version

To build a debug copy for macOS (OS X), run:

    npm run macos-build-debug

#### Build release version

    npm run macos-build-release

#### Managing the system VPN configuration

You can check the status of the VPN in System Settings → VPN.

When switching between prod/TestFlight and debug builds it may be necessary to remove the configuration by clicking "( i )" → "Remove Configuration…" (because the debug and prod versions are signed differently). The next time you connect to a server the app will prompt you to add the configuration again.

(This process will be different for macOS 12 and earlier.)

### iOS

These commands generate an Xcode project at `outline-client/platforms/ios/Outline.xcodeworkspace`. You can build and run the app by opening this project in Xcode.

#### Build debug version

    npm run ios-build-debug

#### Build release version

    npm run ios-build-release


#### Copying DeviceSupport files

**Currently (2023-02-07) this isn’t necessary!** These instructions are obsolete but left for future reference if we need to build with an [outdated Xcode version](#managing-xcode-versions) again.**

Each version of Xcode has embedded "DeviceSupport" files for each version of iOS. Xcode 13.2.1 doesn’t have DeviceSupport files for iOS versions newer than 15.4, but we can copy these files from a newer version of Xcode:

- Download the latest (bolded) “Release” build of Xcode from https://xcodereleases.com (note: this is a third-party site but the download links are hosted by Apple)
- Extract the build (this takes a long time and uses a lot of CPU power — don’t do it on battery!) to `/Applications/Xcode [version].app`
- Right-click `/Applications/Xcode [version].app`, click “Show Package Contents”, then navigate to `Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport`
- In a separate Finder window right-click `Xcode 13.2.1.app`, click “Show Package Contents”, then navigate to `Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport`
- Copy (don’t move!) the directory corresponding to your installed version of iOS (check in iOS Settings → General → About) from the new version of Xcode’s `Platforms` directory to the Xcode 13.2.1 `Platforms` directory

  - If there is no directory corresponding to your installed version of iOS you may need to copy the most recent version directory then rename it to the major version of iOS you’re running (e.g. if you you’re running 15.6.x but the most recent `DeviceSupport` subdirectory is 15.5, you could try copying the `15.5` then renaming it to `15.6`).

- Restart Xcode 13.2.1

After this Xcode 13.2.1 should be able to communicate with your iPhone.

#### Distributing to the App Store/Mac App Store

1. **Ensure that the app is a release build built with environment variable values appropriate for production! (ask if you’re not sure)**
2. Product → Clean Build Folder (⇧⌘K)
3. Product → Build (⌘B)
4. Product → Archive
5. Click the “Distribute” button, and select “App Store Connect”

## Windows

### Prerequisites

In addition to the [shared prerequisites](#prerequisites):

* Wine (`brew install --cask wine-stable`). If not installed `electron-packager` will output the following error:
  > Error: Wrapper command 'wine64' not found on the system. Run `brew    install --cask wine-stable` to install 64-bit wine on macOS via Homebrew.
  >
  > Wine is required to use the appCopyright, appVersion, buildVersion, icon, and win32metadata parameters for Windows targets.
  >
  > See https://github.com/electron/electron-packager#building-windows-apps-from-non-windows-platforms    for details.

### Fixing macOS Wine warnings

Note that during the first build you may see this macOS security warning:

![](./docs/img/macos-wine-developer-cannot-be-verified-error.png)

When this appears open the System Settings (System Preferences on macOS 12 and earlier) “Privacy & Security” pane then click “Open anyway”:

![](./docs/img/macos-wine-system-settings-open-anyway.png)

Then try to build again, and, click “Open” when the following error appears:

![](./docs/img/macos-wine-cannot-verify-the-developer-error.png)

### Syncing builds to Windows

Rather than develop on Windows, we build in macOS and sync builds to Windows test machines using [Syncthing](https://syncthing.net).

#### macOS setup

Install [`syncthing-macos`](https://github.com/syncthing/syncthing-macos), open the web UI (in the menu bar widget click “Open”), and configure a share for `src/beepass-ui/windows-builds` (not that screenshots show obsolete `beepass-ui/out` directories):

![](docs/img/syncthing-beepass-ui-out-config-general.png)

You should filter out Darwin (macOS) builds so they aren’t unnecessarily synced:

![](docs/img/syncthing-beepass-ui-out-config-ignore-patterns.png)

#### Windows setup

[Download](https://syncthing.net/downloads/) the “64-bit (x86-64)” build, extract it to e.g. your desktop, open `syncthing.exe`, then add the share from the macOS machine.

Once this is done you should see a remote device listed with a “TCP LAN” connection type:

![](docs/img/syncthing-beepass-ui-out-remote-devices.png)

If you don’t see “TCP LAN” Syncthing is probably unable to communicate directly over the network, and is instead using WAN (internet) to sync, which will be dramatically slower. Make sure the two devices are on the same network, and Syncthing isn’t blocked by e.g. the Windows firewall.
