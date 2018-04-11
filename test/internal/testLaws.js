'use strict';

module.exports = function testLaws(laws) {
  return function(arbs) {
    (Object.keys (laws)).forEach (function(name) {
      test (name.replace (/[A-Z]/g,
                          function(c) { return ' ' + c.toLowerCase (); }),
            laws[name].apply (laws, arbs[name]));
    });
  };
};
