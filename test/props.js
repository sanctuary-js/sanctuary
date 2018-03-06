'use strict';

var S = require ('..');

var eq = require ('./internal/eq');
var throws = require ('./internal/throws');


test ('props', function() {

  eq (typeof S.props) ('function');
  eq (S.props.length) (1);
  eq (String (S.props)) ('props :: Array String -> a -> b');

  throws (function() { S.props (['a', 'b', 'c']) ([1, 2, 3]); })
         (new TypeError ('‘props’ expected object to have a property at ["a", "b", "c"]; [1, 2, 3] does not'));

  eq (S.props (['a', 'b', 'c']) ({a: {b: {c: 1}}})) (1);
  eq (S.props (['a', 'b', 'c', '0']) ({a: {b: {c: [2, 4, 6]}}})) (2);
  eq (S.props (['a', 'b', 'c']) (Object.create ({a: {b: {c: 1}}}))) (1);

  throws (function() { S.props (['valueOf']) (null); })
         (new TypeError ('‘props’ expected object to have a property at ["valueOf"]; null does not'));

  throws (function() { S.props (['valueOf']) (undefined); })
         (new TypeError ('‘props’ expected object to have a property at ["valueOf"]; undefined does not'));

});
