import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_PURE, $TICK_TAIL, $STRING_DOUBLE} from '../../../src/zetokenizer.mjs';

export default (describe, test) =>
  describe('strict mode', _ => {
    /*
    https://tc39.github.io/ecma262/#sec-strict-mode-code

    Global code is strict mode code if it starts with use strict
    Module code is always strict mode code.
    All parts of a ClassDeclaration or a ClassExpression are strict mode code.
    Eval code is strict mode code if
      - it begins with use strict
      - the call to eval is a direct eval that is contained in strict mode code.
    Function code is strict mode code if
      - it's contained in strict mode code
      - it starts with use strict
    Dynamic functions (like Function) with a body that starts with use strict
  */

    // base case: with is not allowed in strict mode

    test('base test; confirm `with` is fine without strict mode', {
      code: '; with (x) y;',
      desc: 'The idea is that strict mode should throw for using `with` but fine in sloppy mode',
      ast: true,
      tokens: true,
      STRICT: {throws: 'strict'},
    });

    test('global directive / module code', {
      code: '"use strict"; with (x) y;',
      throws: 'strict',
    });

    test('inside a class', {
      code: 'class X { foo() { with (x) y; } }',
      throws: 'strict',
    });

    describe('with directive', _ => {
      describe('in global', _ => {
        test('double quoted', {
          code: '"use strict"; with (x) y;',
          throws: 'strict',
        });

        test('single quoted', {
          code: "'use strict'; with (x) y;",
          throws: 'strict',
        });

        test('templates dont count', {
          code: '`use strict`; with (x) y;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      tail: true,
                      value: {raw: '`use strict`', cooked: '<TODO>'},
                    },
                  ],
                },
              },
              {
                type: 'WithStatement',
                object: {type: 'Identifier', name: 'x'},
                body: {
                  type: 'ExpressionStatement',
                  expression: {type: 'Identifier', name: 'y'},
                },
              },
            ],
          },
          tokens: [$TICK_PURE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          STRICT: {throws: 'strict'},
        });

        test('newline after semi', {
          code: '"use strict";\nwith (x) y;',
          throws: 'strict',
        });

        test('newline before semi', {
          code: '"use strict"\n;with (x) y;',
          throws: 'strict',
        });

        test('asi', {
          code: '"use strict"\nwith (x) y;',
          throws: 'strict',
        });

        test('double', {
          code: '"use strict"; "use strict"; with (x) y;',
          throws: 'strict',
        });

        test('mixed double', {
          code: '"use strict"; \'use strict\'; with (x) y;',
          throws: 'strict',
        });

        test('crap first', {
          code: '"not a directive"; "use strict"; with (x) y;',
          throws: 'strict',
        });

        test('newlined first', {
          code: '"haha\\\nstill\\\nfine"; "use strict"; with (x) y;',
          throws: 'strict',
        });

        test('not first', {
          code: 'var x; "use strict"; with (x) y;',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('comments are fine', {
          code: '// one comment\n/* two \n comment */ "use strict"; with (x) y;',
          throws: 'strict',
        });
      });

      describe('in function', _ => {
        test('double quoted', {
          code: 'function f(){ "use strict"; with (x) y; }',
          throws: 'strict',
        });

        test('single quoted', {
          code: "function f(){ 'use strict'; with (x) y; }",
          throws: 'strict',
        });

        test('templates dont count', {
          code: 'function f(){ `use strict`; with (x) y; }',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('newline after semi', {
          code: 'function f(){ "use strict";\nwith (x) y; }',
          throws: 'strict',
        });

        test('newline before semi', {
          code: 'function f(){ "use strict"\n;with (x) y; }',
          throws: 'strict',
        });

        test('asi', {
          code: 'function f(){ "use strict"\nwith (x) y; }',
          throws: 'strict',
        });
      });

      describe('in arrow', _ => {
        test('double quoted', {
          code: '() => { "use strict"; with (x) y; }',
          throws: 'strict',
        });

        test('single quoted', {
          code: "() => { 'use strict'; with (x) y; }",
          throws: 'strict',
        });

        test('templates dont count', {
          code: '() => { `use strict`; with (x) y; }',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('newline after semi', {
          code: '() => { "use strict";\nwith (x) y; }',
          throws: 'strict',
        });

        test('newline before semi', {
          code: '() => { "use strict"\n;with (x) y; }',
          throws: 'strict',
        });

        test('asi', {
          code: '() => { "use strict"\nwith (x) y; }',
          throws: 'strict',
        });
      });

      describe('mixed cases', _ => {
        test('ignored when not first', {
          code: 'var x; "use strict"; with (x) y;',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('other contexts inherit it', {
          code: '"use strict"; function f(){ with (x) y; }',
          throws: 'strict',
        });

        test('function does not taint global scope', {
          code: 'function f(){ "use strict"; foo; } with (x) y;',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('sibling does not taint global scope', {
          code: 'function f(){ "use strict"; foo; } function g() { with (x) y; }',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('parent taints child', {
          code: 'function f(){ "use strict"; foo; function g() { with (x) y; } } ',
          throws: 'strict',
        });

        test('sibling does not taint parent', {
          code: 'function g() { function f(){ "use strict"; foo; } with (x) y; }',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('NOT block scoped', {
          code: 'if (x) { "use strict"; with (x) y; }',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });
      });
    });

    describe('requires simple args', _ => {
      describe('sans args', _ => {
        test('func decl', {
          code: 'function f(){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                      directive: 'use strict',
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('func expr', {
          code: '+function f(){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: '+',
                  prefix: true,
                  argument: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                          directive: 'use strict',
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('property value', {
          code: '({x:function(){"use strict";}})',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                              directive: 'use strict',
                            },
                          ],
                        },
                      },
                      shorthand: false,
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('one arg', _ => {
        test('func decl', {
          code: 'function f(x){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [{type: 'Identifier', name: 'x'}],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                      directive: 'use strict',
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('func expr', {
          code: '+function f(x){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: '+',
                  prefix: true,
                  argument: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [{type: 'Identifier', name: 'x'}],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                          directive: 'use strict',
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('property value', {
          code: '({x:function(x){"use strict";}})',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        id: null,
                        params: [{type: 'Identifier', name: 'x'}],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                              directive: 'use strict',
                            },
                          ],
                        },
                      },
                      shorthand: false,
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('two args', _ => {
        test('func decl', {
          code: 'function f(x, y){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                      directive: 'use strict',
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('func expr', {
          code: '+function f(x, y){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: '+',
                  prefix: true,
                  argument: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                          directive: 'use strict',
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('property value', {
          code: '({x:function(x, y){"use strict";}})',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        id: null,
                        params: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                              directive: 'use strict',
                            },
                          ],
                        },
                      },
                      shorthand: false,
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('init', _ => {
        test('func decl', {
          code: 'function f(x=y){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f(x=y){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function(x=y){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('first arg with init should not reset', _ => {
        test('func decl', {
          code: 'function f(x=y, a){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f(x=y, a){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function(x=y, a){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('second arg with init', _ => {
        test('func decl', {
          code: 'function f(a, x=y){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f(a, x=y){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function(a, x=y){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('destruct', _ => {
        test('func decl', {
          code: 'function f([x]){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f([x]){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function([x]){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('second arg that is destruct', _ => {
        test('func decl', {
          code: 'function f(a, [x]){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f(a, [x]){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function(a, [x]){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('first arg that is destruct should not reset', _ => {
        test('func decl', {
          code: 'function f([x], a){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f([x], a){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function([x], a){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });
    });

    describe('eval', _ => {
      test('cannot assign to eval', {
        code: 'eval = x',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'eval'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
        },
      });

      test('cannot postinc eval', {
        code: 'eval++',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'eval'},
                  operator: '++',
                  prefix: false,
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $ASI],
        },
      });

      test('cannot pre-dec eval', {
        code: '--eval',
        throws: 'Cannot inc/dec a non-assignable value',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'eval'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $ASI],
        },
      });

      test('cannot compound assign to eval', {
        code: 'eval += x',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'eval'},
                  operator: '+=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
        },
      });

      // TODO: will have to circle back for these later. they require a large architectural change.
      // test('cannot destruct assign to eval', {
      //   code: '([eval]) = [x]',
      //   desc: 'vs `([eval]) => [x]`',
      //   throws: 'eval',
      //   SLOPPY_SCRIPT: {
      //     ast: { type: 'Program',
      //       body:
      //         [ { type: 'ExpressionStatement',
      //           expression:
      //             { type: 'AssignmentExpression',
      //               left:
      //                 { type: 'ArrayPattern',
      //                   elements: [ { type: 'Identifier', name: 'eval' } ] },
      //               operator: '=',
      //               right:
      //                 { type: 'ArrayExpression',
      //                   elements: [ { type: 'Identifier', name: 'x' } ] } } } ] },
      //     tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      //   },
      // });
      //
      // test('groups are just one way to destruct', {
      //   code: 'x, [eval] = [x]',
      //   desc: 'vs `x, [eval].foo`; make sure we dont assume destructuring without var/let/const happens with a group; that is just a way to disambiguate',
      //   throws: 'eval',
      //   SLOPPY_SCRIPT: {
      //     ast: { type: 'Program',
      //       body:
      //         [ { type: 'ExpressionStatement',
      //           expression:
      //             { type: 'AssignmentExpression',
      //               left:
      //                 { type: 'ArrayPattern',
      //                   elements: [ { type: 'Identifier', name: 'eval' } ] },
      //               operator: '=',
      //               right:
      //                 { type: 'ArrayExpression',
      //                   elements: [ { type: 'Identifier', name: 'x' } ] } } } ] },
      //     tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      //   },
      // });

      test('cannot import an eval', {
        code: 'import eval from "x";',
        throws: 'eval',
        SLOPPY_SCRIPT: {throws: 'module goal'},
      });

      test('cannot import an eval sans source', {
        code: 'import eval;',
        throws: 'eval',
        SLOPPY_SCRIPT: {throws: 'module goal'},
      });

      test('cannot import a destructed eval', {
        code: 'import {eval} from "x";',
        throws: 'eval',
        SLOPPY_SCRIPT: {throws: 'module goal'},
      });

      test('cannot import an alias eval', {
        code: 'import {foo as eval} from "x";',
        throws: 'eval',
        SLOPPY_SCRIPT: {throws: 'module goal'},
      });

      test('cannot export an eval', {
        code: 'export var eval = x;',
        throws: 'eval',
        SLOPPY_SCRIPT: {throws: 'module goal'},
      });

      test('cannot default export an eval', {
        code: 'export default var eval = x;',
        desc: 'default exports do not allow var bindings (var/let/const) so just make sure this throws and move on',
        throws: true,
      });

      test('cannot use eval as catch var', {
        code: 'try {} catch (eval) {}',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {type: 'BlockStatement', body: []},
                handler: {
                  type: 'CatchClause',
                  param: {type: 'Identifier', name: 'eval'},
                  body: {type: 'BlockStatement', body: []},
                },
                finalizer: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      });

      test('cannot use eval as func name', {
        code: 'function eval() {}',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'eval'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      });

      test('cannot use eval as async func name', {
        code: 'async function eval() {}',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: true,
                id: {type: 'Identifier', name: 'eval'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      });

      test('cannot use eval as generator func name', {
        code: 'function* eval() {}',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: true,
                async: false,
                id: {type: 'Identifier', name: 'eval'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      });

      test('cannot use eval as arg name', {
        code: 'function f(eval) {}',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [{type: 'Identifier', name: 'eval'}],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      });

      test('cannot use eval as func name', {
        code: 'var eval = x;',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: 'eval'},
                    init: {type: 'Identifier', name: 'x'},
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
      });

      test('cannot use eval as let name in strict mode', {
        code: 'let eval = x;',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: true,
          tokens: true,
        },
      });

      test('cannot use eval as const name in strict mode', {
        code: 'const eval = x;',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: true,
          tokens: true,
        },
      });

      test('cannot assign to grouped eval', {
        code: '(eval) = x;',
        throws: true, // Invalid assignment because `eval` is not assignable
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'eval'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
      });

      test('should not pass because of newline / asi', {
        code: '(eval)\n = x;',
        throws: true, // Invalid assignment, applies ASI but then hits a wall because `eval` is not assignable
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'eval'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
      });

      test('multi wrapped ident assign', {
        code: '((((x)))) = x;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
      test('cannot assign to multi grouped eval', {
        code: '((((eval)))) = x;',
        throws: true,
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'eval'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
      });
    });

    describe('header requirements for directive in body', _ => {
      // these tests should cover cases where the header is fine in sloppy mode and throw when finding a use strict in the body
      // https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
      // > It is a Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName
      // > is: "implements", "interface", "let", "package",  "private", "protected", "public", "static", or "yield".

      [
        // Explicitly forbidden binding names in strict mode
        // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors
        'eval',
        'arguments',
        // Yield is always the YieldExpression in strict mode or in a generator context
        'yield',
        // Let is disallowed through a static semantic rather than cfg
        'let',
        // Other idents that are only keywords in strict mode
        'implements',
        'interface',
        'package',
        'private',
        'protected',
        'public',
        'static',
      ].forEach(ident => {
        describe('ident = [' + ident + ']', _ => {
          describe('function decl', _ => {
            test.fail_strict('as func name w/o directive', {
              code: 'function ' + ident + '(a){ }',
            });

            test.fail('as func name w directive', {
              code: 'function ' + ident + '(b){ "use strict"; }',
            });

            test.fail_strict('as param name w/o directive', {
              code: 'function c(' + ident + '){ }',
            });

            test.fail('as param name w directive', {
              code: 'function d(' + ident + '){ "use strict"; }',
            });

            test.fail_strict('assigned to in param default w/o directive', {
              code: 'function e(x=' + ident + '=10){ }',
              desc: 'the default causes the error, not the usage, but whatever',
            });

            test.fail('assigned to in param default w directive', {
              code: 'function f(x=' + ident + '=10){ "use strict"; }',
              desc: 'the default causes the error, not the usage, but whatever',
            });
          });

          describe('function expr', _ => {
            test.fail_strict('as func name w/o directive', {
              code: 'f = function ' + ident + '(){ }',
            });

            test.fail('as func name w directive', {
              code: 'f = function ' + ident + '(){ "use strict"; }',
            });

            test.fail_strict('as param name w/o directive', {
              code: 'f = function f(' + ident + '){ }',
            });

            test.fail('as param name w directive', {
              code: 'f = function f(' + ident + '){ "use strict"; }',
            });

            test.fail_strict('assigned to in param default w/o directive', {
              code: 'f = function f(x=' + ident + '=10){ }',
              desc: 'the default causes the error, not the usage, but whatever',
            });

            test.fail('assigned to in param default w directive', {
              code: 'f = function f(x=' + ident + '=10){ "use strict"; }',
              desc: 'the default (always) causes the error, not the usage, but whatever',
            });
          });

          describe('arrow', _ => {
            test.fail_strict('as param name w/o directive', {
              code: '(' + ident + ') => {}',
            });

            test.fail('as param name w directive', {
              code: 'f = (' + ident + ') => { "use strict"; }',
            });

            test.fail_strict('assigned to in param default w/o directive', {
              code: '(x=' + ident + '=10) => { }',
              desc: 'the default causes the error, not the usage, but whatever',
            });

            test.fail('assigned to in param default w directive', {
              code: 'f(x=' + ident + '=10) => { "use strict"; }',
              desc: 'the default (always) causes the error, not the usage, but whatever',
            });
          });

          describe('obj method', _ => {
            // Note: method names are irrelevant in this context

            test.pass('as method name w/o directive', {
              code: 'o = {' + ident + '(){ }}',
            });

            test.pass('as method name w directive', {
              code: 'o = {' + ident + '(){ "use strict"; }}',
            });

            test.fail_strict('as param name w/o directive', {
              code: 'o = {foo(' + ident + '){ }}',
            });

            test.fail('as param name w directive', {
              code: 'o = {foo(' + ident + '){ "use strict"; }}',
            });

            test.fail_strict('assigned to in param default w/o directive', {
              code: 'o = {foo(x=' + ident + '=y){ }}',
              desc: 'the default causes the error, not the usage, but whatever',
            });

            test.fail('assigned to in param default w directive', {
              code: 'o = {foo(x=' + ident + '=y){ "use strict"; }}',
              desc: 'the default (always) causes the error, not the usage, but whatever',
            });
          });

          describe('class method', _ => {
            // Note: method names are irrelevant in this context
            // Note: classes are always strict so these tests are a liiiitle redundant

            test.pass('as method name w/o directive', {
              code: 'class c {' + ident + '(){ }}',
            });

            test.pass('as method name w directive', {
              code: 'class c {' + ident + '(){ "use strict"; }}',
            });

            test.fail('as param name w/o directive', {
              code: 'class c {foo(' + ident + '){ }}',
            });

            test.fail('as param name w directive', {
              code: 'class c {foo(' + ident + '){ "use strict"; }}',
            });

            test.fail('assigned to in param default w/o directive', {
              code: 'class c {foo(x=' + ident + '=y){ }}',
              desc: 'the default causes the error, not the usage, but whatever',
            });

            test.fail('assigned to in param default w directive', {
              code: 'class c {foo(x=' + ident + '=y){ "use strict"; }}',
              desc: 'the default (always) causes the error, not the usage, but whatever',
            });
          });
        });
      });

      describe('octal escape in func header and the use strict directive rules', _ => {
        // octal escapes are okay in sloppy mode. package is a keyword only in strict mode. lets combine that into tests

        describe('arrow param name', _ => {
          test.fail_strict('package as func param, no escape, no directive', {
            code: 'function foo(package) { }',
          });

          test.fail('package as func param, no escape, with directive', {
            code: 'function foo(package) { "use strict"; }',
          });

          test.fail_strict('package as func param, unicode escape, no directive', {
            code: 'function foo(p\\u0061ckage) { }',
          });

          test.fail('package as func param, unicode escape, with directive', {
            code: 'function foo(p\\u0061ckage) { "use strict"; }',
          });

          test.fail('package as func param, hex escape, no directive', {
            code: 'function foo(p\\x61ckage) { }',
          });

          test.fail('package as func param, hex escape, with directive', {
            code: 'function foo(p\\x61ckage) { "use strict"; }',
          });

          test.fail('package as func param, octal escape, no directive', {
            code: 'function foo(p\\141ckage) { }',
          });

          test.fail('package as func param, octal escape, with directive', {
            code: 'function foo(p\\141ckage) { "use strict"; }',
          });
        });

        describe('arrow param name', _ => {
          test.fail_strict('package as func param, no escape, no directive', {
            code: '(package) => { }',
          });

          test.fail('package as func param, no escape, with directive', {
            code: '(package) => { "use strict"; }',
          });

          test.fail_strict('package as func param, unicode escape, no directive', {
            code: '(p\\u0061ckage) => { }',
          });

          test.fail('package as func param, unicode escape, with directive', {
            code: '(p\\u0061ckage) => { "use strict"; }',
          });

          test.fail('package as func param, hex escape, no directive', {
            code: '(p\\x61ckage) => { }',
          });

          test.fail('package as func param, hex escape, with directive', {
            code: '(p\\x61ckage) => { "use strict"; }',
          });

          test.fail('package as func param, octal escape, no directive', {
            code: '(p\\141ckage) => { }',
          });

          test.fail('package as func param, octal escape, with directive', {
            code: '(p\\141ckage) => { "use strict"; }',
          });
        });

        describe('parenless arrow param name', _ => {
          test.fail_strict('package as func param, no escape, no directive', {
            code: 'package => { }',
          });

          test.fail('package as func param, no escape, with directive', {
            code: 'package => { "use strict"; }',
          });

          test.fail_strict('package as func param, unicode escape, no directive', {
            code: 'p\\u0061ckage => { }',
          });

          test.fail('package as func param, unicode escape, with directive', {
            code: 'p\\u0061ckage => { "use strict"; }',
          });

          test.fail('package as func param, hex escape, no directive', {
            code: 'p\\x61ckage => { }',
          });

          test.fail('package as func param, hex escape, with directive', {
            code: 'p\\x61ckage => { "use strict"; }',
          });

          test.fail('package as func param, octal escape, no directive', {
            code: 'p\\141ckage => { }',
          });

          test.fail('package as func param, octal escape, with directive', {
            code: 'p\\141ckage => { "use strict"; }',
          });
        });
      });
    });

    describe('octal cases, regressions from #15', _ => {
      test.fail_strict('octal in sloppy mode function', {
        code: 'function foo() { 00004; }',
      });

      test.fail('octal in strict mode function with directive', {
        code: 'function foo() { "use strict"; 00004; }',
      });

      test.fail('function with octal as name', {
        code: 'function 00004() { "use strict"; 00004; }',
      });

      test.fail('function with octals as parameter names', {
        code: 'function foo(001, 003) { "use strict"; }',
      });
    });

    describe('asi', _ => {
      ['.foo', '[foo]', '()', '`x`', ' + x', '/f', '/f/g'].forEach(suffix => {
        test.fail_strict('tails that prevent ASI so it is not a directive', {
          code: 'function f(){ "use strict" \n /* suffix = */ ' + suffix + '; eval = 1; }',
        });
      });

      ['foo', '++x', '--x', 'function f(){}', '{x}', ';', '25', 'true'].forEach(suffix => {
        test.fail('tails that cause ASI so it is a directive', {
          code: 'function f(){ "use strict" \n ' + suffix + '; eval = 1; }',
        });
      });
    });
  });
