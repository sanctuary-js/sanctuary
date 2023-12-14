import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import matchAll from 'sanctuary/matchAll';


test ('matchAll', () => {

  eq (S.matchAll === matchAll, true);
  eq (String (S.matchAll), 'matchAll :: GlobalRegExp -> String -> Array (Array (Maybe String))');

  const pattern = S.regex ('g') ('<(h[1-6])(?: id="([^"]*)")?>([^<]*)</\\1>');

  eq (S.matchAll (pattern) (''), []);

  eq (S.matchAll (pattern) ('<h1>Foo</h1>\n<h2 id="bar">Bar</h2>\n<h2 id="baz">Baz</h2>\n'),
      [[S.Just ('h1'), S.Nothing, S.Just ('Foo')],
       [S.Just ('h2'), S.Just ('bar'), S.Just ('Bar')],
       [S.Just ('h2'), S.Just ('baz'), S.Just ('Baz')]]);

  eq (pattern.lastIndex, 0);

  {
    // `lastIndex` property is respected and preserved
    const pattern = /([0-9])/g;
    eq (pattern.lastIndex, 0);
    pattern.exec ('123');
    eq (pattern.lastIndex, 1);
    eq (S.matchAll (pattern) ('123'), [[S.Just ('2')], [S.Just ('3')]]);
    eq (pattern.lastIndex, 1);
  }

});
