'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('replaceBy', () => {

  eq (S.show (S.replaceBy)) ('replaceBy :: (Array (Maybe String) -> String) -> RegExp -> String -> String');

  eq (S.replaceBy (([$1]) => S.maybe ('') (S.toUpper) ($1)) (/(\w)/) ('foo')) ('Foo');
  eq (S.replaceBy (([$1]) => S.maybe ('') (S.toUpper) ($1)) (/(\w)/g) ('foo')) ('FOO');
  eq (S.replaceBy (S.show) (/(foo)(bar)?/) ('<>')) ('<>');
  eq (S.replaceBy (S.show) (/(foo)(bar)?/) ('<foo>')) ('<[Just ("foo"), Nothing]>');
  eq (S.replaceBy (S.show) (/(foo)(bar)?/) ('<foobar>')) ('<[Just ("foo"), Just ("bar")]>');
  eq (S.replaceBy (S.show) (/@(?<username>[-\w]+)/) ('@sanctuary-js')) ('[Just ("sanctuary-js")]');

});
