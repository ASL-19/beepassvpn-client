// Copyright 2018 The Outline Authors
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

'use strict';

const path = require('path');

const browserify = require('browserify');
const babel = require('gulp-babel');
const babel_preset_env = require('babel-preset-env');
const child_process = require('child_process');
const generateRtlCss = require('./scripts/generate_rtl_css.js');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const polymer_build = require('polymer-build');
const nodeNotifier = require('node-notifier');
const shellJs = require('shelljs');
const source = require('vinyl-source-stream');

//////////////////
//////////////////
//
// Command-line options.
//
//////////////////
//////////////////

const browserName = process.env.BEEPASS_DEV_BROWSER_NAME;
const shouldAutoReload = (process.env.BEEPASS_DEV_SHOULD_AUTO_RELOAD === 'true');
const platform = gutil.env.platform || 'android';
const isRelease = gutil.env.release;

//////////////////
//////////////////
//
// Helper functions.
//
//////////////////
//////////////////

function runCommand(command) {
  const child = child_process.exec(command);
  // Though Gulp 4 handles "ChildProcess as task" elegantly, it does not make it easy to pass the
  // command's output through to the console.
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  return child;
}

//////////////////
//////////////////
//
// Web app tasks.
//
//////////////////
//////////////////

const WEBAPP_OUT = 'www';

function copyPreTranspiledScripts(done) {
  runCommand(`cp -v node_modules/babel-polyfill/dist/polyfill.min.js ${WEBAPP_OUT}/babel-polyfill.min.js`);
  runCommand(`cp -v node_modules/@lottiefiles/lottie-player/dist/lottie-player.js ${WEBAPP_OUT}/lottie-player.js`);

  done();
}

// Bundles code with the entry point www/app/cordova_main.js -> www/cordova_main.js.
//
// Useful Gulp/Browserify examples:
//   https://github.com/gulpjs/gulp/tree/master/docs/recipes
function browserifyAndBabelify() {
  return browserify({entries: `${WEBAPP_OUT}/app/cordova_main.js`, debug: true})
      .transform('babelify', {
        // Transpile code in node_modules, too.
        global: true,
        presets: ['env']
      })
      .bundle()
      // Transform the bundle() output stream into one regular Gulp plugins understand.
      .pipe(source('cordova_main.js'))
      .pipe(gulp.dest(WEBAPP_OUT));
}

// Transpiles to |src| to ES5, copying the output to |dest|.
function transpile(src, dest) {
  const sourcesHtmlSplitter = new polymer_build.HtmlSplitter();
  return gulp.src(src)
      .pipe(sourcesHtmlSplitter.split())
      .pipe(gulpif(/\.js$/, babel({presets: [babel_preset_env.default()]})))
      .pipe(sourcesHtmlSplitter.rejoin())
      .pipe(gulp.dest(dest));
}

// Note: This is currently done "in-place", i.e. the components are downloaded to `WEBAPP_OUT` and
// transpiled there, but this seems to work just fine (idempotent).
function transpileBowerComponents() {
  // Transpile bower_components with the exception of webcomponentsjs, which contains transpiled
  // polyfills, and minified files, which are generally already transpiled.
  const bowerComponentsSrc = [
    `${WEBAPP_OUT}/bower_components/**/*.html`, `${WEBAPP_OUT}/bower_components/**/*.js`,
    `!${WEBAPP_OUT}/bower_components/webcomponentsjs/**/*.js`,
    `!${WEBAPP_OUT}/bower_components/webcomponentsjs/**/*.html`,
    `!${WEBAPP_OUT}/bower_components/**/*.min.js`
  ];
  const bowerComponentsDest = `${WEBAPP_OUT}/bower_components`;
  return transpile(bowerComponentsSrc, bowerComponentsDest);
}

// Transpiling and generating RTL CSS happens sequentially, which means that the output of the first
// step must be the source of the next; otherwise the last step will clobber the previous steps.
// To avoid this, we transpile and generate RTL CSS in-place, with `WEBAPP_OUT` as input and output.
function transpileUiComponents() {
  return transpile([`${WEBAPP_OUT}/ui_components/*.html`], `${WEBAPP_OUT}/ui_components`);
}

function rtlCss() {
  return generateRtlCss(`${WEBAPP_OUT}/ui_components/*.html`, `${WEBAPP_OUT}/ui_components`)
}

function buildWebApp() {
  return runCommand(`yarn do src/www/build`);
}

