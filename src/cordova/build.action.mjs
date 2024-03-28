// Copyright 2022 The Outline Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import path from 'node:path';
import url from 'url';
import fs from 'node:fs/promises';

import cordovaLib from 'cordova-lib';
const {cordova} = cordovaLib;

import {runAction} from '../build/run_action.mjs';
import {getRootDir} from '../build/get_root_dir.mjs';
import {spawnStream} from '../build/spawn_stream.mjs';
import {getBuildParameters} from '../build/get_build_parameters.mjs';
import {downloadHttpsFile} from '../build/download_file.mjs';

/**
 * @description Builds the parameterized cordova binary (ios, macos, android).
 *
 * @param {string[]} parameters
 */
export async function main(...parameters) {
  const {platform, buildMode, verbose} = getBuildParameters(parameters);

  await runAction('www/build', ...parameters);
  await runAction('cordova/setup', ...parameters);

  if (verbose) {
    cordova.on('verbose', message => console.debug(`[cordova:verbose] ${message}`));
  }

  switch (platform + buildMode) {
    case 'android' + 'debug':
      return androidDebug(verbose);
    case 'android' + 'release':
      if (!process.env.JAVA_HOME) {
        throw new ReferenceError('JAVA_HOME must be defined in the environment to build an Android Release!');
      }

      if (!(process.env.BEEPASS_ANDROID_KEYSTORE && process.env.BEEPASS_ANDROID_KEYALIAS && process.env.BEEPASS_ANDROID_STOREPASS && process.env.BEEPASS_ANDROID_KEYPASS)) {
        throw new ReferenceError(
          "BEEPASS_ANDROID_KEYSTORE, BEEPASS_ANDROID_KEYALIAS, BEEPASS_ANDROID_STOREPASS, and BEEPASS_ANDROID_KEYPASS must be defined in the environment to build an Android Release!"
        );
      }

      return androidRelease(
        process.env.ANDROID_KEY_STORE_PASSWORD,
        process.env.ANDROID_KEY_STORE_CONTENTS,
        process.env.JAVA_HOME,
        verbose
      );
    case 'ios' + 'debug':
    case 'macos' + 'debug':
      return appleDebug(platform);
    case 'ios' + 'release':
    case 'macos' + 'release':
      return appleRelease(platform);
  }
}

async function appleDebug(platform) {
  console.warn(`WARNING: building "${platform}" in [DEBUG] mode. Do not publish this build!!`);

  return spawnStream(
    'xcodebuild',
    'clean',
    '-workspace',
    path.join(getRootDir(), 'src', 'cordova', 'apple', `${platform}.xcworkspace`),
    '-scheme',
    'Outline',
    '-destination',
    platform === 'ios' ? 'generic/platform=iOS' : 'generic/platform=macOS',
    'build',
    '-configuration',
    'Debug',
    'CODE_SIGN_IDENTITY=""',
    'CODE_SIGNING_ALLOWED="NO"'
  );
}

async function appleRelease(platform) {
  return spawnStream(
    'xcodebuild',
    'clean',
    '-workspace',
    path.join(getRootDir(), 'src', 'cordova', 'apple', `${platform}.xcworkspace`),
    '-scheme',
    'Outline',
    '-destination',
    platform === 'ios' ? 'generic/platform=iOS' : 'generic/platform=macOS',
    'archive',
    '-configuration',
    'Release'
  );
}

async function androidDebug(verbose) {
  console.warn(`WARNING: building "android" in [DEBUG] mode. Do not publish this build!!`);

  return cordova.compile({
    verbose,
    platforms: ['android'],
    options: {
      argv: [
        // Path is relative to /platforms/android/.
        // See https://docs.gradle.org/current/userguide/composite_builds.html#command_line_composite
        //'--gradleArg=--include-build=../../src/cordova/android/OutlineAndroidLib',
        verbose ? '--gradleArg=--info' : '--gradleArg=--quiet',
      ],
    },
  });
}

const JAVA_BUNDLETOOL_VERSION = '1.8.2';
const JAVA_BUNDLETOOL_RESOURCE_URL = `https://github.com/google/bundletool/releases/download/1.8.2/bundletool-all-${JAVA_BUNDLETOOL_VERSION}.jar`;

async function androidRelease(ksPassword, ksContents, javaPath, verbose) {
  const androidBuildPath = path.resolve(getRootDir(), 'platforms', 'android');

  // ASL19: Commented out since the keystore is written in CI

  // const keystorePath = path.resolve(androidBuildPath, 'keystore.p12');

  // await fs.writeFile(keystorePath, Buffer.from(ksContents, 'base64'));

  await cordova.compile({
    verbose,
    platforms: ['android'],
    options: {
      release: true,
      argv: [
        // Path is relative to /platforms/android/.
        // See https://docs.gradle.org/current/userguide/composite_builds.html#command_line_composite
        // '--gradleArg=--include-build=../../src/cordova/android/OutlineAndroidLib',
        verbose ? '--gradleArg=--info' : '--gradleArg=--quiet',
        `--keystore=${process.env.BEEPASS_ANDROID_KEYSTORE}`,
        `--alias=${process.env.BEEPASS_ANDROID_KEYALIAS}`,
        `--storePassword=${process.env.BEEPASS_ANDROID_STOREPASS}`,
        `--password=${process.env.BEEPASS_ANDROID_KEYPASS}`,
        '--',
        // ASL19; We disable this argument in favour of the default behavior of
        // building a single universal armv7+arm64 APK
        // (bundle/release/app-release.aab). In the future we should revisit
        // this but it will require some investigation and testing.

        // '--gradleArg=-PcdvBuildMultipleApks=true',
      ],
    },
  });

  const bundletoolPath = path.resolve(androidBuildPath, 'bundletool.jar');
  await downloadHttpsFile(JAVA_BUNDLETOOL_RESOURCE_URL, bundletoolPath);

  const outputPath = path.resolve(androidBuildPath, 'Outline.apks');
  await spawnStream(
    path.resolve(javaPath, 'bin', 'java'),
    '-jar',
    bundletoolPath,
    'build-apks',
    `--bundle=${path.resolve(androidBuildPath, 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab')}`,
    `--output=${outputPath}`,
    '--mode=universal',
    `--ks=${process.env.BEEPASS_ANDROID_KEYSTORE}`,
    `--ks-pass=pass:${process.env.BEEPASS_ANDROID_STOREPASS}`,
    `--ks-key-alias=${process.env.BEEPASS_ANDROID_KEYALIAS}`,
    `--key-pass=pass:${process.env.BEEPASS_ANDROID_KEYPASS}`
  );

  return fs.rename(outputPath, path.resolve(androidBuildPath, 'Outline.zip'));
}

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  await main(...process.argv.slice(2));
}
