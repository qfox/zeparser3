# ZeParser parser test case

- Path: tests/testcases/tests_related_to_bindings/block/lex_and_var_in_same_lexical_scope.md

> :: tests related to bindings : block
>
> ::> lex and var in same lexical scope
> 
> https://tc39.github.io/ecma262/#sec-block-duplicates-allowed-static-semantics
> 
> duplicate function decl names do not cause an error in BlockStatement and SwitchStatement


## Input


`````js
let x; var x;
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Found a var binding that is duplicate of a lexical binding on the same or lower statement level

let x; var x;
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