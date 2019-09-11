# ZeParser parser test case

- Path: tests/testcases/tests_related_to_bindings/methods/classes/dupe_args_definitions/complex_args/x005bb_ax005d_bx003dx.md

> :: tests related to bindings : methods : classes : dupe args definitions : complex args
>
> ::> x005bb ax005d bx003dx

## Input

`````js
class o {f([b, a], b=x) {}}
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Method had duplicate params

class o {f([b, a], b=x) {}}
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