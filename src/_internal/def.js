
import $ from 'sanctuary-def'
import { defaultEnv } from './defaultEnv'

export const def = $.create({ checkTypes: true, env: defaultEnv })
