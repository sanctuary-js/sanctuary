import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import id from 'sanctuary/id';


test ('id', () => {

  eq (S.id === id, true);
  eq (String (S.id), 'id :: Category c => TypeRep c -> c');

  eq (S.id (Function) (42), 42);

});
