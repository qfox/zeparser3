# ZeParser parser autogenerated test case

- From: tests/testcases/regexes/property_escapes/uflag/autogen.md
- Path: tests/testcases/regexes/property_escapes/uflag/gen/Valid_binary_in_character_class/g.md

> :: regexes : property escapes : uflag : gen : Valid binary in character class
>
> ::> g

## Input


`````js
/[\p{Script_Extensions=Connector_Punctuation}]/g;
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Tokenizer error!
    Regex: The `\p` property escape is only legal with a u-flag, or as a webcompat edge case; Regex body had an escape that is only valid with an u-flag, but it had no u-flag

/[\p{Script_Extensions=Connector_Punctuation}]/g;
^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

`````
ast: {
  type: 'Program',
  loc:{start:{line:1,column:0},end:{line:1,column:49},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:49},source:''},
      expression: {
        type: 'Literal',
        loc:{start:{line:1,column:0},end:{line:1,column:48},source:''},
        value: null,
        regex: {
          pattern: '[\\p{Script_Extensions=Connector_Punctuation}]',
          flags: 'g'
        },
        raw: '/[\\p{Script_Extensions=Connector_Punctuation}]/g'
      }
    }
  ]
}

tokens (3x):
       REGEX PUNCTUATOR
`````
