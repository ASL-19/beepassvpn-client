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

import fs from 'fs/promises';
import url from 'url';
import path from 'path';
import child_process from 'child_process';
import rmfr from 'rmfr';

import {runWebpack} from '../build/run_webpack.mjs';
// import {getBuildParameters} from '../build/get_build_parameters.mjs';
import {getRootDir} from '../build/get_root_dir.mjs';

import {getBrowserWebpackConfig} from './get_browser_webpack_config.mjs';

/**
 * @description Builds the web UI for use across both electron and cordova.
 *
 * @param {string[]} parameters
 */
export async function main(...parameters) {
  console.info('Building BeePass UI and copying into www...');

  // We need to validate process.env.SENTRY_DSN in the context of the main build
  // process.
  //
  // It’s also validated in beepass-ui’s loadAndValidateEnvironmentVariables but
  // this is after using Vite’s loadEnv in the child process created by
  // child_process.execSync(), which won’t have any effect on this process
  // (where the native builds which consume SENTRY_DSN are run).
  if(parameters.includes("release")){
    try {
      new URL(process.env.SENTRY_DSN);
    } catch (e) {
      console.error(`process.env.SENTRY_DSN (${process.env.SENTRY_DSN}) is not a valid URL!`);
      process.exit(1);
    }
  }

  const buildType = parameters.includes("windows") ? "electron-native" : "cordova-native";

  const npmInstallCommand = process.env.CI ? `npm ci` : `npm install`;

  const uiBuildCommand =
    process.env.BEEPASS_SKIP_UI_BUILD === "true"
      ? `echo 'Skipping UI build since BEEPASS_SKIP_UI_BUILD === "true"'`
      : `VITE_BUILD_TYPE=${buildType} npm run vite-build`;

  await rmfr(path.resolve(getRootDir(), 'www'));

  child_process.execSync(
    `cd src/beepass-ui && ${npmInstallCommand} && ${uiBuildCommand} && cp -a build/. ../../www`,
    { stdio: 'inherit' }
  );

  return;

  // -----------------------------------------
  // --- Jigsaw build (left for reference) ---
  // -----------------------------------------

  /* eslint-disable */
  const webpackPromise = webpackConfig =>
    new Promise((resolve, reject) => {
      webpack(webpackConfig, (error, stats) => {
        if (error || stats.hasErrors()) {
          reject(error || 'Unknown Webpack error.');
        }

        resolve(stats);
      });
    });

    // const {sentryDsn, platform, buildMode, versionName, buildNumber} = getBuildParameters(parameters);

  // write build environment
  await fs.mkdir(path.resolve(getRootDir(), 'www'), {recursive: true});

  if (buildMode === 'release') {
    if (versionName === '0.0.0') {
      throw new TypeError('Release builds require a valid versionName, but it is set to 0.0.0.');
    }

    if (!sentryDsn) {
      throw new TypeError('Release builds require SENTRY_DSN, but it is not defined.');
    }

    /*
      the SENTRY_DSN follows a stardard URL format:
      https://docs.sentry.io/product/sentry-basics/dsn-explainer/#the-parts-of-the-dsn
    */
    try {
      new URL(sentryDsn);
    } catch (e) {
      throw new TypeError(`The sentryDsn ${sentryDsn} is not a valid URL!`);
    }
  }

  await fs.writeFile(
    path.resolve(getRootDir(), 'www', 'environment.json'),
    JSON.stringify({
      SENTRY_DSN: sentryDsn,
      APP_VERSION: versionName,
      APP_BUILD_NUMBER: buildNumber,
    })
  );

  await runWebpack(getBrowserWebpackConfig(platform, buildMode));
  /* eslint-enable */
}

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  await main(...process.argv.slice(2));
}
