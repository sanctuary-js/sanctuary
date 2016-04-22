'use strict';

var throws = require('assert').throws;

var errorEq = require('./utils').errorEq;
var S = require('..');


describe('Either', function() {

  it('throws if called', function() {
    throws(function() { S.Either(); },
           errorEq(Error, 'Cannot instantiate Either'));
  });

});
