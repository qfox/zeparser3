# ZeParser parser test case

- Path: zeparser3/tests/testcases/parser/regexes/named_capturing_groups/backslash/start_no_uflag/illegal_escape.md

> :: regexes : named capturing groups : backslash : start no uflag
>
> ::> illegal escape
>
> Illegal escape as first char of ident of named capturing group

## FAIL

## Input

`````js
/(?<\a>.)/;
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Tokenizer error!
    Found invalid escape character at the start of a group name identifier

/(?<\a>.)/;
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

_Output same as sloppy mode._