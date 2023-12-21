import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('id', () => {

  eq (String (S.id), 'id :: Category c => TypeRep c -> c');

  eq (S.id (Function) (42), 42);

});
