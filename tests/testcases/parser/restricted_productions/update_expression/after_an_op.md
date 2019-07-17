# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/restricted_productions/update_expression/after_an_op.md

> :: restricted productions : update expression
>
> ::> after an op
>
> this may throw off the restricted production check for ++ since the newline is fine here

## Input

`````js
x *
++y
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
  loc:{start:{line:1,col:0},end:{line:2,col:3},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:2,col:3},source:''},
      expression: {
        type: 'BinaryExpression',
        loc:{start:{line:1,col:0},end:{line:2,col:3},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,col:0},end:{line:1,col:2},source:''},
          name: 'x'
        },
        operator: '*',
        right: {
          type: 'UpdateExpression',
          loc:{start:{line:2,col:0},end:{line:2,col:3},source:''},
          operator: '++',
          prefix: true,
          argument: {
            type: 'Identifier',
            loc:{start:{line:2,col:2},end:{line:2,col:3},source:''},
            name: 'y'
          }
        }
      }
    }
  ]
}

tokens (6x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT ASI
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