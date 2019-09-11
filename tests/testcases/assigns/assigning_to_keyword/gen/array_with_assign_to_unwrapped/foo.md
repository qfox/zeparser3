# ZeParser parser autogenerated test case

- From: tests/testcases/assigns/assigning_to_keyword/autogen.md
- Path: tests/testcases/assigns/assigning_to_keyword/gen/array_with_assign_to_unwrapped/foo.md

> :: assigns : assigning to keyword : gen : array with assign to unwrapped
>
> ::> foo

## Input


`````js
async x => foo = 1
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
  loc:{start:{line:1,column:0},end:{line:1,column:18},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:18},source:''},
      expression: {
        type: 'ArrowFunctionExpression',
        loc:{start:{line:1,column:0},end:{line:1,column:18},source:''},
        params: [
          {
            type: 'Identifier',
            loc:{start:{line:1,column:6},end:{line:1,column:7},source:''},
            name: 'x'
          }
        ],
        id: null,
        generator: false,
        async: true,
        expression: true,
        body: {
          type: 'AssignmentExpression',
          loc:{start:{line:1,column:11},end:{line:1,column:18},source:''},
          left: {
            type: 'Identifier',
            loc:{start:{line:1,column:11},end:{line:1,column:14},source:''},
            name: 'foo'
          },
          operator: '=',
          right: {
            type: 'Literal',
            loc:{start:{line:1,column:17},end:{line:1,column:18},source:''},
            value: 1,
            raw: '1'
          }
        }
      }
    }
  ]
}

tokens (8x):
       IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR NUMBER_DEC ASI
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