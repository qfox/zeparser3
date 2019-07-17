# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/const_statement/in_global_lex_rebind_a_var_declared_in_for-header_in_sibling_statement.md

> :: const statement
>
> ::> in global, lex rebind a var declared in for-header in sibling statement
>
> https://tc39.es/ecma262/#sec-scripts-static-semantics-early-errors
>
> > It is a Syntax Error if any element of the LexicallyDeclaredNames of ScriptBody also occurs in the VarDeclaredNames of ScriptBody.
>
> https://tc39.es/ecma262/#sec-module-semantics-static-semantics-early-errors
>
> > It is a Syntax Error if any element of the LexicallyDeclaredNames of ModuleItemList also occurs in the VarDeclaredNames of ModuleItemList.
>
> And basically, the var names of a for-header with `var` decl contribute to the global list so this should be an error.


## Input

`````js
for (var x;;); 
const x = 1
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Attempted to create a lexical binding for `x` but another binding already existed on the same level

for (var x;;);
const x = 1
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