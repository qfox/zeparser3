# ZeParser parser autogenerated test case

- From: tests/testcases/var_statement/binding_generic/reserved_words/autogen.md
- Path: tests/testcases/var_statement/binding_generic/reserved_words/gen/function_object_alias_destructured_arg/private.md

> :: var statement : binding generic : reserved words : gen : function object alias destructured arg
>
> ::> private

## Input


`````js
function fh({x: private}) {}
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
  loc:{start:{line:1,column:0},end:{line:1,column:28},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:28},source:''},
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:9},end:{line:1,column:11},source:''},
        name: 'fh'
      },
      params: [
        {
          type: 'ObjectPattern',
          loc:{start:{line:1,column:12},end:{line:1,column:24},source:''},
          properties: [
            {
              type: 'Property',
              loc:{start:{line:1,column:13},end:{line:1,column:23},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,column:13},end:{line:1,column:14},source:''},
                name: 'x'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'Identifier',
                loc:{start:{line:1,column:16},end:{line:1,column:23},source:''},
                name: 'private'
              },
              shorthand: false
            }
          ]
        }
      ],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,column:26},end:{line:1,column:28},source:''},
        body: []
      }
    }
  ]
}

tokens (12x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Illegal keyword encountered; is not a value [private]

function fh({x: private}) {}
                       ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._