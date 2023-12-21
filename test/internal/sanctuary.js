import $ from 'sanctuary-def';

import S from '../../index.js';

import {List} from './List.mjs';
import {Sum} from './Sum.mjs';


//    env :: Array Type
const env = S.env.concat ([
  List.Type ($.Unknown),
  Sum.Type,
]);

export default S.create ({checkTypes: true, env});
