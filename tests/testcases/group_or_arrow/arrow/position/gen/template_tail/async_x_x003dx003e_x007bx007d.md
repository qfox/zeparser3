# ZeParser parser autogenerated test case

- From: tests/testcases/group_or_arrow/arrow/position/autogen.md
- Path: tests/testcases/group_or_arrow/arrow/position/gen/template_tail/async_x_x003dx003e_x007bx007d.md

> :: group or arrow : arrow : position : gen : template tail
>
> ::> async x x003dx003e x007bx007d

## Input


`````js
`a ${async x => {}} b`.length
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
  loc:{start:{line:1,column:0},end:{line:1,column:29},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:29},source:''},
      expression: {
        type: 'MemberExpression',
        loc:{start:{line:1,column:0},end:{line:1,column:29},source:''},
        object: {
          type: 'TemplateLiteral',
          loc:{start:{line:1,column:0},end:{line:1,column:22},source:''},
          expressions: [
            {
              type: 'ArrowFunctionExpression',
              loc:{start:{line:1,column:5},end:{line:1,column:18},source:''},
              params: [
                {
                  type: 'Identifier',
                  loc:{start:{line:1,column:11},end:{line:1,column:12},source:''},
                  name: 'x'
                }
              ],
              id: null,
              generator: false,
              async: true,
              expression: false,
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,column:16},end:{line:1,column:18},source:''},
                body: []
              }
            }
          ],
          quasis: [
            {
              type: 'TemplateElement',
              loc:{start:{line:1,column:1},end:{line:1,column:3},source:''},
              tail: false,
              value: { raw: 'a ', cooked: 'a ' }
            },
            {
              type: 'TemplateElement',
              loc:{start:{line:1,column:19},end:{line:1,column:21},source:''},
              tail: true,
              value: { raw: ' b', cooked: ' b' }
            }
          ]
        },
        property: {
          type: 'Identifier',
          loc:{start:{line:1,column:23},end:{line:1,column:29},source:''},
          name: 'length'
        },
        computed: false
      }
    }
  ]
}

tokens (11x):
       TICK_HEAD IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       TICK_TAIL PUNCTUATOR IDENT ASI
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