const transpileWebApp = gulp.series(
    copyPreTranspiledScripts, browserifyAndBabelify, transpileBowerComponents, transpileUiComponents,
    rtlCss);

//////////////////
//////////////////
//
// Cordova tasks.
//
//////////////////
//////////////////

// "platform add" is weird: although "cordova build" will succeed without having run it first,
// *certain things won't behave as you'd expect*, notably cordova-custom-config.
function cordovaPlatformAdd() {
  // "platform add" fails if the platform has already been added.
  return runCommand(`test -d platforms/${platform} || cordova platform add ${platform}`);
}

function cordovaPrepare() {
  return runCommand(`cordova prepare ${platform}`);
}

function xcode() {
  return runCommand(
      (platform === 'ios' || platform === 'osx') ?
          `rsync -avc apple/xcode/${platform}/ platforms/${platform}/` :
          'echo not running on apple, skipping xcode rsync');
}

function cordovaCompile() {
  const platformArgs = platform === 'android' ? '--gradleArg=-PcdvBuildMultipleApks=true' : '';
  // Use flag -UseModernBuildSystem=0 as a workaround for Xcode 10 compatibility until upgrading to
  // cordova-ios@5.0.0. See https://github.com/apache/cordova-ios/issues/404.
  const compileArgs = platform === 'ios' ? '--device --buildFlag="-UseModernBuildSystem=0"' : '';
  const releaseArgs = isRelease ? platform === 'android' ?
                                  `--release -- --keystore="${gutil.env.KEYSTORE}" ` +
              `--storePassword="${gutil.env.STOREPASS}" --alias="${gutil.env.KEYALIAS}" ` +
              `--password="${gutil.env.KEYPASS}"` :
                                  '--release' :
                                  '';
  return runCommand(`cordova compile ${platform} ${compileArgs} ${releaseArgs} -- ${platformArgs}`);
}

const cordovaBuild = gulp.series(cordovaPrepare, xcode, cordovaCompile);
const setupWebApp = gulp.series(buildWebApp, transpileWebApp, writeEnvJson);
const setupCordova = gulp.series(cordovaPlatformAdd, cordovaPrepare, xcode);

//////////////////
//////////////////
//
// All other and
// exported tasks.
//
//////////////////
//////////////////

// Writes a JSON file accessible to environment.ts containing environment variables.
function writeEnvJson() {
  // bash for Windows' (Cygwin’s) benefit (sh can *not* run this script, at least on Alpine).
  return runCommand(`bash scripts/environment_json.sh -p ${platform} ${isRelease ? '-r' : ''} > ${
      WEBAPP_OUT}/environment.json`);
}

exports.build = gulp.series(setupWebApp, setupCordova, cordovaCompile);
exports.setup = gulp.series(setupWebApp, setupCordova);

function notifyAppReady(done) {
  nodeNotifier.notify({
    icon: path.join(__dirname, '../resources/icons/osx/icon-64.png'),
    message: `${platform} app ready`,
    remove: 'ALL',
    title: 'outline-client',
  });

  return done();
}

function reloadAppOrBrowser(done) {
  if (
    platform === 'browser'
    && shouldAutoReload
    && typeof browserName === 'string'
  ) {
    shellJs.exec(`osascript -e 'tell app "${browserName}" to reload active tab of window 1'`);

    return done();
  }

  if (
    platform === 'android'
    && shouldAutoReload
  ) {
    shellJs.exec('yarn install-android-debug');

    return done();
  }

  return done();
}

/**
 * This is a slightly modified version of the transpileUiComponents function. It
 * sources the files from `src/www/ui_components` rather than
 * `www/ui_components`, which is rsynced during the buildWebApp task (in
 * `src/www/build_action.sh`). The buildWebApp task is excluded from our watch
 * tasks to save CPU time.
 */
function transpileUiComponentsWatch() {
  return transpile([`src/www/ui_components/*.html`], `${WEBAPP_OUT}/ui_components`);
}

gulp.task(
  'watch',
  function() {
    gulp.watch(
      [`src/www/ui_components/*.html`],
      gulp.series(
        transpileUiComponentsWatch,
        rtlCss,
        cordovaBuild,
        reloadAppOrBrowser,
        notifyAppReady,
      ),
    );

    gulp.watch(
      [`www/app/*.js`],
      gulp.series(
        copyPreTranspiledScripts,
        browserifyAndBabelify,
        cordovaBuild,
        reloadAppOrBrowser,
        notifyAppReady,
      ),
    );
  }
);
