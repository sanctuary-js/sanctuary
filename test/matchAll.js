'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('matchAll', () => {

  eq (S.show (S.matchAll)) ('matchAll :: GlobalRegExp -> String -> Array { groups :: Array (Maybe String), match :: String }');

  const pattern = S.regex ('g') ('<(h[1-6])(?: id="([^"]*)")?>([^<]*)</\\1>');

  eq (S.matchAll (pattern) ('')) ([]);

  eq (S.matchAll (pattern) ('<h1>Foo</h1>\n<h2 id="bar">Bar</h2>\n<h2 id="baz">Baz</h2>\n'))
     ([{match: '<h1>Foo</h1>', groups: [S.Just ('h1'), S.Nothing, S.Just ('Foo')]},
       {match: '<h2 id="bar">Bar</h2>', groups: [S.Just ('h2'), S.Just ('bar'), S.Just ('Bar')]},
       {match: '<h2 id="baz">Baz</h2>', groups: [S.Just ('h2'), S.Just ('baz'), S.Just ('Baz')]}]);

  eq (pattern.lastIndex) (0);

});
