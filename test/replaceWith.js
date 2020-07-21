'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('replaceWith', () => {

  eq (S.show (S.replaceWith)) ('replaceWith :: String -> RegExp -> String -> String');

  eq (S.replaceWith ('x') (/o/) ('<bar>')) ('<bar>');
  eq (S.replaceWith ('x') (/o/) ('<foo>')) ('<fxo>');
  eq (S.replaceWith ('x') (/o/g) ('<bar>')) ('<bar>');
  eq (S.replaceWith ('x') (/o/g) ('<foo>')) ('<fxx>');
  eq (S.replaceWith ('$1') (/(o)/) ('<bar>')) ('<bar>');
  eq (S.replaceWith ('$1') (/(o)/) ('<foo>')) ('<f$1o>');
  eq (S.replaceWith ('$1') (/(o)/g) ('<bar>')) ('<bar>');
  eq (S.replaceWith ('$1') (/(o)/g) ('<foo>')) ('<f$1$1>');

});
