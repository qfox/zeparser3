# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/objects/destructuring/arr_with_yield.md

> :: objects : destructuring
>
> ::> arr with yield

## Input

`````js
result = [x[yield]] = vals;
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
  loc:{start:{line:1,col:0},end:{line:1,col:27},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:27},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:26},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,col:0},end:{line:1,col:7},source:''},
          name: 'result'
        },
        operator: '=',
        right: {
          type: 'AssignmentExpression',
          loc:{start:{line:1,col:9},end:{line:1,col:26},source:''},
          left: {
            type: 'ArrayPattern',
            loc:{start:{line:1,col:9},end:{line:1,col:20},source:''},
            elements: [
              {
                type: 'MemberExpression',
                loc:{start:{line:1,col:9},end:{line:1,col:18},source:''},
                object: {
                  type: 'Identifier',
                  loc:{start:{line:1,col:10},end:{line:1,col:11},source:''},
                  name: 'x'
                },
                property: {
                  type: 'Identifier',
                  loc:{start:{line:1,col:12},end:{line:1,col:17},source:''},
                  name: 'yield'
                },
                computed: true
              }
            ]
          },
          operator: '=',
          right: {
            type: 'Identifier',
            loc:{start:{line:1,col:22},end:{line:1,col:26},source:''},
            name: 'vals'
          }
        }
      }
    }
  ]
}

tokens (12x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use `yield` outside of generator functions when in strict mode

result = [x[yield]] = vals;
                 ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._