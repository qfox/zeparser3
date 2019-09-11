# ZeParser parser test case

- Path: tests/testcases/functions/function_args/destructuring/array/ident_with_default_that_is_an_assignment_with_default.md

> :: functions : function args : destructuring : array
>
> ::> ident with default that is an assignment with default

## Input

`````js
function f([a = b = c] = arr){}
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
  loc:{start:{line:1,column:0},end:{line:1,column:31},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:31},source:''},
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:9},end:{line:1,column:10},source:''},
        name: 'f'
      },
      params: [
        {
          type: 'AssignmentPattern',
          loc:{start:{line:1,column:11},end:{line:1,column:28},source:''},
          left: {
            type: 'ArrayPattern',
            loc:{start:{line:1,column:11},end:{line:1,column:22},source:''},
            elements: [
              {
                type: 'AssignmentPattern',
                loc:{start:{line:1,column:12},end:{line:1,column:21},source:''},
                left: {
                  type: 'Identifier',
                  loc:{start:{line:1,column:12},end:{line:1,column:13},source:''},
                  name: 'a'
                },
                right: {
                  type: 'AssignmentExpression',
                  loc:{start:{line:1,column:16},end:{line:1,column:21},source:''},
                  left: {
                    type: 'Identifier',
                    loc:{start:{line:1,column:16},end:{line:1,column:17},source:''},
                    name: 'b'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    loc:{start:{line:1,column:20},end:{line:1,column:21},source:''},
                    name: 'c'
                  }
                }
              }
            ]
          },
          right: {
            type: 'Identifier',
            loc:{start:{line:1,column:25},end:{line:1,column:28},source:''},
            name: 'arr'
          }
        }
      ],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,column:29},end:{line:1,column:31},source:''},
        body: []
      }
    }
  ]
}

tokens (16x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR
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