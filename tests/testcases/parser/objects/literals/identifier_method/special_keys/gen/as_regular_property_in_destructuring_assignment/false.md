# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/objects/literals/identifier_method/special_keys/autogen.md
- Path: zeparser3/tests/testcases/parser/objects/literals/identifier_method/special_keys/gen/as_regular_property_in_destructuring_assignment

> :: test: as regular property in destructuring assignment
>
> :: case: false

## Input


`````js
({false: x} = y);
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
  loc:{start:{line:1,col:0},end:{line:1,col:17},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:17},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,col:1},end:{line:1,col:15},source:''},
        left: {
          type: 'ObjectPattern',
          loc:{start:{line:1,col:1},end:{line:1,col:12},source:''},
          properties: [
            {
              type: 'Property',
              loc:{start:{line:1,col:2},end:{line:1,col:10},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,col:2},end:{line:1,col:9},source:''},
                name: 'false'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'Identifier',
                loc:{start:{line:1,col:9},end:{line:1,col:10},source:''},
                name: 'x'
              },
              shorthand: false
            }
          ]
        },
        operator: '=',
        right: {
          type: 'Identifier',
          loc:{start:{line:1,col:14},end:{line:1,col:15},source:''},
          name: 'y'
        }
      }
    }
  ]
}

tokens (11x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
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