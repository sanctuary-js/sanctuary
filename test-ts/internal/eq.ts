import * as assert from 'assert';

const Z = require('sanctuary-type-classes');

export default function eq(actual: any, expected: any): void {
  assert.strictEqual(arguments.length, eq.length);
  assert.strictEqual(Z.toString(actual), Z.toString(expected));
  assert.strictEqual(Z.equals(actual, expected), true);
}
