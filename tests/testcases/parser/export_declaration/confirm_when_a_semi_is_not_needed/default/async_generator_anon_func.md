# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/export_declaration/confirm_when_a_semi_is_not_needed/default/async_generator_anon_func.md

> :: export declaration : confirm when a semi is not needed : default
>
> ::> async generator anon func

## Input

- `skip = true`

`````js
export default async function *(){} foo
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  The `export` keyword can only be used with the module goal

export default async function *(){} foo
^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
ast: {
  type: 'Program',
  loc:{start:{line:1,col:0},end:{line:1,col:39},source:''},
  body: [
    {
      type: 'ExportDefaultDeclaration',
      loc:{start:{line:1,col:0},end:{line:1,col:36},source:''},
      declaration: {
        type: 'FunctionDeclaration',
        loc:{start:{line:1,col:21},end:{line:1,col:36},source:''},
        generator: true,
        async: true,
        id: null,
        params: [],
        body: {
          type: 'BlockStatement',
          loc:{start:{line:1,col:33},end:{line:1,col:36},source:''},
          body: []
        }
      }
    },
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:36},end:{line:1,col:39},source:''},
      expression: {
        type: 'Identifier',
        loc:{start:{line:1,col:36},end:{line:1,col:39},source:''},
        name: 'foo'
      }
    }
  ]
}

tokens (12x):
       IDENT IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR IDENT ASI
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._