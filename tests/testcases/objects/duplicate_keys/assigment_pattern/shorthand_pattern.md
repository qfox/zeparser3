# ZeParser parser test case

- Path: tests/testcases/objects/duplicate_keys/assigment_pattern/shorthand_pattern.md

> :: objects : duplicate keys : assigment pattern
>
> ::> shorthand pattern
>
> Note: duplicate keys are NOT a syntax error for assignment patterns (pfew)

## Input

`````js
({x, x} = obj)
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
  loc:{start:{line:1,column:0},end:{line:1,column:14},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:14},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,column:1},end:{line:1,column:13},source:''},
        left: {
          type: 'ObjectPattern',
          loc:{start:{line:1,column:1},end:{line:1,column:7},source:''},
          properties: [
            {
              type: 'Property',
              loc:{start:{line:1,column:2},end:{line:1,column:3},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,column:2},end:{line:1,column:3},source:''},
                name: 'x'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'Identifier',
                loc:{start:{line:1,column:2},end:{line:1,column:3},source:''},
                name: 'x'
              },
              shorthand: true
            },
            {
              type: 'Property',
              loc:{start:{line:1,column:5},end:{line:1,column:6},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,column:5},end:{line:1,column:6},source:''},
                name: 'x'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'Identifier',
                loc:{start:{line:1,column:5},end:{line:1,column:6},source:''},
                name: 'x'
              },
              shorthand: true
            }
          ]
        },
        operator: '=',
        right: {
          type: 'Identifier',
          loc:{start:{line:1,column:10},end:{line:1,column:13},source:''},
          name: 'obj'
        }
      }
    }
  ]
}

tokens (11x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR ASI
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