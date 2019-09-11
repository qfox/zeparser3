# ZeParser parser autogenerated test case

- From: tests/testcases/var_statement/binding_generic/reserved_words/autogen.md
- Path: tests/testcases/var_statement/binding_generic/reserved_words/gen/for-in_header/await.md

> :: var statement : binding generic : reserved words : gen : for-in header
>
> ::> await

## Input


`````js
for (var await in y);
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
  loc:{start:{line:1,column:0},end:{line:1,column:21},source:''},
  body: [
    {
      type: 'ForInStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:21},source:''},
      left: {
        type: 'VariableDeclaration',
        loc:{start:{line:1,column:5},end:{line:1,column:14},source:''},
        kind: 'var',
        declarations: [
          {
            type: 'VariableDeclarator',
            loc:{start:{line:1,column:9},end:{line:1,column:14},source:''},
            id: {
              type: 'Identifier',
              loc:{start:{line:1,column:9},end:{line:1,column:14},source:''},
              name: 'await'
            },
            init: null
          }
        ]
      },
      right: {
        type: 'Identifier',
        loc:{start:{line:1,column:18},end:{line:1,column:19},source:''},
        name: 'y'
      },
      body: {
        type: 'EmptyStatement',
        loc:{start:{line:1,column:20},end:{line:1,column:21},source:''}
      }
    }
  ]
}

tokens (9x):
       IDENT PUNCTUATOR IDENT IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
throws: Parser error!
  Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal

for (var await in y);
         ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._