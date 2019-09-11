# ZeParser parser test case

- Path: tests/testcases/classes/piggies_in_classes/await/wrapped_in_async_func/computed_with_arg.md

> :: classes : piggies in classes : await : wrapped in async func
>
> ::> computed with arg

## Input

`````js
async function f() {   class x { [await y](){} }   }
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
  loc:{start:{line:1,column:0},end:{line:1,column:52},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:52},source:''},
      generator: false,
      async: true,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:15},end:{line:1,column:16},source:''},
        name: 'f'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,column:19},end:{line:1,column:52},source:''},
        body: [
          {
            type: 'ClassDeclaration',
            loc:{start:{line:1,column:23},end:{line:1,column:48},source:''},
            id: {
              type: 'Identifier',
              loc:{start:{line:1,column:29},end:{line:1,column:30},source:''},
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              loc:{start:{line:1,column:31},end:{line:1,column:48},source:''},
              body: [
                {
                  type: 'MethodDefinition',
                  loc:{start:{line:1,column:33},end:{line:1,column:46},source:''},
                  key: {
                    type: 'AwaitExpression',
                    loc:{start:{line:1,column:34},end:{line:1,column:41},source:''},
                    argument: {
                      type: 'Identifier',
                      loc:{start:{line:1,column:40},end:{line:1,column:41},source:''},
                      name: 'y'
                    }
                  },
                  static: false,
                  computed: true,
                  kind: 'method',
                  value: {
                    type: 'FunctionExpression',
                    loc:{start:{line:1,column:33},end:{line:1,column:46},source:''},
                    generator: false,
                    async: false,
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      loc:{start:{line:1,column:44},end:{line:1,column:46},source:''},
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}

tokens (20x):
       IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT IDENT
       PUNCTUATOR PUNCTUATOR IDENT IDENT PUNCTUATOR PUNCTUATOR
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