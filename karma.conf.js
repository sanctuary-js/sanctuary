'use strict';

var S = require ('.');

var eq = require ('./test/internal/eq');


//  depMain :: String -> String
function depMain(name) {
  var pkg = require (name + '/package.json');
  var main = 'main' in pkg ? pkg.main : 'index.js';
  return './node_modules/' + name + '/' + main;
}

//  dependencies :: Array String
var dependencies = [
  'sanctuary-show',
  'sanctuary-type-identifiers',
  'sanctuary-type-classes',
  'sanctuary-def',
  'sanctuary-either',
  'sanctuary-maybe',
  'sanctuary-pair'
];

eq (S.sort (dependencies))
   (S.sort (Object.keys ((require ('./package.json')).dependencies)));

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
  sl_ios_safari_9: {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: '9.3'
  },
  sl_ie_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  }
};

var options = {

  browserDisconnectTimeout: 10000,
  browserDisconnectTolerance: 2,
  browserNoActivityTimeout: 90000,
  captureTimeout: 120000,

  client: {
    mocha: {opts: 'test/mocha.opts'}
  },

  plugins: [
    require ('karma-browserify'),
    require ('karma-mocha'),
    require ('karma-sauce-launcher')
  ],

  frameworks: [
    'browserify',
    'mocha'
  ],

  files: S.concat (S.map (depMain) (dependencies))
                  (['index.js', 'test/**/*.js']),

  exclude: ['test/NODE_ENV.js'],

  preprocessors: {
    'test/**/*.js': ['browserify']
  },

  reporters: [
    'dots',
    'saucelabs'
  ],

  singleRun: true,

  browserify: {
    configure: function(bundle) {
      bundle.on ('prebundle', function() {
        dependencies.forEach (function(name) {
          bundle.require (depMain (name), {expose: name});
        });
      });
    }
  },

  sauceLabs: {
    testName: 'Sanctuary',
    project: 'Sanctuary',
    name: 'Sanctuary Test Suite',
    startTunnel: true,
    timeout: 600
  },

  customLaunchers: customLaunchers,

  browsers: S.keys (customLaunchers)

};

module.exports = function(config) { config.set (options); };
