# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/templates/arrow_with_block_body_disambiguation_inside_template.md

> :: templates
>
> ::> arrow with block body disambiguation inside template

## Input

`````js
`a ${(k)=>{x}} b`
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
        type: 'TemplateLiteral',
        loc:{start:{line:1,col:0},end:{line:1,col:17},source:''},
        expressions: [
          {
            type: 'ArrowFunctionExpression',
            loc:{start:{line:1,col:5},end:{line:1,col:13},source:''},
            params: [
              {
                type: 'Identifier',
                loc:{start:{line:1,col:6},end:{line:1,col:7},source:''},
                name: 'k'
              }
            ],
            id: null,
            generator: false,
            async: false,
            expression: false,
            body: {
              type: 'BlockStatement',
              loc:{start:{line:1,col:10},end:{line:1,col:13},source:''},
              body: [
                {
                  type: 'ExpressionStatement',
                  loc:{start:{line:1,col:11},end:{line:1,col:12},source:''},
                  expression: {
                    type: 'Identifier',
                    loc:{start:{line:1,col:11},end:{line:1,col:12},source:''},
                    name: 'x'
                  }
                }
              ]
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
            loc:{start:{line:1,col:13},end:{line:1,col:13},source:''},
            tail: true,
            value: { raw: '} b`', cooked: '<TODO>' }
          }
        ]
      }
    }
  ]
}

tokens (12x):
       TICK_HEAD PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       IDENT ASI PUNCTUATOR TICK_TAIL ASI
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