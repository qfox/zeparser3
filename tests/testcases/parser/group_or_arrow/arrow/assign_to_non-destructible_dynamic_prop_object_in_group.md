# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/parens/arrow/assign_to_non-destructible_dynamic_prop_object_in_group.md

> :: parens : arrow
>
> ::> assign to non-destructible dynamic prop object in group
>
> the dynamic property is destructible

## Input

`````js
({[x]:y} = z);
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
  loc:{start:{line:1,col:0},end:{line:1,col:14},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:14},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,col:1},end:{line:1,col:12},source:''},
        left: {
          type: 'ObjectPattern',
          loc:{start:{line:1,col:1},end:{line:1,col:9},source:''},
          properties: [
            {
              type: 'Property',
              loc:{start:{line:1,col:2},end:{line:1,col:7},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,col:3},end:{line:1,col:4},source:''},
                name: 'x'
              },
              kind: 'init',
              method: false,
              computed: true,
              value: {
                type: 'Identifier',
                loc:{start:{line:1,col:6},end:{line:1,col:7},source:''},
                name: 'y'
              },
              shorthand: false
            }
          ]
        },
        operator: '=',
        right: {
          type: 'Identifier',
          loc:{start:{line:1,col:11},end:{line:1,col:12},source:''},
          name: 'z'
        }
      }
    }
  ]
}

tokens (13x):
       PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
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