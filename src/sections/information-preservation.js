//. ### <span id="section:information-preservation">❑ Information preservation</span>
//.
//. Certain Sanctuary functions preserve more information than their Ramda
//. counterparts. Examples:
//.
//.     |> R.tail ([])                      |> S.tail ([])
//.     []                                  Nothing
//.
//.     |> R.tail (['foo'])                 |> S.tail (['foo'])
//.     []                                  Just ([])
//.
//.     |> R.replace (/^x/) ('') ('abc')    |> S.stripPrefix ('x') ('abc')
//.     'abc'                               Nothing
//.
//.     |> R.replace (/^x/) ('') ('xabc')   |> S.stripPrefix ('x') ('xabc')
//.     'abc'                               Just ('abc')
