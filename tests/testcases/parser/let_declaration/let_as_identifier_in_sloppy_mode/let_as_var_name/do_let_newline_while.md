# ZeParser parser test case

- Path: zeparser3/tests/testcases/parser/todo/let_asi_keyword_sloppy.md

> :: todo
>
> ::> let asi keyword sloppy
>
> By fuzzer, zeparser only
>
> The newline after `let` should trigger ASI in sloppy mode and not bind the next ident if that was illegal.
>
> In strict mode this is always an error regardless.
>
> In do-while the sub-statement (in sloppy mode in this case the expression `let`) would require either a newline or an explicit semi-colon.
>
> The newline exists so ASI applies and this should not be an error in sloppy mode.

## Input

`````js
do let 
while(x)
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
  loc:{start:{line:1,col:0},end:{line:2,col:8},source:''},
  body: [
    {
      type: 'DoWhileStatement',
      loc:{start:{line:1,col:0},end:{line:2,col:8},source:''},
      body: {
        type: 'ExpressionStatement',
        loc:{start:{line:1,col:3},end:{line:2,col:0},source:''},
        expression: {
          type: 'Identifier',
          loc:{start:{line:1,col:3},end:{line:2,col:0},source:''},
          name: 'let'
        }
      },
      test: {
        type: 'Identifier',
        loc:{start:{line:2,col:6},end:{line:2,col:7},source:''},
        name: 'x'
      }
    }
  ]
}

tokens (9x):
       IDENT IDENT ASI IDENT PUNCTUATOR IDENT PUNCTUATOR ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  `let` declaration not allowed here and `let` cannot be a regular var or label name in strict mode

do let
while(x)
^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._