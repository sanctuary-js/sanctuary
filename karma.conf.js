'use strict';

//  depMain :: String -> String
function depMain(name) {
  var pkg = require(name + '/package.json');
  var main = 'main' in pkg ? pkg.main : 'index.js';
  return './node_modules/' + name + '/' + main;
}

//  getDeps :: String -> StrMap String String
function getDeps(path) {
  return Object.keys(require(path)).dependencies;
}

//  dependencies :: Array String
var dependencies = getDeps('./package.json')
      .map(function(x) {
        return [x, getDeps('./node_modules/' + x + '}/package.json')];
      })
      .sort(function(a, b) { return a[1].indexOf(b[0]) === -1 ? -1 : 1; })
      .sort(function(b, a) { return a[1].indexOf(b[0]) === -1 ? 1 : -1; })
      .map(function(x) { return x[0]; });

//  https://saucelabs.com/platforms
var customLaunchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '51'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '47'
  },
  sl_safari_8: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10',
    version: '8'
  },
  sl_safari_10: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.11',
    version: '10'
  },
  sl_ios_safari_8: {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: '8.1'
  },
  sl_ie_9: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2008',
    version: '9'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  }
};

var baseOptions = {

  browserify: {
    configure: function(bundle) {
      bundle.on('prebundle', function() {
        dependencies.forEach(function(name) {
          bundle.require(depMain(name), {expose: name});
        });
      });
    }
  },

  client: {
    mocha: {opts: 'test/mocha.opts'}
  },

  files: dependencies.map(depMain).concat(['index.js', 'test/**/*.js']),

  frameworks: [
    'browserify',
    'mocha'
  ],

  plugins: [
    require('karma-sauce-launcher'),
    require('karma-browserify'),
    require('karma-mocha')
  ],

  preprocessors: {
    'test/**/*.js': ['browserify']
  },

  singleRun: true

};

var remoteOptions = Object.assign({

  browsers: Object.keys(customLaunchers),

  browserDisconnectTimeout: 10000,
  browserDisconnectTolerance: 2,
  browserNoActivityTimeout: 90000,
  captureTimeout: 120000,

  customLaunchers: customLaunchers,

  plugins: [
    require('karma-browserify'),
    require('karma-mocha'),
    require('karma-sauce-launcher')
  ],

  reporters: [
    'dots',
    'saucelabs'
  ],

  sauceLabs: {
    testName: 'Sanctuary',
    project: 'Sanctuary',
    name: 'Sanctuary Test Suite',
    startTunnel: true,
    timeout: 600
  }

}, baseOptions);

module.exports = function(config) {
  process.env.CI === 'true' ?
    config.set(remoteOptions) :
    config.set(baseOptions);
};
