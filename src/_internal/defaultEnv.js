
import $ from 'sanctuary-def'
import { $Either } from './Types/$Either'
import { $Maybe } from './Types/$Maybe'
import { TypeRep } from './Types/TypeRep'

//  defaultEnv :: Array Type
export const defaultEnv = $.env.concat([
  $.FiniteNumber,
  $.NonZeroFiniteNumber,
  $Either,
  $.Integer,
  $Maybe,
  $.Pair,
  $.RegexFlags,
  TypeRep,
  $.ValidDate,
  $.ValidNumber
]);
