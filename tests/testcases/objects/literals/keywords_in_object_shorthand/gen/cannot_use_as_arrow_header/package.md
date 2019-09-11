# ZeParser parser autogenerated test case

- From: tests/testcases/objects/literals/keywords_in_object_shorthand/autogen.md
- Path: tests/testcases/objects/literals/keywords_in_object_shorthand/gen/cannot_use_as_arrow_header/package.md

> :: objects : literals : keywords in object shorthand : gen : cannot use as arrow header
>
> ::> package

## Input


`````js
({package}) => x;
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
  loc:{start:{line:1,column:0},end:{line:1,column:17},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:17},source:''},
      expression: {
        type: 'ArrowFunctionExpression',
        loc:{start:{line:1,column:0},end:{line:1,column:16},source:''},
        params: [
          {
            type: 'ObjectPattern',
            loc:{start:{line:1,column:1},end:{line:1,column:10},source:''},
            properties: [
              {
                type: 'Property',
                loc:{start:{line:1,column:2},end:{line:1,column:9},source:''},
                key: {
                  type: 'Identifier',
                  loc:{start:{line:1,column:2},end:{line:1,column:9},source:''},
                  name: 'package'
                },
                kind: 'init',
                method: false,
                computed: false,
                value: {
                  type: 'Identifier',
                  loc:{start:{line:1,column:2},end:{line:1,column:9},source:''},
                  name: 'package'
                },
                shorthand: true
              }
            ]
          }
        ],
        id: null,
        generator: false,
        async: false,
        expression: true,
        body: {
          type: 'Identifier',
          loc:{start:{line:1,column:15},end:{line:1,column:16},source:''},
          name: 'x'
        }
      }
    }
  ]
}

tokens (9x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use this name (package) as a variable name because: Cannot use this reserved word as a variable name in strict mode

({package}) => x;
         ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._