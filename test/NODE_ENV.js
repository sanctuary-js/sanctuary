'use strict';

var fs = require ('fs');
var path = require ('path');
var vm = require ('vm');

var $$version = (require ('sanctuary-def/package.json')).version;

var eq = require ('./internal/eq');
var throws = require ('./internal/throws');


suite ('NODE_ENV', function() {

  var source = fs.readFileSync (path.join (__dirname, '..', 'index.js'), 'utf8');

  var expected = new TypeError ([
    'Invalid value',
    '',
    'add :: FiniteNumber -> FiniteNumber -> FiniteNumber',
    '       ^^^^^^^^^^^^',
    '            1',
    '',
    '1)  "foo" :: String',
    '',
    'The value at position 1 is not a member of ‘FiniteNumber’.',
    '',
    'See https://github.com/sanctuary-js/sanctuary-def/tree/v' + $$version + '#FiniteNumber for information about the sanctuary-def/FiniteNumber type.',
    ''
  ].join ('\n'));

  test ('typeof process === "undefined"', function() {
    var context = {
      module: {exports: {}},
      require: require
    };
    vm.runInNewContext (source, context);

    throws (function() { context.module.exports.add ('foo'); }) (expected);
  });

  test ('typeof process !== "undefined" && process == null', function() {
    var context = {
      module: {exports: {}},
      process: null,
      require: require
    };
    vm.runInNewContext (source, context);

    throws (function() { context.module.exports.add ('foo'); }) (expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env == null', function() {
    var context = {
      module: {exports: {}},
      process: {},
      require: require
    };
    vm.runInNewContext (source, context);

    throws (function() { context.module.exports.add ('foo'); }) (expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env != null && process.env.NODE_ENV == null', function() {
    var context = {
      module: {exports: {}},
      process: {env: {}},
      require: require
    };
    vm.runInNewContext (source, context);

    throws (function() { context.module.exports.add ('foo'); }) (expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env != null && process.env.NODE_ENV !== "production"', function() {
    var context = {
      module: {exports: {}},
      process: {env: {NODE_ENV: 'XXX'}},
      require: require
    };
    vm.runInNewContext (source, context);

    throws (function() { context.module.exports.add ('foo'); }) (expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env != null && process.env.NODE_ENV === "production"', function() {
    var context = {
      module: {exports: {}},
      process: {env: {NODE_ENV: 'production'}},
      require: require
    };
    vm.runInNewContext (source, context);

    eq (context.module.exports.add ('foo') ('bar')) ('foobar');
  });

});
