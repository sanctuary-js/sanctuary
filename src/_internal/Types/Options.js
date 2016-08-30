
import $ from 'sanctuary-def'

//  Options :: Type
export const Options = $.RecordType({ checkTypes: $.Boolean, env: $.Array($.Any) });
