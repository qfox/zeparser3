# ZeParser parser test case

- Path: tests/testcases/await/simplest_await.md

> :: await
>
> ::> simplest await
>
> `await` is parsed as an `AwaitExpression` when the `[Await]` parameter is present. The `[Await]` parameter is present in the following contexts:
>  -  In an `AsyncFunctionBody`.
>  -  In the `FormalParameters` of an `AsyncFunctionDeclaration` and `AsyncFunctionExpression`. `AwaitExpression` in this position is a Syntax error via static semantics.
>
>  When Module is the syntactic goal symbol and the `[Await]` parameter is absent, `await` is parsed as a keyword and will be a Syntax error.
>
>  When Script is the syntactic goal symbol, `await` may be parsed as an identifier when the `[Await]` parameter is absent. This includes the following contexts:
>  -  Anywhere outside of an `AsyncFunctionBody` or `FormalParameters` of an `AsyncFunctionDeclaration` or `AsyncFunctionExpression`.
>  -  In the `BindingIdentifier` of a `FunctionExpression` or `GeneratorExpression`.
>
> Note that `async` can have no line terminator between itself and the next token when it declares a function async

## Input

`````js
async function f(){ await foo; }
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
  loc:{start:{line:1,column:0},end:{line:1,column:32},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:32},source:''},
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
        loc:{start:{line:1,column:18},end:{line:1,column:32},source:''},
        body: [
          {
            type: 'ExpressionStatement',
            loc:{start:{line:1,column:20},end:{line:1,column:30},source:''},
            expression: {
              type: 'AwaitExpression',
              loc:{start:{line:1,column:20},end:{line:1,column:29},source:''},
              argument: {
                type: 'Identifier',
                loc:{start:{line:1,column:26},end:{line:1,column:29},source:''},
                name: 'foo'
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (11x):
       IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT IDENT
       PUNCTUATOR PUNCTUATOR
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