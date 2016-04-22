'use strict';

var runCompositionTests = require('./utils').runCompositionTests;
var S = require('..');


describe('B', function() {

  runCompositionTests(S.compose);

});
