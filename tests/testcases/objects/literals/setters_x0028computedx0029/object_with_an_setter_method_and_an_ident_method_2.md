# ZeParser parser test case

- Path: tests/testcases/objects/literals/setters_x0028computedx0029/object_with_an_setter_method_and_an_ident_method_2.md

> :: objects : literals : setters x0028computedx0029
>
> ::> object with an setter method and an ident method 2

## Input

`````js
wrap({[foo](){}, set [bar](e){}});
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
  loc:{start:{line:1,column:0},end:{line:1,column:34},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:34},source:''},
      expression: {
        type: 'CallExpression',
        loc:{start:{line:1,column:0},end:{line:1,column:33},source:''},
        callee: {
          type: 'Identifier',
          loc:{start:{line:1,column:0},end:{line:1,column:4},source:''},
          name: 'wrap'
        },
        arguments: [
          {
            type: 'ObjectExpression',
            loc:{start:{line:1,column:5},end:{line:1,column:32},source:''},
            properties: [
              {
                type: 'Property',
                loc:{start:{line:1,column:6},end:{line:1,column:15},source:''},
                key: {
                  type: 'Identifier',
                  loc:{start:{line:1,column:7},end:{line:1,column:10},source:''},
                  name: 'foo'
                },
                kind: 'init',
                method: true,
                computed: true,
                value: {
                  type: 'FunctionExpression',
                  loc:{start:{line:1,column:6},end:{line:1,column:15},source:''},
                  generator: false,
                  async: false,
                  id: null,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    loc:{start:{line:1,column:13},end:{line:1,column:15},source:''},
                    body: []
                  }
                },
                shorthand: false
              },
              {
                type: 'Property',
                loc:{start:{line:1,column:17},end:{line:1,column:31},source:''},
                key: {
                  type: 'Identifier',
                  loc:{start:{line:1,column:22},end:{line:1,column:25},source:''},
                  name: 'bar'
                },
                kind: 'set',
                method: false,
                computed: true,
                value: {
                  type: 'FunctionExpression',
                  loc:{start:{line:1,column:17},end:{line:1,column:31},source:''},
                  generator: false,
                  async: false,
                  id: null,
                  params: [
                    {
                      type: 'Identifier',
                      loc:{start:{line:1,column:27},end:{line:1,column:28},source:''},
                      name: 'e'
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    loc:{start:{line:1,column:29},end:{line:1,column:31},source:''},
                    body: []
                  }
                },
                shorthand: false
              }
            ]
          }
        ]
      }
    }
  ]
}

tokens (24x):
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
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