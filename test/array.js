import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('array', () => {

  eq (String (S.array), 'array :: b -> (a -> Array a -> b) -> Array a -> b');

  const size = S.array (0) (head => tail => 1 + size (tail));
  eq (size ([]), 0);
  eq (size (['foo']), 1);
  eq (size (['foo', 'bar']), 2);
  eq (size (['foo', 'bar', 'baz']), 3);

  const reverse = S.array ([]) (head => tail => S.append (head) (reverse (tail)));
  eq (reverse ([]), []);
  eq (reverse (['foo']), ['foo']);
  eq (reverse (['foo', 'bar']), ['bar', 'foo']);
  eq (reverse (['foo', 'bar', 'baz']), ['baz', 'bar', 'foo']);

  const tail = S.array (S.Nothing) (S.K (S.Just));
  eq (tail ([]), S.Nothing);
  eq (tail (['foo']), S.Just ([]));
  eq (tail (['foo', 'bar']), S.Just (['bar']));
  eq (tail (['foo', 'bar', 'baz']), S.Just (['bar', 'baz']));

});
