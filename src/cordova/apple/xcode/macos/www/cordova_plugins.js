cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-clipboard.Clipboard",
      "file": "plugins/cordova-plugin-clipboard/www/clipboard.js",
      "pluginId": "cordova-plugin-clipboard",
      "clobbers": [
        "cordova.plugins.clipboard"
      ]
    },
    {
      "id": "cordova-webintent.WebIntent",
      "file": "plugins/cordova-webintent/www/webintent.js",
      "pluginId": "cordova-webintent",
      "clobbers": [
        "WebIntent"
      ]
    },
    {
      "id": "cordova-plugin-inappbrowser.inappbrowser",
      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      "pluginId": "cordova-plugin-inappbrowser",
      "clobbers": [
        "cordova.InAppBrowser.open"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-custom-config": "5.1.0",
    "cordova-plugin-device": "2.0.3",
    "cordova-plugin-inappbrowser": "5.0.0",
    "cordova-plugin-outline": "0.0.0",
    "cordova-plugin-clipboard": "2.0.0",
    "cordova-webintent": "2.0.0"
  };
});
