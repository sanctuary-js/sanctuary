
import $ from 'sanctuary-def'
import { defaultEnv as env } from './defaultEnv'

export const def = $.create({ checkTypes: process.env.NODE_ENV !== 'production', env })
