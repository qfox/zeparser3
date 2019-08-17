# ZeParser parser autogenerated test case

- From: tests/testcases/parser/regexes/property_escapes/esversion/autogen.md
- Path: tests/testcases/parser/regexes/property_escapes/esversion/gen/Char_class_property_escape_without_u-flag

> :: test: Char class property escape without u-flag
>
> :: case: undefined

## Input

- `es = undefined`

`````js
/[\p{Hex}]/u
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
  loc:{start:{line:1,col:0},end:{line:1,col:12},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:12},source:''},
      expression: {
        type: 'Literal',
        loc:{start:{line:1,col:0},end:{line:1,col:12},source:''},
        value: null,
        regex: { pattern: '[\\p{Hex}]', flags: 'u' },
        raw: '/[\\p{Hex}]/u'
      }
    }
  ]
}

tokens (3x):
       REGEXU ASI
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