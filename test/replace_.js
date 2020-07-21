'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('replace_', () => {

  eq (S.show (S.replace_)) ('replace_ :: RegExp -> (Array (Maybe String) -> String) -> String -> String');

  eq (S.replace_ (/(\w)/) (([$1]) => S.maybe ('') (S.toUpper) ($1)) ('foo')) ('Foo');
  eq (S.replace_ (/(\w)/g) (([$1]) => S.maybe ('') (S.toUpper) ($1)) ('foo')) ('FOO');
  eq (S.replace_ (/(foo)(bar)?/) (S.show) ('<>')) ('<>');
  eq (S.replace_ (/(foo)(bar)?/) (S.show) ('<foo>')) ('<[Just ("foo"), Nothing]>');
  eq (S.replace_ (/(foo)(bar)?/) (S.show) ('<foobar>')) ('<[Just ("foo"), Just ("bar")]>');
  eq (S.replace_ (/@(?<username>[-\w]+)/) (S.show) ('@sanctuary-js')) ('[Just ("sanctuary-js")]');

});
