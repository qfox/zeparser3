# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/templates/function_body_disambiguation_inside_template.md

> :: templates
>
> ::> function body disambiguation inside template

## Input

`````js
`a ${function(){}} b`
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
  loc:{start:{line:1,col:0},end:{line:1,col:21},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:21},source:''},
      expression: {
        type: 'TemplateLiteral',
        loc:{start:{line:1,col:0},end:{line:1,col:21},source:''},
        expressions: [
          {
            type: 'FunctionExpression',
            loc:{start:{line:1,col:5},end:{line:1,col:17},source:''},
            generator: false,
            async: false,
            id: null,
            params: [],
            body: {
              type: 'BlockStatement',
              loc:{start:{line:1,col:15},end:{line:1,col:17},source:''},
              body: []
            }
          }
        ],
        quasis: [
          {
            type: 'TemplateElement',
            loc:{start:{line:1,col:0},end:{line:1,col:5},source:''},
            tail: false,
            value: { raw: '`a ${', cooked: '<TODO>' }
          },
          {
            type: 'TemplateElement',
            loc:{start:{line:1,col:17},end:{line:1,col:17},source:''},
            tail: true,
            value: { raw: '} b`', cooked: '<TODO>' }
          }
        ]
      }
    }
  ]
}

tokens (9x):
       TICK_HEAD IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       TICK_TAIL ASI
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