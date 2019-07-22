# ZeParser parser test case

- Path: zeparser3/tests/testcases/parser/dowhile_statement/dowhile_throw.md

> :: dowhile statement
>
> ::> dowhile throw
>
> By fuzzer reduced


## Input

`````js
do throw function(){};while(y);try{for(;;)if(8)switch(y){default:}}catch{}
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
  loc:{start:{line:1,col:0},end:{line:1,col:74},source:''},
  body: [
    {
      type: 'DoWhileStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:31},source:''},
      body: {
        type: 'ThrowStatement',
        loc:{start:{line:1,col:3},end:{line:1,col:22},source:''},
        argument: {
          type: 'FunctionExpression',
          loc:{start:{line:1,col:9},end:{line:1,col:21},source:''},
          generator: false,
          async: false,
          id: null,
          params: [],
          body: {
            type: 'BlockStatement',
            loc:{start:{line:1,col:19},end:{line:1,col:21},source:''},
            body: []
          }
        }
      },
      test: {
        type: 'Identifier',
        loc:{start:{line:1,col:28},end:{line:1,col:29},source:''},
        name: 'y'
      }
    },
    {
      type: 'TryStatement',
      loc:{start:{line:1,col:31},end:{line:1,col:74},source:''},
      block: {
        type: 'BlockStatement',
        loc:{start:{line:1,col:34},end:{line:1,col:67},source:''},
        body: [
          {
            type: 'ForStatement',
            loc:{start:{line:1,col:35},end:{line:1,col:66},source:''},
            init: null,
            test: null,
            update: null,
            body: {
              type: 'IfStatement',
              loc:{start:{line:1,col:42},end:{line:1,col:66},source:''},
              test: {
                type: 'Literal',
                loc:{start:{line:1,col:45},end:{line:1,col:45},source:''},
                value: 8,
                raw: '8'
              },
              consequent: {
                type: 'SwitchStatement',
                loc:{start:{line:1,col:47},end:{line:1,col:66},source:''},
                discriminant: {
                  type: 'Identifier',
                  loc:{start:{line:1,col:54},end:{line:1,col:55},source:''},
                  name: 'y'
                },
                cases: [
                  {
                    type: 'SwitchCase',
                    loc:{start:{line:1,col:57},end:{line:1,col:65},source:''},
                    test: null,
                    consequent: []
                  }
                ]
              },
              alternate: null
            }
          }
        ]
      },
      handler: {
        type: 'CatchClause',
        loc:{start:{line:1,col:67},end:{line:1,col:74},source:''},
        param: null,
        body: {
          type: 'BlockStatement',
          loc:{start:{line:1,col:72},end:{line:1,col:74},source:''},
          body: []
        }
      },
      finalizer: null
    }
  ]
}

tokens (37x):
       IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR NUMBER_DEC PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR
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