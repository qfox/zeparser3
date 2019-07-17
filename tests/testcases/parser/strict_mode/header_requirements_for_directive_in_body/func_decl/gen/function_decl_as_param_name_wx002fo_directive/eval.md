# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/strict_mode/header_requirements_for_directive_in_body/func_decl/autogen.md
- Path: zeparser3/tests/testcases/parser/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/function_decl_as_param_name_wx002fo_directive

> :: test: function decl; as param name w/o directive
>
> :: case: eval

## Input


`````js
function c(eval){ }
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
  loc:{start:{line:1,col:0},end:{line:1,col:19},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,col:0},end:{line:1,col:19},source:''},
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,col:9},end:{line:1,col:9},source:''},
        name: 'c'
      },
      params: [
        {
          type: 'Identifier',
          loc:{start:{line:1,col:11},end:{line:1,col:11},source:''},
          name: 'eval'
        }
      ],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,col:16},end:{line:1,col:19},source:''},
        body: []
      }
    }
  ]
}

tokens (8x):
       IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use this name (eval) as a variable name because: Cannot create a binding named `eval` in strict mode

function c(eval){ }
           ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._