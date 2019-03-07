'use strict';

//    curry2 :: ((a, b) -> c) -> a -> b -> c
module.exports = f => x => y => f (x, y);
