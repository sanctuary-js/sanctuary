import {joinWith} from '../..';

// $ExpectType string
joinWith(',')(['a', 'b']);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'string[]'.
joinWith(',')(['a', 1]);
