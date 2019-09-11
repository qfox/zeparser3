# ZeParser parser test case

- Path: tests/testcases/async_keyword/introduced_in_es8/async_asi_ident.md

> :: async keyword : introduced in es8
>
> ::> async asi ident

## Input

- `es = 7`

`````js
async 
 foo
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
ast: {
  type: 'Program',
  loc:{start:{line:1,column:0},end:{line:2,column:4},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:5},source:''},
      expression: {
        type: 'Identifier',
        loc:{start:{line:1,column:0},end:{line:1,column:5},source:''},
        name: 'async'
      }
    },
    {
      type: 'ExpressionStatement',
      loc:{start:{line:2,column:1},end:{line:2,column:4},source:''},
      expression: {
        type: 'Identifier',
        loc:{start:{line:2,column:1},end:{line:2,column:4},source:''},
        name: 'foo'
      }
    }
  ]
}

tokens (5x):
       IDENT ASI IDENT ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._