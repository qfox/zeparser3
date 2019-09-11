# ZeParser parser test case

- Path: tests/testcases/mixed_arrayx002fobject_destructuring/inside_must_destruct_outside_cannot_be_arrow.md

> :: mixed arrayx002fobject destructuring
>
> ::> inside must destruct outside cannot be arrow
>
> shorthand prop can only appear in Pattern, rest arg can only be an ident, this tests proper nesting

## Input

`````js
([...{a = b} = c]) => d;
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  The left hand side of the async arrow is not destructible so arrow is illegal

([...{a = b} = c]) => d;
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