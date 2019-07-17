# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/arrays/destructuring/destructuring_an_arrlit_with_property_in_an_array.md

> :: arrays : destructuring
>
> ::> destructuring an arrlit with property in an array

## Input

`````js
[[].x] = y
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
  loc:{start:{line:1,col:0},end:{line:1,col:10},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:10},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:10},source:''},
        left: {
          type: 'ArrayPattern',
          loc:{start:{line:1,col:0},end:{line:1,col:7},source:''},
          elements: [
            {
              type: 'MemberExpression',
              loc:{start:{line:1,col:0},end:{line:1,col:5},source:''},
              object: {
                type: 'ArrayExpression',
                loc:{start:{line:1,col:1},end:{line:1,col:3},source:''},
                elements: []
              },
              property: {
                type: 'Identifier',
                loc:{start:{line:1,col:4},end:{line:1,col:4},source:''},
                name: 'x'
              },
              computed: false
            }
          ]
        },
        operator: '=',
        right: {
          type: 'Identifier',
          loc:{start:{line:1,col:9},end:{line:1,col:10},source:''},
          name: 'y'
        }
      }
    }
  ]
}

tokens (10x):
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR IDENT ASI
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