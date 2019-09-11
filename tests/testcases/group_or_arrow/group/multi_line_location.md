# ZeParser parser test case

- Path: tests/testcases/group_or_arrow/group/multi_line_location.md

> :: group or arrow : group
>
> ::> multi line location
>
> Regression caused location to be incorrect

## Input

`````js
a = (
  b,
  c
)
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
  loc:{start:{line:1,column:0},end:{line:4,column:1},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:4,column:1},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,column:0},end:{line:4,column:1},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,column:0},end:{line:1,column:1},source:''},
          name: 'a'
        },
        operator: '=',
        right: {
          type: 'SequenceExpression',
          loc:{start:{line:2,column:2},end:{line:3,column:3},source:''},
          expressions: [
            {
              type: 'Identifier',
              loc:{start:{line:2,column:2},end:{line:2,column:3},source:''},
              name: 'b'
            },
            {
              type: 'Identifier',
              loc:{start:{line:3,column:2},end:{line:3,column:3},source:''},
              name: 'c'
            }
          ]
        }
      }
    }
  ]
}

tokens (9x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       ASI
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