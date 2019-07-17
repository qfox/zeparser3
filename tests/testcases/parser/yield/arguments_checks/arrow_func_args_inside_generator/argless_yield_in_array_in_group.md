# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/yield/arguments_checks/arrow_func_args_inside_generator/argless_yield_in_array_in_group.md

> :: yield : arguments checks : arrow func args inside generator
>
> ::> argless yield in array in group

## Input

`````js
function *g(){ (x = [yield]) }
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
  loc:{start:{line:1,col:0},end:{line:1,col:30},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,col:0},end:{line:1,col:30},source:''},
      generator: true,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,col:10},end:{line:1,col:10},source:''},
        name: 'g'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,col:13},end:{line:1,col:30},source:''},
        body: [
          {
            type: 'ExpressionStatement',
            loc:{start:{line:1,col:15},end:{line:1,col:29},source:''},
            expression: {
              type: 'AssignmentExpression',
              loc:{start:{line:1,col:16},end:{line:1,col:27},source:''},
              left: {
                type: 'Identifier',
                loc:{start:{line:1,col:16},end:{line:1,col:18},source:''},
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                loc:{start:{line:1,col:20},end:{line:1,col:27},source:''},
                elements: [
                  {
                    type: 'YieldExpression',
                    loc:{start:{line:1,col:21},end:{line:1,col:26},source:''},
                    delegate: false,
                    argument: null
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (16x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR ASI PUNCTUATOR
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