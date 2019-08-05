# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/import_declarations/dynamic_import/autogen.md
- Path: zeparser3/tests/testcases/parser/import_declarations/dynamic_import/gen/Simple_statement_case

> :: test: Simple statement case
>
> :: case: Infinity

## Input

- `es = Infinity`

`````js
import('foo');
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
  loc:{start:{line:1,col:0},end:{line:1,col:14},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:13},source:''},
      expression: {
        type: 'CallExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:13},source:''},
        callee: {
          type: 'Import',
          loc:{start:{line:1,col:0},end:{line:1,col:7},source:''}
        },
        arguments: [
          {
            type: 'Literal',
            loc:{start:{line:1,col:7},end:{line:1,col:7},source:''},
            value: 'foo',
            raw: "'foo'"
          }
        ]
      }
    },
    {
      type: 'EmptyStatement',
      loc:{start:{line:1,col:13},end:{line:1,col:14},source:''}
    }
  ]
}

tokens (6x):
       IDENT PUNCTUATOR STRING_SINGLE PUNCTUATOR PUNCTUATOR
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