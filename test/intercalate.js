'use strict';

var S = require ('..');

var eq = require ('./internal/eq');

test ('intercalate', function() {
  eq (typeof S.intercalate) ('function');
  eq (S.intercalate.length) (1);
  eq (S.show (S.intercalate)) (
    'intercalate :: Monoid b => TypeRep b -> b -> Array b -> b'
  );

  var sep = ' mississippi, ';
  var expects = [
    [
      ['one', 'two', 'three', 'four'],
      'one mississippi, two mississippi, three mississippi, four'
    ],
    [
      ['one'],
      'one'
    ],
    [
      [],
      ''
    ]
  ];

  expects.map (([l, r]) => eq (S.intercalate (String) (sep) (l)) (r));
});
