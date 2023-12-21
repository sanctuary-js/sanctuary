import {deepStrictEqual as eq, throws} from 'assert';
import fs from 'fs';
import module from 'module';
import path from 'path';
import url from 'url';
import vm from 'vm';


suite ('NODE_ENV', () => {

  const __filename = url.fileURLToPath (import.meta.url);
  const __dirname = path.dirname (__filename);

  const source = fs.readFileSync (path.join (__dirname, '..', 'index.js'), 'utf8');

  const {version: $$version} = (
    JSON.parse (
      fs.readFileSync (
        path.join (__dirname, '..', 'node_modules', 'sanctuary-def', 'package.json')
      )
    )
  );

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
    'See https://github.com/sanctuary-js/sanctuary-def/tree/v' + $$version + '#FiniteNumber for information about the FiniteNumber type.',
    '',
  ].join ('\n'));

  test ('typeof process === "undefined"', () => {
    const context = {
      module: {exports: {}},
      require: module.createRequire (import.meta.url),
    };
    vm.runInNewContext (source, context);

    throws (() => { context.module.exports.add ('foo'); }, expected);
  });

  test ('typeof process !== "undefined" && process == null', () => {
    const context = {
      module: {exports: {}},
      process: null,
      require: module.createRequire (import.meta.url),
    };
    vm.runInNewContext (source, context);

    throws (() => { context.module.exports.add ('foo'); }, expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env == null', () => {
    const context = {
      module: {exports: {}},
      process: {},
      require: module.createRequire (import.meta.url),
    };
    vm.runInNewContext (source, context);

    throws (() => { context.module.exports.add ('foo'); }, expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env != null && process.env.NODE_ENV == null', () => {
    const context = {
      module: {exports: {}},
      process: {env: {}},
      require: module.createRequire (import.meta.url),
    };
    vm.runInNewContext (source, context);

    throws (() => { context.module.exports.add ('foo'); }, expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env != null && process.env.NODE_ENV !== "production"', () => {
    const context = {
      module: {exports: {}},
      process: {env: {NODE_ENV: 'XXX'}},
      require: module.createRequire (import.meta.url),
    };
    vm.runInNewContext (source, context);

    throws (() => { context.module.exports.add ('foo'); }, expected);
  });

  test ('typeof process !== "undefined" && process != null && process.env != null && process.env.NODE_ENV === "production"', () => {
    const context = {
      module: {exports: {}},
      process: {env: {NODE_ENV: 'production'}},
      require: module.createRequire (import.meta.url),
    };
    vm.runInNewContext (source, context);

    eq (context.module.exports.add ('foo') ('bar'), 'foobar');
  });

});
