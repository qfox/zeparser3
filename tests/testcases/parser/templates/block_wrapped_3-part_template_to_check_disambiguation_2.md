# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/templates/block_wrapped_3-part_template_to_check_disambiguation_2.md

> :: templates
>
> ::> block wrapped 3-part template to check disambiguation 2

## Input

`````js
{`foo ${a} and ${b} and ${`w ${d} x ${e} y ${f} z`} baz`}
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
  loc:{start:{line:1,col:0},end:{line:1,col:57},source:''},
  body: [
    {
      type: 'BlockStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:57},source:''},
      body: [
        {
          type: 'ExpressionStatement',
          loc:{start:{line:1,col:1},end:{line:1,col:56},source:''},
          expression: {
            type: 'TemplateLiteral',
            loc:{start:{line:1,col:1},end:{line:1,col:56},source:''},
            expressions: [
              {
                type: 'Identifier',
                loc:{start:{line:1,col:8},end:{line:1,col:9},source:''},
                name: 'a'
              },
              {
                type: 'Identifier',
                loc:{start:{line:1,col:17},end:{line:1,col:18},source:''},
                name: 'b'
              },
              {
                type: 'TemplateLiteral',
                loc:{start:{line:1,col:26},end:{line:1,col:50},source:''},
                expressions: [
                  {
                    type: 'Identifier',
                    loc:{start:{line:1,col:31},end:{line:1,col:32},source:''},
                    name: 'd'
                  },
                  {
                    type: 'Identifier',
                    loc:{start:{line:1,col:38},end:{line:1,col:39},source:''},
                    name: 'e'
                  },
                  {
                    type: 'Identifier',
                    loc:{start:{line:1,col:45},end:{line:1,col:46},source:''},
                    name: 'f'
                  }
                ],
                quasis: [
                  {
                    type: 'TemplateElement',
                    loc:{start:{line:1,col:26},end:{line:1,col:31},source:''},
                    tail: false,
                    value: { raw: '`w ${', cooked: '<TODO>' }
                  },
                  {
                    type: 'TemplateElement',
                    loc:{start:{line:1,col:32},end:{line:1,col:32},source:''},
                    tail: false,
                    value: { raw: '} x ${', cooked: '<TODO>' }
                  },
                  {
                    type: 'TemplateElement',
                    loc:{start:{line:1,col:39},end:{line:1,col:39},source:''},
                    tail: false,
                    value: { raw: '} y ${', cooked: '<TODO>' }
                  },
                  {
                    type: 'TemplateElement',
                    loc:{start:{line:1,col:46},end:{line:1,col:46},source:''},
                    tail: true,
                    value: { raw: '} z`', cooked: '<TODO>' }
                  }
                ]
              }
            ],
            quasis: [
              {
                type: 'TemplateElement',
                loc:{start:{line:1,col:1},end:{line:1,col:8},source:''},
                tail: false,
                value: { raw: '`foo ${', cooked: '<TODO>' }
              },
              {
                type: 'TemplateElement',
                loc:{start:{line:1,col:9},end:{line:1,col:9},source:''},
                tail: false,
                value: { raw: '} and ${', cooked: '<TODO>' }
              },
              {
                type: 'TemplateElement',
                loc:{start:{line:1,col:18},end:{line:1,col:18},source:''},
                tail: false,
                value: { raw: '} and ${', cooked: '<TODO>' }
              },
              {
                type: 'TemplateElement',
                loc:{start:{line:1,col:50},end:{line:1,col:50},source:''},
                tail: true,
                value: { raw: '} baz`', cooked: '<TODO>' }
              }
            ]
          }
        }
      ]
    }
  ]
}

tokens (17x):
       PUNCTUATOR TICK_HEAD IDENT TICK_BODY IDENT TICK_BODY TICK_HEAD
       IDENT TICK_BODY IDENT TICK_BODY IDENT TICK_TAIL TICK_TAIL ASI
       PUNCTUATOR
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