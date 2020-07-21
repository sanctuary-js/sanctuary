'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('replace', () => {

  eq (S.show (S.replace)) ('replace :: RegExp -> String -> String -> String');

  eq (S.replace (/o/) ('x') ('<foo>')) ('<fxo>');
  eq (S.replace (/o/g) ('x') ('<foo>')) ('<fxx>');
  eq (S.replace (/(foo)(bar)?/) ('-$1-$2-$3-') ('<>')) ('<>');
  eq (S.replace (/(foo)(bar)?/) ('-$1-$2-$3-') ('<foo>')) ('<-foo--$3->');
  eq (S.replace (/(foo)(bar)?/) ('-$1-$2-$3-') ('<foobar>')) ('<-foo-bar-$3->');
  eq (S.replace (/(foo)(bar)?/) ("$$$'$&$`$$") ('<foobar>')) ('<$>foobar<$>');

});
