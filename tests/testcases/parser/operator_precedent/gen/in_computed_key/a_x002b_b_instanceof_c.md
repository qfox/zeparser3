# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/operator_precedent/autogen.md
- Path: zeparser3/tests/testcases/parser/operator_precedent/gen/in_computed_key

> :: test: in computed key
>
> :: case: a + b instanceof c

## Input


`````js
x = {[ a + b instanceof c ]: y}
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
  loc:{start:{line:1,col:0},end:{line:1,col:31},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:31},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:31},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,col:0},end:{line:1,col:2},source:''},
          name: 'x'
        },
        operator: '=',
        right: {
          type: 'ObjectExpression',
          loc:{start:{line:1,col:4},end:{line:1,col:31},source:''},
          properties: [
            {
              type: 'Property',
              loc:{start:{line:1,col:5},end:{line:1,col:30},source:''},
              key: {
                type: 'BinaryExpression',
                loc:{start:{line:1,col:7},end:{line:1,col:26},source:''},
                left: {
                  type: 'BinaryExpression',
                  loc:{start:{line:1,col:7},end:{line:1,col:13},source:''},
                  left: {
                    type: 'Identifier',
                    loc:{start:{line:1,col:7},end:{line:1,col:9},source:''},
                    name: 'a'
                  },
                  operator: '+',
                  right: {
                    type: 'Identifier',
                    loc:{start:{line:1,col:11},end:{line:1,col:13},source:''},
                    name: 'b'
                  }
                },
                operator: 'instanceof',
                right: {
                  type: 'Identifier',
                  loc:{start:{line:1,col:24},end:{line:1,col:26},source:''},
                  name: 'c'
                }
              },
              kind: 'init',
              method: false,
              computed: true,
              value: {
                type: 'Identifier',
                loc:{start:{line:1,col:29},end:{line:1,col:30},source:''},
                name: 'y'
              },
              shorthand: false
            }
          ]
        }
      }
    }
  ]
}

tokens (15x):
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT
       IDENT IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR ASI
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