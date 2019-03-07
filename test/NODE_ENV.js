'use strict';

const fs = require ('fs');
const path = require ('path');
const vm = require ('vm');

const $$version = (require ('sanctuary-def/package.json')).version;

const eq = require ('./internal/eq');
const throws = require ('./internal/throws');


suite ('NODE_ENV', () => {

  const source = fs.readFileSync (path.join (__dirname, '..', 'index.js'), 'utf8');

  const expected = new TypeError ([
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
    '',
  ].join ('\n'));

  test ('typeof process === "undefined"', () => {
    const context = {
      module: {exports: {}},
      require: require,
    };
    vm.runInNewContext (source, context);

    throws (() => { context.module.exports.add ('foo'); }) (expected);
  });

  test ('typeof process !== "undefined" && process == null', () => {
    const context = {
      module: {exports: {}},
      process: null,
      require: require,
    };
    vm.runInNewContext (source, context);

    throws (() => { context.module.exports.add ('foo'); }) (expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env == null', () => {
    const context = {
      module: {exports: {}},
      process: {},
      require: require,
    };
    vm.runInNewContext (source, context);

    throws (() => { context.module.exports.add ('foo'); }) (expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env != null && process.env.NODE_ENV == null', () => {
    const context = {
      module: {exports: {}},
      process: {env: {}},
      require: require,
    };
    vm.runInNewContext (source, context);

    throws (() => { context.module.exports.add ('foo'); }) (expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env != null && process.env.NODE_ENV !== "production"', () => {
    const context = {
      module: {exports: {}},
      process: {env: {NODE_ENV: 'XXX'}},
      require: require,
    };
    vm.runInNewContext (source, context);

    throws (() => { context.module.exports.add ('foo'); }) (expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env != null && process.env.NODE_ENV === "production"', () => {
    const context = {
      module: {exports: {}},
      process: {env: {NODE_ENV: 'production'}},
      require: require,
    };
    vm.runInNewContext (source, context);

    eq (context.module.exports.add ('foo') ('bar')) ('foobar');
  });

});
