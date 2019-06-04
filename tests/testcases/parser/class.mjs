/** @format */
import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $REGEX, $STRING_DOUBLE} from '../../../src/zetokenizer.mjs';
export default (describe, test) => {
  describe('classes', _ => {
    describe('empty classes', _ => {
      describe('as declaration', _ => {
        test('base case empty class', {
          code: 'class A {}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'A',
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('semi in an empty class', {
          code: 'class A {;}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'A',
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('semis in an empty class', {
          code: 'class A {; ;; ;}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'A',
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });
      describe('as expression', _ => {
        test('base case empty class', {
          code: 'x = class A {};',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  operator: '=',
                  right: {
                    type: 'ClassExpression',
                    id: {
                      type: 'Identifier',
                      name: 'A',
                    },
                    superClass: null,
                    body: {
                      type: 'ClassBody',
                      body: [],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });
    });
    describe('extending', _ => {
      test('empty class with trivial extends', {
        code: 'class A extends B {}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: {
                type: 'Identifier',
                name: 'B',
              },
              body: {
                type: 'ClassBody',
                body: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('empty class that extends an expression', {
        code: 'class A extends foo() {}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo',
                },
                arguments: [],
              },
              body: {
                type: 'ClassBody',
                body: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('empty class extending an empty object because i had to be smart about it', {
        code: 'class A extends {} {}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: {
                type: 'ObjectExpression',
                properties: [],
              },
              body: {
                type: 'ClassBody',
                body: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('extend expression also inherits the strict mode from class', {
        code: 'class X extends function(){ with(obj); } {}',
        throws: 'strict mode',
        desc: 'anything from the class keyword onwards is strict mode regardless of goal/sloppy state',
        tokens: [],
      });
      test('extend expression also inherits the strict mode from class', {
        code: 'class let {}',
        throws: 'Cannot use this name',
        desc: 'the name of the function is also considered strict mode so `let` is outlawed',
        tokens: [],
      });
      test.fail('can not extend arrows because it is not a valid lhs', {
        code: 'class x extends () => x {}',
      });
      test.pass('regression: should not try to record class in scope at all', {
        desc: '#11',
        code: '(class A extends B { constructor() { super() } })',
        WEB: false,
      });
      test.pass('regression: should not try to record class in scope in web compat', {
        desc: '#11',
        code: '(class A extends B { constructor() { super() } })',
        WEB: true,
      });
      test.fail('regression: crashed (unexpectedly), web=false', {
        desc: `
        #11
        This should throw an error because super can only be called in a constructor
        `,
        code: '(class A extends B { method() { super() } })',
        WEB: false,
      });
      test.fail('regression: crashed (unexpectedly), web=true', {
        desc: `
        #11
        This should throw an error because super can only be called in a constructor
        `,
        code: '(class A extends B { method() { super() } })',
        web: true,
      });
    });
    describe('ident methods', _ => {
      test('class with simple ident method', {
        code: 'class A {a(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static ident method', {
        code: 'class A {static a(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    static: true,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('regular constructor', {
        code: 'class A {constructor(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'constructor',
                    },
                    static: false,
                    computed: false,
                    kind: 'constructor',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static constructor', {
        code: 'class A {static constructor(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'constructor',
                    },
                    static: true,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('async method', {
        code: 'class A {async foo(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('generator method', {
        code: 'class A {*foo(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('getter method', {
        code: 'class A {get foo(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: false,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('getter named set', {
        code: 'class A {get set(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'set',
                    },
                    static: false,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static getter', {
        code: 'class A {static get foo(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: true,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('async getter method', {
        code: 'class A {async get foo(){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
      test.fail('generator getter method', {
        code: 'class A {* get foo(){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
      test('setter method', {
        code: 'class A {set foo(x){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: false,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('setter named get', {
        code: 'class A {set get(x){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'get',
                    },
                    static: false,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static setter method', {
        code: 'class A {static set foo(x){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: true,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('async setter method', {
        code: 'class A {async set foo(x){}}',
      });
      test.fail('generator setter method', {
        code: 'class A {* set foo(x){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
      test('class with non-special method named get, set, and async', {
        code: 'class A {set(){} get(){} async(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'set',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'get',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'async',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });
    describe('string methods', _ => {
      test('class with simple ident method', {
        code: 'class A {"x"(){}}',
        desc: 'should parse as class method',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"x"',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static ident method', {
        code: 'class A {static "x"(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"x"',
                    },
                    static: true,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('regular constructor', {
        code: 'class A {"constructor"(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"constructor"',
                    },
                    static: false,
                    computed: false,
                    kind: 'constructor',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static constructor', {
        code: 'class A {static "constructor"(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"constructor"',
                    },
                    static: true,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('async method', {
        code: 'class A {async "foo"(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"foo"',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('generator method', {
        code: 'class A {*"foo"(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"foo"',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('getter method', {
        code: 'class A {get "foo"(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"foo"',
                    },
                    static: false,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('getter named set', {
        code: 'class A {get "set"(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"set"',
                    },
                    static: false,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static getter', {
        code: 'class A {static get "foo"(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"foo"',
                    },
                    static: true,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('async getter method', {
        code: 'class A {async get "foo"(){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
      test.fail('generator getter method', {
        code: 'class A {* get "foo"(){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
      test('setter method', {
        code: 'class A {set "foo"(x){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"foo"',
                    },
                    static: false,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('setter named get', {
        code: 'class A {set "get"(x){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"get"',
                    },
                    static: false,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static setter method', {
        code: 'class A {static set "foo"(x){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"foo"',
                    },
                    static: true,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('async setter method', {
        code: 'class A {async set "foo"(x){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
      test.fail('generator setter method', {
        code: 'class A {* set "foo"(x){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
      test('class with non-special method named get, set, and async', {
        code: 'class A {"set"(){} "get"(){} "async"(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"set"',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"get"',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '"async"',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [
          $IDENT,
          $IDENT,
          $PUNCTUATOR,
          $STRING_DOUBLE,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $STRING_DOUBLE,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $STRING_DOUBLE,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
        ],
      });
    });
    describe('number methods', _ => {
      test('class with simple ident method', {
        code: 'class A {1(){}}',
        desc: 'should parse as class method',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '1',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static ident method', {
        code: 'class A {static 2(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '2',
                    },
                    static: true,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('async method', {
        code: 'class A {async 3(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '3',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('generator method', {
        code: 'class A {*4(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '4',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('async generator method', {
        code: 'class A {async * 34(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '34',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: true,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('getter method', {
        code: 'class A {get 5(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '5',
                    },
                    static: false,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static getter', {
        code: 'class A {static get 6(){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '6',
                    },
                    static: true,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('async getter method', {
        code: 'class A {async get 7(){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
      test.fail('generator getter method', {
        code: 'class A {* get 8(){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
      test('setter method', {
        code: 'class A {set 9(x){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '9',
                    },
                    static: false,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static setter method', {
        code: 'class A {static set 10(x){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '10',
                    },
                    static: true,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('async setter method', {
        code: 'class A {async set 11(x){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
      test.fail('generator setter method', {
        code: 'class A {* set 12(x){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
      });
    });
    describe('dynamic methods', _ => {
      test('without modifier', {
        code: 'class A {[a](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static member', {
        code: 'class A {static [a](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    static: true,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('async member', {
        code: 'class A {async [foo](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('generator member', {
        code: 'class A {*[foo](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('getter member', {
        code: 'class A {get [foo](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: false,
                    computed: true,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static getter member', {
        code: 'class A {static get [foo](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: true,
                    computed: true,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('generator setter member', {
        code: 'class A {* get [x](){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('async getter member', {
        code: 'class A {async get [x](){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('setter member', {
        code: 'class A {set [foo](x){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: false,
                    computed: true,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static setter member', {
        code: 'class A {static set [foo](x){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'A',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                    static: true,
                    computed: true,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('generator setter member', {
        code: 'class A {* set [foo](x){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('async getter member', {
        code: 'class A {async get [foo](){}}',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('generator with dynamic key', {
        code: 'class x { *[y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                    },
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('async with dynamic key', {
        code: 'class x { async [y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                    },
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('getter with dynamic key', {
        code: 'class x { get [y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                    },
                    static: false,
                    computed: true,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('setter with dynamic key', {
        code: 'class x { set [y](z){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                    },
                    static: false,
                    computed: true,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'z',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('generator with dynamic key', {
        code: 'class x {static *[y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                    },
                    static: true,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('async with dynamic key', {
        code: 'class x { static async [y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                    },
                    static: true,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('getter with dynamic key', {
        code: 'class x { static get [y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                    },
                    static: true,
                    computed: true,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('setter with dynamic key', {
        code: 'class x { static set [y](z){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                    },
                    static: true,
                    computed: true,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'z',
                        },
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('async generator with dynamic key', {
        code: 'class x { async *[y](){}}',
        desc: 'important to assert that the AST marks the method as both async and a generator',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                    },
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: true,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });
    describe('generators', _ => {
      describe('not static', _ => {
        describe('no prefix', _ => {
          test('with ident key', {
            code: 'class x{*foo(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with dynamic key', {
            code: 'class x{*[x](){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        static: false,
                        computed: true,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with string key', {
            code: 'class x{*"foo"(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Literal',
                          value: '<TODO>',
                          raw: '"foo"',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with number key', {
            code: 'class x{*555(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Literal',
                          value: '<TODO>',
                          raw: '555',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with crap', {
            code: 'class x{*%x(){}}',
            throws: true,
          });
        });
        describe('getter prefix', _ => {
          test.fail('with ident key', {
            code: 'class x{get *foo(){}}',
          });
          test.fail('with dynamic key', {
            code: 'class x{get *[x](){}}',
          });
          test.fail('with string key', {
            code: 'class x{get *"foo"(){}}',
          });
          test.fail('with number key', {
            code: 'class x{get *555(){}}',
          });
          test.fail('with crap', {
            code: 'class x{get *%x(){}}',
          });
        });
        describe('setter prefix', _ => {
          test.fail('with ident key', {
            code: 'class x{set *foo(a){}}',
          });
          test.fail('with dynamic key', {
            code: 'class x{set *[x](a){}}',
          });
          test.fail('with string key', {
            code: 'class x{set *"foo"(a){}}',
          });
          test.fail('with number key', {
            code: 'class x{set *555(a){}}',
          });
          test.fail('with crap', {
            code: 'class x{set *%x(a){}}',
          });
        });
        describe('async prefix', _ => {
          // important to assert that the AST marks the methods as both async and a generator and id=null
          test('with ident key', {
            code: 'class x{async *foo(a){}}',

            callback(ast, tokens, astJson) {
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null');
            },

            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'a',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with dynamic key', {
            code: 'class x{async *[x](a){}}',

            callback(ast, tokens, astJson) {
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null');
            },

            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        static: false,
                        computed: true,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'a',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with string key', {
            code: 'class x{async *"foo"(a){}}',

            callback(ast, tokens, astJson) {
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null');
            },

            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Literal',
                          value: '<TODO>',
                          raw: '"foo"',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'a',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with number key', {
            code: 'class x{async *555(a){}}',

            callback(ast, tokens, astJson) {
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null');
            },

            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Literal',
                          value: '<TODO>',
                          raw: '555',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'a',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test.fail('with crap', {
            code: 'class x{async *%x(a){}}',
          });
        });
      });
      describe('with static', _ => {
        describe('no prefix', _ => {
          test('with ident key', {
            code: 'class x{static *foo(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with dynamic key', {
            code: 'class x{static *[x](){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        static: true,
                        computed: true,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with string key', {
            code: 'class x{static *"foo"(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Literal',
                          value: '<TODO>',
                          raw: '"foo"',
                        },
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with number key', {
            code: 'class x{static *555(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Literal',
                          value: '<TODO>',
                          raw: '555',
                        },
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with crap', {
            code: 'class x{static *%x(){}}',
            throws: true,
          });
        });
        describe('getter prefix', _ => {
          test.fail('with ident key', {
            code: 'class x{static get *foo(){}}',
          });
          test.fail('with dynamic key', {
            code: 'class x{static get *[x](){}}',
          });
          test.fail('with string key', {
            code: 'class x{static get *"foo"(){}}',
          });
          test.fail('with number key', {
            code: 'class x{static get *555(){}}',
          });
          test.fail('with crap', {
            code: 'class x{static get *%x(){}}',
          });
        });
        describe('setter prefix', _ => {
          test.fail('with ident key', {
            code: 'class x{static set *foo(a){}}',
          });
          test.fail('with dynamic key', {
            code: 'class x{static set *[x](a){}}',
          });
          test.fail('with string key', {
            code: 'class x{static set *"foo"(a){}}',
          });
          test.fail('with number key', {
            code: 'class x{static set *555(a){}}',
          });
          test.fail('with crap', {
            code: 'class x{static set *%x(a){}}',
          });
        });
        describe('async prefix', _ => {
          test('with ident key', {
            code: 'class x{static async *foo(a){}}',

            callback(ast, tokens, astJson) {
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null') && astJson.includes('"static":true');
            },

            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'a',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with dynamic key', {
            code: 'class x{static async *[x](a){}}',

            callback(ast, tokens, astJson) {
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null') && astJson.includes('"static":true');
            },

            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        static: true,
                        computed: true,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'a',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with string key', {
            code: 'class x{static async *"foo"(a){}}',

            callback(ast, tokens, astJson) {
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null') && astJson.includes('"static":true');
            },

            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Literal',
                          value: '<TODO>',
                          raw: '"foo"',
                        },
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'a',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('with number key', {
            code: 'class x{static async *555(a){}}',

            callback(ast, tokens, astJson) {
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null') && astJson.includes('"static":true');
            },

            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Literal',
                          value: '<TODO>',
                          raw: '555',
                        },
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'a',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test.fail('with crap', {
            code: 'class x{static async *%x(a){}}',
          });
        });
      });
    });
    describe('regex edge case', _ => {
      describe('declaration', _ => {
        test('sans flag', {
          code: 'class x{}\n/foo/',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'x',
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [],
                },
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Literal',
                  value: '<TODO>',
                  raw: '/foo/',
                },
              },
            ],
          },
          desc: 'note: not a division because class decl requires no semi so there is no need to ASI',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });
        test('with flag', {
          code: 'class x{}\n/foo/g',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'x',
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [],
                },
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Literal',
                  value: '<TODO>',
                  raw: '/foo/g',
                },
              },
            ],
          },
          desc: 'note: not a division because class decl requires no semi so there is no need to ASI',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });
      });
      describe('expression', _ => {
        test('sans flag', {
          code: 'typeof class{}\n/foo/',
          throws: 'Expected to parse a value',
          desc: 'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
          tokens: [],
        });
        test('with flag', {
          code: 'typeof class{}\n/foo/g',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'UnaryExpression',
                      operator: 'typeof',
                      prefix: true,
                      argument: {
                        type: 'ClassExpression',
                        id: null,
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [],
                        },
                      },
                    },
                    operator: '/',
                    right: {
                      type: 'Identifier',
                      name: 'foo',
                    },
                  },
                  operator: '/',
                  right: {
                    type: 'Identifier',
                    name: 'g',
                  },
                },
              },
            ],
          },
          desc: 'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });
      });
    });
    describe('special keys', _ => {
      [
        'break',
        'case',
        'catch',
        'class',
        'const',
        'continue',
        'debugger',
        'default',
        'delete',
        'do',
        'else',
        'export',
        'extends',
        'finally',
        'for',
        'function',
        'if',
        'import',
        'in',
        'instanceof',
        'new',
        'return',
        'super',
        'switch',
        'this',
        'throw',
        'try',
        'typeof',
        'var',
        'void',
        'while',
        'with',
        'null',
        'true',
        'false',
        'enum',
        'eval',
        'arguments',
        'implements',
        'package',
        'protected',
        'interface',
        'private',
        'public',
        'await',
        'yield',
        'let', // "Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName"
        'static', // "Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName"
        'async',
        'get',
        'set',
      ].forEach(ident => {
        describe('ident=' + ident, _ => {
          test('as class name', {
            code: 'class ' + ident + ' {}',
            ...(['async', 'get', 'set'].indexOf(ident) >= 0
              ? {
                  ast: true,
                  tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
                }
              : ['await'].indexOf(ident) >= 0
              ? {
                  ast: true,
                  tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
                  desc: `
                    await is only considered a keyword when parsing in module mode
                  `,
                  MODULE: {
                    throws: true,
                  },
                }
              : {
                  throws: 'variable name',
                }),
          });
          test('as super class name', {
            code: 'class x extends ' + ident + ' {}',
            desc: 'since extends accept an arbitrary expression certain keywords lead to different errors',
            ...(['async', 'this', 'null', 'true', 'false', 'eval', 'arguments', 'get', 'set'].indexOf(ident) >= 0
              ? {
                  ast: true,
                  tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
                }
              : ident === 'await'
              ? {
                  MODULE: {
                    throws: true,
                  },
                  ast: true,
                  tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
                }
              : {
                  throws: true,
                }),
          });
          test.fail('as regular property in class', {
            code: 'class x {' + ident + ': x}',
            desc: 'we will have to revisit this with class properties later',
          });
          test('as method in class', {
            code: 'class x {' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as static method in class', {
            code: 'class x {static ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as generator in class', {
            code: 'class x {* ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as getter in class', {
            code: 'class x {get ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: false,
                        computed: false,
                        kind: 'get',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as setter in class', {
            code: 'class x {set ' + ident + '(x){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: false,
                        computed: false,
                        kind: 'set',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'x',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as async method in class', {
            code: 'class x {async ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: true,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as async generator in class', {
            code: 'class x {async * ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as static getter in class', {
            code: 'class x {static get ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: true,
                        computed: false,
                        kind: 'get',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as static generator in class', {
            code: 'class x {static * ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as static setter in class', {
            code: 'class x {static set ' + ident + '(x){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: true,
                        computed: false,
                        kind: 'set',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'x',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as static async method in class', {
            code: 'class x {static async ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: true,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as static async generator in class', {
            code: 'class x {static async * ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: ident,
                        },
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
        });
      });
    });
    describe('method names can be `prototype`', _ => {
      test('plain', {
        code: 'class x { prototype(){} }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'prototype',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.pass('getter', {
        code: 'class x { get prototype(){} }',
      });
      test.pass('setter', {
        code: 'class x { set prototype(x){} }',
      });
      test.pass('generator', {
        code: 'class x { *prototype(){} }',
      });
      test.pass('async', {
        code: 'class x { async prototype(){} }',
      });
      test.pass('gen async', {
        code: 'class x { async *prototype(){} }',
      });
      test.pass('unicode flag, gen async', {
        code: 'class x { async *prot\\u006ftype(){} }',
      });
      test.pass('string key', {
        code: 'class x { "prototype"(){} }',
      });
      test.pass('string unicode escape key', {
        code: 'class x { "prot\\u006ftype"(){} }',
      });
    });
    describe('static method names can NOT be `prototype`', _ => {
      test('plain', {
        code: 'class x { static prototype(){} }',
        throws: 'prototype',
      });
      test('getter', {
        code: 'class x { static get prototype(){} }',
        throws: 'prototype',
      });
      test('setter', {
        code: 'class x { static set prototype(x){} }',
        throws: 'prototype',
      });
      test('generator', {
        code: 'class x { static *prototype(){} }',
        throws: 'prototype',
      });
      test('async', {
        code: 'class x { static async prototype(){} }',
        throws: 'prototype',
      });
      test('gen async', {
        code: 'class x { static async *prototype(){} }',
        throws: 'prototype',
      });
      test('unicode flag, gen async', {
        code: 'class x { static async *prot\\u006ftype(){} }',
        throws: 'prototype',
      });
      test('string key', {
        code: 'class x { static "prototype"(){} }',
        throws: 'prototype',
      });
      test('string unicode escape key', {
        code: 'class x { static "prot\\u006ftype"(){} }',
        throws: 'prototype',
        SKIP: true,
      });
    });
    test.fail('cannot extend an assignment', {
      code: 'class x extends a = b {}',
    });
    describe('duplicate keys', _ => {
      // https://tc39.github.io/ecma262/#sec-additions-and-changes-that-introduce-incompatibilities-with-prior-editions
      // 12.2.6.1: In ECMAScript 2015, it is no longer an early error to have duplicate property names in Object Initializers.
      test.pass('base case of duplicate key', {
        code: 'class x {a(){}; a(){}}',
      });
      test.pass('first and last', {
        code: 'class x {a(){}; b(){}; a(){}}',
      });
      test.pass('last two', {
        code: 'class x {b(){}; a(){}; a(){}}',
      });
      test.pass('first two', {
        code: 'class x {a(){}; a(){}; b(){}}',
      });
      describe('constructor', _ => {
        describe('regular', _ => {
          // https://tc39.github.io/ecma262/#sec-static-semantics-constructormethod
          // > Early Error rules ensure that there is only one method definition named "constructor" and that it is not an accessor property or generator definition.
          test.pass('base constructor', {
            code: 'class x {constructor(){}}',
          });
          test('double constructor', {
            code: 'class x {constructor(){}; constructor(){}}',
            throws: 'constructor',
          });
          test('a double constructor', {
            code: 'class x {a(){}; constructor(){}; constructor(){}}',
            throws: 'constructor',
          });
          test('spread out double constructor', {
            code: 'class x {a(){}; constructor(){}; a(){}; a(){}; a(){}; constructor(){}; a(){}}',
            throws: 'constructor',
          });
        });
        describe('static', _ => {
          // https://tc39.github.io/ecma262/#sec-static-semantics-constructormethod
          // > It is a Syntax Error if PrototypePropertyNameList of ClassElementList contains more than one occurrence of "constructor".
          // static members do not end up on the prototype so should not get this treatment
          test.pass('base constructor', {
            code: 'class x {static constructor(){}}',
          });
          test.pass('double constructor', {
            code: 'class x {static constructor(){}; static constructor(){}}',
          });
          test.pass('mixed', {
            code: 'class x {static constructor(){}; constructor(){}}',
          });
          test('a static constructor does not disable the check', {
            code: 'class x {static constructor(){}; constructor(){}; constructor(){}}',
            throws: 'constructor',
          });
          test.pass('a double constructor', {
            code: 'class x {a(){}; static constructor(){}; static constructor(){}}',
          });
          test.pass('spread out double constructor', {
            code: 'class x {a(){}; static constructor(){}; a(){}; a(){}; a(){}; static constructor(){}; a(){}}',
          });
        });
      });
    });
    test.pass('assert the paren', {
      code: 'class x {[x](){}}',
    });
    test.fail('assert the paren', {
      code: 'class x {[x]z){}}',
    });
    test.fail('classes only have methods for now', {
      code: 'class x {foo, bar(){}}',
    });
    test.fail('classes do not have shorthands', {
      code: 'class x {foo}',
    });
    test.fail('class members do not have initializers', {
      code: 'class x {foo = x}',
    });
    test.fail('class members do not have colons', {
      code: 'class x {foo: x}',
    });
    test.fail('dynamic class member paren check', {
      code: 'class x { async [x]s){}}',
    });
    test.fail('classes dont support shorthand just end', {
      code: 'class x { y }',
    });
    test.fail('classes dont support shorthand with semi', {
      code: 'class x { y; }',
    });
    describe('constructor name checks', _ => {
      // https://tc39.github.io/ecma262/#sec-identifier-names-static-semantics-stringvalue
      // Note: the "constructor" check is determined by the "StringValue", which canonizes the unicode escapes
      // https://tc39.github.io/ecma262/#sec-string-literals-static-semantics-stringvalue
      // And for strings it is the unquoted canonical value of the string (so "constructor" and 'constructor' + escapes)
      describe('as ident', _ => {
        test('constructor as dynamic property should be a method', {
          code: 'class x { [constructor](){} }',
          desc: 'checking the token name of the key is insufficient if the dynamic aspect is left unchecked',

          callback(ast, tokens, astJson) {
            return astJson.includes('"computed":true') && astJson.includes('"kind":"method"');
          },

          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'x',
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {
                        type: 'Identifier',
                        name: 'constructor',
                      },
                      static: false,
                      computed: true,
                      kind: 'method',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('static constructor is ok and just a method', {
          code: 'class x { static constructor(){} }',

          callback(ast, tokens, astJson) {
            return astJson.includes('"static":true') && astJson.includes('"kind":"method"');
          },

          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'x',
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {
                        type: 'Identifier',
                        name: 'constructor',
                      },
                      static: true,
                      computed: false,
                      kind: 'method',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('getter named "constructor"', {
          code: 'class x { get constructor(){} }',
          desc: 'it is a syntax error for non-static constructor to have a modifier (get/set/async/generator)',
          throws: 'constructor',
        });
        test('setter named "constructor"', {
          code: 'class x { set constructor(x){} }',
          desc: 'it is a syntax error for non-static constructor to have a modifier (get/set/async/generator)',
          throws: 'constructor',
        });
        test('async named "constructor"', {
          code: 'class x { async constructor(){} }',
          desc: 'it is a syntax error for non-static constructor to have a modifier (get/set/async/generator)',
          throws: 'constructor',
        });
        test('generator named "constructor"', {
          code: 'class x { *constructor(){} }',
          desc: 'it is a syntax error for non-static constructor to have a modifier (get/set/async/generator)',
          throws: 'constructor',
        });
        test('async generator named "constructor"', {
          code: 'class x { async *constructor(){} }',
          desc: 'it is a syntax error for non-static constructor to have a modifier (get/set/async/generator)',
          throws: 'constructor',
        });
      });
      describe('as string', _ => {
        test('constructor as dynamic property should be a method', {
          code: 'class x { ["constructor"](){} }',
          desc: 'checking the token name of the key is insufficient if the dynamic aspect is left unchecked',

          callback(ast, tokens, astJson) {
            return astJson.includes('"computed":true') && astJson.includes('"kind":"method"');
          },

          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'x',
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {
                        type: 'Literal',
                        value: '<TODO>',
                        raw: '"constructor"',
                      },
                      static: false,
                      computed: true,
                      kind: 'method',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('static constructor is ok and just a method', {
          code: 'class x { static "constructor"(){} }',

          callback(ast, tokens, astJson) {
            return astJson.includes('"static":true') && astJson.includes('"kind":"method"');
          },

          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'x',
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {
                        type: 'Literal',
                        value: '<TODO>',
                        raw: '"constructor"',
                      },
                      static: true,
                      computed: false,
                      kind: 'method',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('getter named "constructor"', {
          code: 'class x { get "constructor"(){} }',
          desc: 'it is a syntax error for non-static constructor to have a modifier (get/set/async/generator)',
          throws: 'constructor',
        });
        test('setter named "constructor"', {
          code: 'class x { set "constructor"(x){} }',
          desc: 'it is a syntax error for non-static constructor to have a modifier (get/set/async/generator)',
          throws: 'constructor',
        });
        test('async named "constructor"', {
          code: 'class x { async "constructor"(){} }',
          desc: 'it is a syntax error for non-static constructor to have a modifier (get/set/async/generator)',
          throws: 'constructor',
        });
        test('generator named "constructor"', {
          code: 'class x { *"constructor"(){} }',
          desc: 'it is a syntax error for non-static constructor to have a modifier (get/set/async/generator)',
          throws: 'constructor',
        });
        test('async generator named "constructor"', {
          code: 'class x { async *"constructor"(){} }',
          desc: 'it is a syntax error for non-static constructor to have a modifier (get/set/async/generator)',
          throws: 'constructor',
        });
      });
      test('double constructor is illegal', {
        code: 'class x { constructor(){}; constructor(){}; }',
        throws: 'constructor',
      });
      test('string literals can also be constructor AB', {
        code: 'class x { "constructor"(){}; constructor(){}; }',
        throws: 'constructor',
      });
      test('string literals can also be constructor BA', {
        code: 'class x { "constructor"(){}; constructor(){}; }',
        throws: 'constructor',
      });
      test('two string literals named constructor should also cause an error', {
        code: 'class x { \'constructor\'(){}; "constructor"(){}; }',
        throws: 'constructor',
      });
      test.fail('templates are not valid key types', {
        code: 'class x { `constructor`(){} }',
      });
      describe('escapes should be canonical', _ => {
        describe('unicode in idents', _ => {
          test.pass('constructor ident can have unicode escape', {
            code: 'class x { \\u0063onstructor(){} }',
          });
          test('unicode escapes should not circumvent the double constructor check AB', {
            code: 'class x { \\u0063onstructor(){}; constructor(){} }',
            throws: 'constructor',
          });
          test('unicode escapes should not circumvent the double constructor check BA', {
            code: 'class x { constructor(){}; \\u0063onstructor(){}; }',
            throws: 'constructor',
          });
          test('two unicode escaped constructors should still fail', {
            code: 'class x { \u0063onstructor(){}; \\u0063onstructor(){}; }',
            throws: 'constructor',
          });
        });
        describe('in strings', _ => {
          test('string ident with escape can still be constructor so should still fail the check AB', {
            code: 'class x { "\u0063onstructor"(){}; constructor(){}; }',
            throws: 'constructor',
          });
          test('string ident with old unicode escape can still be constructor so should still fail the check BA', {
            code: 'class x { constructor(){}; "\u0063onstructor"(){}; }',
            throws: 'constructor',
          });
          test('string ident with new unicode escape can still be constructor so should still fail the check BA', {
            code: 'class x { constructor(){}; "\u{0063}onstructor"(){}; }',
            throws: 'constructor',
          });
          test('string ident with hex escape can still be constructor so should still fail the check BA', {
            code: 'class x { constructor(){}; "\x63onstructor"(){}; }',
            throws: 'constructor',
          });
        });
      });
    });
    test.pass('class expression with body sans tail', {
      code: '(class x{}.foo)',
    });
    test.pass('class expression with body and tail', {
      code: '(class x{}.foo())',
    });
    test.pass('class expression with tail', {
      code: '(class x{}())',
      desc: 'this will be a runtime error but not a syntax error',
    });
    test('babel case A', {
      code: 'x = class{} \n / foo / g',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x',
              },
              operator: '=',
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'ClassExpression',
                    id: null,
                    superClass: null,
                    body: {
                      type: 'ClassBody',
                      body: [],
                    },
                  },
                  operator: '/',
                  right: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
                operator: '/',
                right: {
                  type: 'Identifier',
                  name: 'g',
                },
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('babel case B', {
      code: 'x = class{} / x',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x',
              },
              operator: '=',
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'ClassExpression',
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [],
                  },
                },
                operator: '/',
                right: {
                  type: 'Identifier',
                  name: 'x',
                },
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('babel case C', {
      code: '(class{} \n / foo / g)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'ClassExpression',
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [],
                  },
                },
                operator: '/',
                right: {
                  type: 'Identifier',
                  name: 'foo',
                },
              },
              operator: '/',
              right: {
                type: 'Identifier',
                name: 'g',
              },
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });
    test.pass('class as arg default A', {
      code: 'f = ([cls = class {}]) => {}',
    });
    test.pass('class as arg default B', {
      code: 'f = ([xCls = class X {}]) => {}',
    });
    test.pass('class as arg default C1', {
      code: 'f = ([xCls2 = class { name() {} }]) => {}',
    });
    test.pass('class as arg default C2', {
      code: 'f = ([xCls2 = class { static name() {} }]) => {}',
    });
    test.pass('class as arg default ABC', {
      code: 'f = ([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) => {}',
    });
    test.fail('class extends.ident', {
      code: 'class v extends.foo {}',
    });
    test('class extends number literal', {
      code: 'class v extends.9 {}',
      desc: 'this is a class that extends the number .9 (not a syntactically invalid attempt to read property 9)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'v',
            },
            superClass: {
              type: 'Literal',
              value: '<TODO>',
              raw: '.9',
            },
            body: {
              type: 'ClassBody',
              body: [],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('class extends array literal', {
      code: 'class v extends[x] {}',
      desc: 'note: this is not a dynamic property access but an array instance with one element (`[x]`)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'v',
            },
            superClass: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x',
                },
              ],
            },
            body: {
              type: 'ClassBody',
              body: [],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
    test.fail('member expression with dynamic property as class member', {
      code: 'class w {  t[x](){}  }',
    });
    test.fail('member expression with ident property as class member', {
      code: 'class w {  t.x(){}  }',
    });
    test.fail('class extending an arrow', {
      code: ['class x extends ()=>{} {}', 'class x extends ()=>1 {}'],
    });
    test('default exports of an extending class', {
      code: 'export default class extends F {}',
      SCRIPT: {
        throws: true,
      },
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'ClassDeclaration',
              id: null,
              superClass: {
                type: 'Identifier',
                name: 'F',
              },
              body: {
                type: 'ClassBody',
                body: [],
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('extending an empty object', {
      code: 'class x extends {} {}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
            },
            superClass: {
              type: 'ObjectExpression',
              properties: [],
            },
            body: {
              type: 'ClassBody',
              body: [],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
    test.fail('async constructor is disallowed', {
      code: 'class X {    async constructor() {}   }',
    });
    test('as expr', {
      code: '(class X {})',
      desc: 'this is probably redundant at this point',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'X',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [],
              },
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });
    describe('static as a name', _ => {
      test('method named static', {
        code: 'class x{   static(){}   }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'static',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static member named static', {
        code: 'class x{   static static(){}    }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'static',
                    },
                    static: true,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('async member named static', {
        code: 'class x{   async static(){}    }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'static',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static async member named static', {
        code: 'class x{   static async static(){}    }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'static',
                    },
                    static: true,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('static modifier comes before the async modifier', {
        code: 'class x{   async static static(){}    }',
      });
      test('generator called static', {
        code: 'class x{   *static(){}    }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'static',
                    },
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('static generator called static', {
        code: 'class x{   static *static(){}    }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'x',
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'static',
                    },
                    static: true,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });
    describe('duplicate member modifiers', _ => {
      test.fail('double static', {
        code: 'class x {    static static f(){}    }',
      });
      test.fail('double async', {
        code: 'class x {    async async f(){}    }',
      });
      test.fail('double star', {
        code: 'class x {    * * f(){}    }',
      });
      test.fail('static star static', {
        code: 'class x {    static * static f(){}    }',
      });
      test.fail('async star async', {
        code: 'class x {    async * async f(){}    }',
      });
      test.fail('async static async', {
        code: 'class x {    async static async f(){}    }',
      });
      test.fail('get get', {
        code: 'class x {    get get f(){}    }',
      });
      test.fail('set set', {
        code: 'class x {    set set f(x){}    }',
      });
      test.fail('set get', {
        code: 'class x {    set get f(x){}    }',
      });
      test.fail('get set', {
        code: 'class x {    get set f(x){}    }',
      });
      test.fail('async async get', {
        code: 'class x {    async async get f(x){}    }',
      });
    });
    test.fail('can not make a static method called "prototype"', {
      code: 'class x {    static prototype(){}    }',
      desc: `
        > It is a Syntax Error if PropName of MethodDefinition is "prototype".
      `,
    });
    test.fail('static in obj inside class', {
      code: 'class x { foo() { return { static foo() {} } } }',
      desc: 'make sure the class state doesnt somehow propagate while parsing the object',
    });
    test('computed property method with constructor ident is fine', {
      code: 'class x{ get [constructor](){} }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  key: {
                    type: 'Identifier',
                    name: 'constructor',
                  },
                  static: false,
                  computed: true,
                  kind: 'get',
                  value: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
    test.fail('sanity check to confirm certain over accepting errors cannot occur', {
      code: 'class x { async get foo(){ }}',
    });
    test('non-idents that are generators', {
      code: 'class x { *"x"(){} }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  key: {
                    type: 'Literal',
                    value: '<TODO>',
                    raw: '"x"',
                  },
                  static: false,
                  computed: false,
                  kind: 'method',
                  value: {
                    type: 'FunctionExpression',
                    generator: true,
                    async: false,
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('computed generators', {
      code: 'class x { *[expr](){} }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  key: {
                    type: 'Identifier',
                    name: 'expr',
                  },
                  static: false,
                  computed: true,
                  kind: 'method',
                  value: {
                    type: 'FunctionExpression',
                    generator: true,
                    async: false,
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('static computed generators', {
      code: 'class x { static *[expr](){} }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  key: {
                    type: 'Identifier',
                    name: 'expr',
                  },
                  static: true,
                  computed: true,
                  kind: 'method',
                  value: {
                    type: 'FunctionExpression',
                    generator: true,
                    async: false,
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
    test.pass('static is valid as static member of class', {
      code: 'class x {static static(){}}',
      desc: 'props are not affected by keyword restrictions',
    });
    test.fail('checking that forward slash edge case is fixed', {
      code: 'class x { static / foo(){} }',
    });
    describe('lexerflag and extends/computed key', _ => {
      describe('yield in class computed key', _ => {
        test.fail('yield expr in computed expression of key', {
          code: 'class x{[yield](a){}}',
          desc: 'all class parts are strict',
        });
        test.fail('yield expr in gen computed expression of key', {
          code: 'class x{*[yield](a){}}',
          desc: 'all class parts are strict',
        });
        test.fail('yield expr in extends of class', {
          code: 'class x extends yield {}',
          desc: 'all class parts are strict',
        });
        test.pass('gen nested yield expr in computed expression of key', {
          code: 'function *f(){  class x{[yield](a){}}  }',
        });
        test.pass('gen nested yield expr in gen computed expression of key', {
          code: 'function *f(){  class x{*[yield](a){}}  }',
        });
        test.fail('gen nested yield expr in extends of class', {
          code: 'function *f(){   class x extends yield {}    }',
          throws: 'yield',
          desc: 'yield is not a LeftHandSideExpression',
        });
      });
      test.fail('the `in` operator inside a class extends inside a for-in header', {
        code: 'for (class x extends a in b {} in c);',
        desc: '`in` is not a LeftHandSideExpression so it still throws (but with a different error)',
      });
      test.fail('classes are not assignable so cannot be lhs of for header', {
        code: 'for (class x { [a](){} } in c);',
        desc: 'confirm that the outer flag is passed on but the FOR_IN lexer flag is reset',
      });
      test.pass('properties of classes could be assignable so this is ok', {
        code: 'for (class x { [a](){} }.x in c);',
        desc: 'confirm that the outer flag is passed on but the FOR_IN lexer flag is reset',
      });
      test.pass('the `in` operator inside a class computed method key inside a for-in header', {
        code: 'for (class x { [a in b](){} }.x in c);',
        desc: 'confirm that the outer flag is passed on but the FOR_IN lexer flag is reset',
      });
      describe('super property in computed method key', _ => {
        test.fail('super prop in computed key of non-extending class without wrapper', {
          code: 'class x { [super.foo](){} }',
          desc: 'Just matching others at this point',
        });
        test.fail('super prop in computed key of extending class without wrapper', {
          code: 'class x extends y { [super.foo](){} }',
          desc: 'Just matching others at this point',
        });
        test.pass('super prop in computed key of non-extending class when wrapped in non-extending class', {
          code: 'class a { foo(){   class x { [super.foo](){} }    }}',
          desc: 'Just matching others at this point',
        });
        test.pass('super prop in computed key of extending calss when wrapped in non-extending class', {
          code: 'class a { foo(){   class x extends y { [super.foo](){} }    }}',
          desc: 'Just matching others at this point',
        });
        test.pass('super prop in computed key of non-extending class when wrapped in extending class', {
          code: 'class a extends b { foo(){   class x { [super.foo](){} }    }}',
          desc: 'Just matching others at this point',
        });
        test.pass('super prop in computed key of extending class when wrapped in extending class', {
          code: 'class a extends b { foo(){   class x extends y { [super.foo](){} }    }}',
          desc: 'Just matching others at this point',
        });
      });
      describe('super property in extends', _ => {
        test.fail('super prop in extends not wrapped', {
          code: 'class x extends super.foo {}',
        });
        test.pass('super prop in extends wrapped in non-extending class', {
          code: 'class a { foo(){      class x extends super.foo {}    }}',
        });
        test.pass('super prop in extends wrapped in extending class', {
          code: 'class a extends b { foo(){      class x extends super.foo {}    }}',
        });
      });
      describe('super call in computed method key', _ => {
        test.fail('super call in computed key of non-extending class without wrapper', {
          code: 'class x { [super()](){} }',
          desc: 'Just matching others at this point',
        });
        test.fail('super call in computed key of extending class without wrapper', {
          code: 'class x extends y { [super()](){} }',
          desc: 'Just matching others at this point',
        });
        test.fail('super call in computed key of non-extending class when wrapped in non-extending class', {
          code: 'class a { constructor(){   class x { [super()](){} }    }}',
          desc: 'Just matching others at this point',
        });
        test.fail('super call in computed key of extending class when wrapped in non-extending class', {
          code: 'class a { constructor(){   class x extends y { [super()](){} }    }}',
          desc: 'Just matching others at this point',
        });
        test.pass('super call in computed key of non-extending class when wrapped in extending class', {
          code: 'class a extends b { constructor(){   class x { [super()](){} }    }}',
          desc: 'Just matching others at this point',
        });
        test.pass('super call in computed key of extending class when wrapped in extending class', {
          code: 'class a extends b { constructor(){   class x extends y { [super()](){} }    }}',
          desc: 'Just matching others at this point',
        });
      });
      describe('super call in extends', _ => {
        test.fail('super call in extends not wrapped', {
          code: 'class x extends super() {}',
        });
        test.fail('super call in extends wrapped in non-extending class', {
          code: 'class a { constructor(){      class x extends super() {}    }}',
        });
        test.pass('super call in extends wrapped in extending class', {
          code: 'class a extends b { constructor(){      class x extends super() {}    }}',
        });
      });
    });
    describe('asi and regex cases', _ => {
      describe('class decl', _ => {
        test.fail('newline-regex after class keyword', {
          code: 'class \n /foo/ x{}',
        });
        test.fail('newline-regex after class id', {
          code: 'class x \n /foo/ {}',
        });
        test.fail('newline-regex after open curly', {
          code: 'class x { \n /foo/ }',
        });
        test.fail('newline-regex after method name', {
          code: 'class x { x \n /foo/ }',
        });
        test.fail('newline-regex after async', {
          code: 'class x { async \n /foo/ }',
        });
        test.fail('newline-regex after get', {
          code: 'class x { get \n /foo/ }',
        });
        test.fail('newline-regex after set', {
          code: 'class x { set \n /foo/ }',
        });
        test.fail('newline-regex after star', {
          code: 'class x { * \n /foo/ }',
        });
        test.fail('newline-regex after open paren', {
          code: 'class x { y(\n /foo/){} }',
        });
        test.fail('newline-regex after param', {
          code: 'class x { y(z, \n /foo/){} }',
        });
        test.fail('newline-regex after close paren', {
          code: 'class x { y()\n /foo/{} }',
        });
        test.fail('newline-regex after method close curly', {
          code: 'class x { y() {}\n /foo/ }',
        });
      });
      describe('class expr', _ => {
        test.fail('newline-regex after class keyword', {
          code: 'let c = class \n /foo/ x{}',
        });
        test.fail('newline-regex after class id', {
          code: 'let c = class x \n /foo/ {}',
        });
        test.fail('newline-regex after open curly', {
          code: 'let c = class x { \n /foo/ }',
        });
        test.fail('newline-regex after method name', {
          code: 'let c = class x { x \n /foo/ }',
        });
        test.fail('newline-regex after async', {
          code: 'let c = class x { async \n /foo/ }',
        });
        test.fail('newline-regex after get', {
          code: 'let c = class x { get \n /foo/ }',
        });
        test.fail('newline-regex after set', {
          code: 'let c = class x { set \n /foo/ }',
        });
        test.fail('newline-regex after star', {
          code: 'let c = class x { * \n /foo/ }',
        });
        test.fail('newline-regex after open paren', {
          code: 'let c = class x { y(\n /foo/){} }',
        });
        test.fail('newline-regex after param', {
          code: 'let c = class x { y(z, \n /foo/){} }',
        });
        test.fail('newline-regex after close paren', {
          code: 'let c = class x { y()\n /foo/{} }',
        });
        test.fail('newline-regex after method close curly', {
          code: 'let c = class x { y() {}\n /foo/ }',
        });
        test.fail('newline-regex after class expr in func call', {
          code: 'foo(class x { y() {} } \n /foo/)',
        });
      });
    });
    describe('invalid syntax', _ => {
      test.fail('missing a paren', {
        code: 'class A {"x"){}}',
      });
      test.fail('missing parens', {
        code: 'class A {"x"{}}',
      });
    });
    describe('piggies in classes', _ => {
      describe('yield', _ => {
        describe('unwrapped', _ => {
          test('as class name', {
            code: 'class yield { }',
            throws: 'Parser error! Cannot use this name (yield) as a variable name because: Cannot use this reserved word as a variable name in strict mode',
          });
          test('in extends no args', {
            code: 'class x extends yield { }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('in extends with args', {
            code: 'class x extends yield y { }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('in wrapped extends no args', {
            code: 'class x extends feh(yield) { }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('in wrapped extends with args', {
            code: 'class x extends feh(yield y) { }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('as param', {
            code: 'class x { foo(yield){} }',
            throws: 'Parser error! Cannot use this name (yield) as a variable name because: Cannot use this reserved word as a variable name in strict mode',
          });
          test('as default no arg', {
            code: 'class x { foo(x=yield){} }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('as default with arg', {
            code: 'class x { foo(x=yield y){} }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('nested', {
            code: 'class x { foo(x=new (yield)()){} }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('method key', {
            code: 'class x { yield(){} }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'yield',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('computed no arg', {
            code: 'class x { [yield](){} }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('computed with arg', {
            code: 'class x { [yield y](){} }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
        });
        describe('wrapped in plain func', _ => {
          test('as class name', {
            code: 'function f(){  class yield { }  }',
            throws: 'Parser error! Cannot use this name (yield) as a variable name because: Cannot use this reserved word as a variable name in strict mode',
          });
          test('in extends no args', {
            code: 'function f(){  class x extends yield { }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('in extends with args', {
            code: 'function f(){  class x extends yield y { }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('in wrapped extends no args', {
            code: 'function f(){  class x extends feh(yield) { }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('in wrapped extends with args', {
            code: 'function f(){  class x extends feh(yield y) { }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('as param', {
            code: 'function f(){  class x { foo(yield){} }  }',
            throws: 'Parser error! Cannot use this name (yield) as a variable name because: Cannot use this reserved word as a variable name in strict mode',
          });
          test('as default no arg', {
            code: 'function f(){  class x { foo(x=yield){} }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('as default with arg', {
            code: 'function f(){  class x { foo(x=yield y){} }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('nested', {
            code: 'function f(){  class x { foo(x=new (yield)()){} }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('method key', {
            code: 'function f(){  class x { yield(){} }  }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'yield',
                              },
                              static: false,
                              computed: false,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('computed no arg', {
            code: 'function f(){  class x { [yield](){} }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('computed with arg', {
            code: 'function f(){  class x { [yield y](){} }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
        });
        describe('wrapped in generator', _ => {
          test('as class name', {
            code: 'function *f(){  class yield { }  }',
            throws: 'Parser error! Cannot use this name (yield) as a variable name because: Cannot use this reserved word as a variable name in strict mode',
          });
          test('in extends no args', {
            code: 'function *f(){  class x extends yield { }  }',
            throws: 'Parser error! Did not expect to parse an AssignmentExpression but found `yield`',
          });
          test('in extends with args', {
            code: 'function *f(){  class x extends yield y { }  }',
            throws: 'Parser error! Did not expect to parse an AssignmentExpression but found `yield`',
          });
          test('in wrapped extends no args', {
            code: 'function *f(){  class x extends feh(yield) { }  }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: true,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'feh',
                          },
                          arguments: [
                            {
                              type: 'YieldExpression',
                              delegate: false,
                              argument: null,
                            },
                          ],
                        },
                        body: {
                          type: 'ClassBody',
                          body: [],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('in wrapped extends with args', {
            code: 'function *f(){  class x extends feh(yield y) { }  }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: true,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'feh',
                          },
                          arguments: [
                            {
                              type: 'YieldExpression',
                              delegate: false,
                              argument: {
                                type: 'Identifier',
                                name: 'y',
                              },
                            },
                          ],
                        },
                        body: {
                          type: 'ClassBody',
                          body: [],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as param', {
            code: 'function *f(){  class x { foo(yield){} }  }',
            throws: 'Parser error! Cannot use this name (yield) as a variable name because: Cannot use this reserved word as a variable name in strict mode',
          });
          test('as default no arg', {
            code: 'function *f(){  class x { foo(x=yield){} }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('as default with arg', {
            code: 'function *f(){  class x { foo(x=yield y){} }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('nested', {
            code: 'function *f(){  class x { foo(x=new (yield)()){} }  }',
            throws: 'Parser error! Cannot use `yield` outside of generator functions when in strict mode',
          });
          test('method key', {
            code: 'function *f(){  class x { yield(){} }  }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: true,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'yield',
                              },
                              static: false,
                              computed: false,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('computed no arg', {
            code: 'function *f(){  class x { [yield](){} }  }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: true,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'YieldExpression',
                                delegate: false,
                                argument: null,
                              },
                              static: false,
                              computed: true,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('computed with arg', {
            code: 'function *f(){  class x { [yield y](){} }  }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: true,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'YieldExpression',
                                delegate: false,
                                argument: {
                                  type: 'Identifier',
                                  name: 'y',
                                },
                              },
                              static: false,
                              computed: true,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
        });
      });
      describe('await', _ => {
        describe('unwrapped', _ => {
          test('as class name', {
            code: 'class await { }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'await',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal',
            },
          });
          test('in extends no args', {
            code: 'class x extends await { }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'await',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('in extends with args', {
            code: 'class x extends await y { }',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('in wrapped extends no args', {
            code: 'class x extends feh(await) { }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'feh',
                    },
                    arguments: [
                      {
                        type: 'Identifier',
                        name: 'await',
                      },
                    ],
                  },
                  body: {
                    type: 'ClassBody',
                    body: [],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('in wrapped extends with args', {
            code: 'class x extends feh(await y) { }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('as param no arg', {
            code: 'class x { foo(await){} }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'await',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal',
            },
          });
          test('as param with arg', {
            code: 'class x { foo(await y){} }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal',
            },
          });
          test('as default no arg', {
            code: 'class x { foo(x=await){} }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [
                            {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'x',
                              },
                              right: {
                                type: 'Identifier',
                                name: 'await',
                              },
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('as default with arg', {
            code: 'class x { foo(x=await y){} }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('nested no arg', {
            code: 'class x { foo(x=new (await)()){} }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [
                            {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'x',
                              },
                              right: {
                                type: 'NewExpression',
                                arguments: [],
                                callee: {
                                  type: 'Identifier',
                                  name: 'await',
                                },
                              },
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('nested with arg', {
            code: 'class x { foo(x=new (await y)()){} }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('method key no arg', {
            code: 'class x { await(){} }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'await',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('method key with arg', {
            code: 'class x { await y(){} }',
            throws: 'Parser error! Either the current modifier is unknown or the input that followed was unexpected',
          });
          test('computed no arg', {
            code: 'class x { [await](){} }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'await',
                        },
                        static: false,
                        computed: true,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('computed with arg', {
            code: 'class x { [await y](){} }',
            throws: 'Parser error! Next ord should be 93 (`]`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
        });
        describe('wrapped in plain func', _ => {
          test('as class name', {
            code: 'function f() {   class await { }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'await',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal',
            },
          });
          test('in extends no args', {
            code: 'function f() {   class x extends await { }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: {
                          type: 'Identifier',
                          name: 'await',
                        },
                        body: {
                          type: 'ClassBody',
                          body: [],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('in extends with args', {
            code: 'function f() {   class x extends await y { }   }',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('in wrapped extends no args', {
            code: 'function f() {   class x extends feh(await) { }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'feh',
                          },
                          arguments: [
                            {
                              type: 'Identifier',
                              name: 'await',
                            },
                          ],
                        },
                        body: {
                          type: 'ClassBody',
                          body: [],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('in wrapped extends with args', {
            code: 'function f() {   class x extends feh(await y) { }   }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('as param no arg', {
            code: 'function f() {   class x { foo(await){} }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'foo',
                              },
                              static: false,
                              computed: false,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [
                                  {
                                    type: 'Identifier',
                                    name: 'await',
                                  },
                                ],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal',
            },
          });
          test('as param with arg', {
            code: 'function f() {   class x { foo(await y){} }   }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal',
            },
          });
          test('as default no arg', {
            code: 'function f() {   class x { foo(x=await){} }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'foo',
                              },
                              static: false,
                              computed: false,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [
                                  {
                                    type: 'AssignmentPattern',
                                    left: {
                                      type: 'Identifier',
                                      name: 'x',
                                    },
                                    right: {
                                      type: 'Identifier',
                                      name: 'await',
                                    },
                                  },
                                ],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('as default with arg', {
            code: 'function f() {   class x { foo(x=await y){} }   }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('nested no arg', {
            code: 'function f() {   class x { foo(x=new (await)()){} }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'foo',
                              },
                              static: false,
                              computed: false,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [
                                  {
                                    type: 'AssignmentPattern',
                                    left: {
                                      type: 'Identifier',
                                      name: 'x',
                                    },
                                    right: {
                                      type: 'NewExpression',
                                      arguments: [],
                                      callee: {
                                        type: 'Identifier',
                                        name: 'await',
                                      },
                                    },
                                  },
                                ],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('nested with arg', {
            code: 'function f() {   class x { foo(x=new (await y)()){} }   }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('method key no arg', {
            code: 'function f() {   class x { await(){} }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'await',
                              },
                              static: false,
                              computed: false,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('method key with arg', {
            code: 'function f() {   class x { await y(){} }   }',
            throws: 'Parser error! Either the current modifier is unknown or the input that followed was unexpected',
          });
          test('computed no arg', {
            code: 'function f() {   class x { [await](){} }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'await',
                              },
                              static: false,
                              computed: true,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('computed with arg', {
            code: 'function f() {   class x { [await y](){} }   }',
            throws: 'Parser error! Next ord should be 93 (`]`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
        });
        describe('wrapped in async func', _ => {
          test('as class name', {
            code: 'async function f() {   class await { }   }',
            throws: 'Parser error! Cannot use this name (await) as a variable name because: Await not allowed here',
            STRICT: {
              throws: 'Parser error! Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal',
            },
          });
          test('in extends no args', {
            code: 'async function f() {   class x extends await { }   }',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 125 (curc: `}`, token: `}`)',
          });
          test('in extends with args', {
            code: 'async function f() {   class x extends await y { }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: true,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: {
                          type: 'AwaitExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'y',
                          },
                        },
                        body: {
                          type: 'ClassBody',
                          body: [],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('in wrapped extends no args', {
            code: 'async function f() {   class x extends feh(await) { }   }',
            throws: 'Parser error! Expected to parse a value',
          });
          test('in wrapped extends with args', {
            code: 'async function f() {   class x extends feh(await y) { }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: true,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'feh',
                          },
                          arguments: [
                            {
                              type: 'AwaitExpression',
                              argument: {
                                type: 'Identifier',
                                name: 'y',
                              },
                            },
                          ],
                        },
                        body: {
                          type: 'ClassBody',
                          body: [],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as param no arg', {
            code: 'async function f() {   class x { foo(await){} }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: true,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'foo',
                              },
                              static: false,
                              computed: false,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [
                                  {
                                    type: 'Identifier',
                                    name: 'await',
                                  },
                                ],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal',
            },
          });
          test('as param with arg', {
            code: 'async function f() {   class x { foo(await y){} }   }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal',
            },
          });
          test('as default no arg', {
            code: 'async function f() {   class x { foo(x=await){} }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: true,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'foo',
                              },
                              static: false,
                              computed: false,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [
                                  {
                                    type: 'AssignmentPattern',
                                    left: {
                                      type: 'Identifier',
                                      name: 'x',
                                    },
                                    right: {
                                      type: 'Identifier',
                                      name: 'await',
                                    },
                                  },
                                ],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('as default with arg', {
            code: 'async function f() {   class x { foo(x=await y){} }   }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('nested no arg', {
            code: 'async function f() {   class x { foo(x=new (await)()){} }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: true,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'foo',
                              },
                              static: false,
                              computed: false,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [
                                  {
                                    type: 'AssignmentPattern',
                                    left: {
                                      type: 'Identifier',
                                      name: 'x',
                                    },
                                    right: {
                                      type: 'NewExpression',
                                      arguments: [],
                                      callee: {
                                        type: 'Identifier',
                                        name: 'await',
                                      },
                                    },
                                  },
                                ],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('nested with arg', {
            code: 'async function f() {   class x { foo(x=new (await y)()){} }   }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
            STRICT: {
              throws: 'Parser error! Cannot use `await` as var when goal=module but found `await` outside an async function',
            },
          });
          test('method key no arg', {
            code: 'async function f() {   class x { await(){} }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: true,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'Identifier',
                                name: 'await',
                              },
                              static: false,
                              computed: false,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('method key with arg', {
            code: 'async function f() {   class x { await y(){} }   }',
            throws: 'Parser error! Either the current modifier is unknown or the input that followed was unexpected',
          });
          test('computed no arg', {
            code: 'async function f() {   class x { [await](){} }   }',
            throws: 'Parser error! Expected to parse a value',
          });
          test('computed with arg', {
            code: 'async function f() {   class x { [await y](){} }   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: true,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ClassDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'x',
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: [
                            {
                              type: 'MethodDefinition',
                              key: {
                                type: 'AwaitExpression',
                                argument: {
                                  type: 'Identifier',
                                  name: 'y',
                                },
                              },
                              static: false,
                              computed: true,
                              kind: 'method',
                              value: {
                                type: 'FunctionExpression',
                                generator: false,
                                async: false,
                                id: null,
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: [],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
        });
      });
      describe('super ident', _ => {
        describe('unwrapped', _ => {
          test('as class name', {
            code: 'class super { }',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class x extends super { }',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in extends with args', {
            code: 'class x extends super y { }',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in wrapped extends no args', {
            code: 'class x extends feh(super) { }',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in wrapped extends with args', {
            code: 'class x extends feh(super y) { }',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('as param', {
            code: 'class x { foo(super){} }',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class x { foo(x=super){} }',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('as default with arg', {
            code: 'class x { foo(x=super y){} }',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('nested', {
            code: 'class x { foo(x=new (super)()){} }',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('method key', {
            code: 'class x { super(){} }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'super',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('computed no arg', {
            code: 'class x { [super](){} }',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('computed with arg', {
            code: 'class x { [super y](){} }',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
        });
        describe('wrapped in plain class in constructor', _ => {
          test('as class name', {
            code: 'class outer { constructor(){  class super { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer { constructor(){  class x extends super { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in extends with args', {
            code: 'class outer { constructor(){  class x extends super y { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in wrapped extends no args', {
            code: 'class outer { constructor(){  class x extends feh(super) { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in wrapped extends with args', {
            code: 'class outer { constructor(){  class x extends feh(super y) { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('as param', {
            code: 'class outer { constructor(){  class x { foo(super){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer { constructor(){  class x { foo(x=super){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('as default with arg', {
            code: 'class outer { constructor(){  class x { foo(x=super y){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('nested', {
            code: 'class outer { constructor(){  class x { foo(x=new (super)()){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('method key', {
            code: 'class outer { constructor(){  class x { super(){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'super',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('computed no arg', {
            code: 'class outer { constructor(){  class x { [super](){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('computed with arg', {
            code: 'class outer { constructor(){  class x { [super y](){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
        });
        describe('wrapped in plain class in method', _ => {
          test('as class name', {
            code: 'class outer { meh(){  class super { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer { meh(){  class x extends super { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in extends with args', {
            code: 'class outer { meh(){  class x extends super y { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in wrapped extends no args', {
            code: 'class outer { meh(){  class x extends feh(super) { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in wrapped extends with args', {
            code: 'class outer { meh(){  class x extends feh(super y) { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('as param', {
            code: 'class outer { meh(){  class x { foo(super){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer { meh(){  class x { foo(x=super){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('as default with arg', {
            code: 'class outer { meh(){  class x { foo(x=super y){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('nested', {
            code: 'class outer { meh(){  class x { foo(x=new (super)()){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('method key', {
            code: 'class outer { meh(){  class x { super(){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'super',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('computed no arg', {
            code: 'class outer { meh(){  class x { [super](){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('computed with arg', {
            code: 'class outer { meh(){  class x { [super y](){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
        });
        describe('wrapped in extending class in constructor', _ => {
          test('as class name', {
            code: 'class outer extends S { constructor(){  class super { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer extends S { constructor(){  class x extends super { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in extends with args', {
            code: 'class outer extends S { constructor(){  class x extends super y { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in wrapped extends no args', {
            code: 'class outer extends S { constructor(){  class x extends feh(super) { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in wrapped extends with args', {
            code: 'class outer extends S { constructor(){  class x extends feh(super y) { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('as param', {
            code: 'class outer extends S { constructor(){  class x { foo(super){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer extends S { constructor(){  class x { foo(x=super){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('as default with arg', {
            code: 'class outer extends S { constructor(){  class x { foo(x=super y){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('nested', {
            code: 'class outer extends S { constructor(){  class x { foo(x=new (super)()){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('method key', {
            code: 'class outer extends S { constructor(){  class x { super(){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'super',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('computed no arg', {
            code: 'class outer extends S { constructor(){  class x { [super](){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('computed with arg', {
            code: 'class outer extends S { constructor(){  class x { [super y](){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
        });
        describe('wrapped in extending class in method', _ => {
          test('as class name', {
            code: 'class outer extends S { meh(){  class super { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer extends S { meh(){  class x extends super { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in extends with args', {
            code: 'class outer extends S { meh(){  class x extends super y { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in wrapped extends no args', {
            code: 'class outer extends S { meh(){  class x extends feh(super) { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('in wrapped extends with args', {
            code: 'class outer extends S { meh(){  class x extends feh(super y) { }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('as param', {
            code: 'class outer extends S { meh(){  class x { foo(super){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer extends S { meh(){  class x { foo(x=super){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('as default with arg', {
            code: 'class outer extends S { meh(){  class x { foo(x=super y){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('nested', {
            code: 'class outer extends S { meh(){  class x { foo(x=new (super)()){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('method key', {
            code: 'class outer extends S { meh(){  class x { super(){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'super',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('computed no arg', {
            code: 'class outer extends S { meh(){  class x { [super](){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
          test('computed with arg', {
            code: 'class outer extends S { meh(){  class x { [super y](){} }  }}',
            throws: 'Parser error! The `super` keyword can only be used as call or member expression',
          });
        });
      });
      describe('super prop', _ => {
        describe('unwrapped', _ => {
          test('as class name', {
            code: 'class super.foo { }',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class x extends super.foo { }',
            throws: 'Parser error! Can only use `super.foo` in class or object methods or in arrows nested in those methods/arrows',
          });
          test('in extends with args', {
            code: 'class x extends super.foo y { }',
            throws: 'Parser error! Can only use `super.foo` in class or object methods or in arrows nested in those methods/arrows',
          });
          test('in wrapped extends no args', {
            code: 'class x extends feh(super.foo) { }',
            throws: 'Parser error! Can only use `super.foo` in class or object methods or in arrows nested in those methods/arrows',
          });
          test('in wrapped extends with args', {
            code: 'class x extends feh(super.foo y) { }',
            throws: 'Parser error! Can only use `super.foo` in class or object methods or in arrows nested in those methods/arrows',
          });
          test('as param', {
            code: 'class x { foo(super.foo){} }',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class x { foo(x=super.foo){} }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [
                            {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'x',
                              },
                              right: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'Super',
                                },
                                property: {
                                  type: 'Identifier',
                                  name: 'foo',
                                },
                                computed: false,
                              },
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('as default of constructor', {
            code: 'class x { constructor(x=super.foo y){} }',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
          });
          test('nested', {
            code: 'class x { foo(x=new (super.foo)()){} }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          id: null,
                          params: [
                            {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'x',
                              },
                              right: {
                                type: 'NewExpression',
                                arguments: [],
                                callee: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'Super',
                                  },
                                  property: {
                                    type: 'Identifier',
                                    name: 'foo',
                                  },
                                  computed: false,
                                },
                              },
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('method key', {
            code: 'class x { super.foo(){} }',
            throws: 'Parser error! Either the current modifier is unknown or the input that followed was unexpected',
          });
          test('computed no arg', {
            code: 'class x { [super.foo](){} }',
            throws: 'Parser error! Can only use `super.foo` in class or object methods or in arrows nested in those methods/arrows',
          });
          test('computed with arg', {
            code: 'class x { [super.foo y](){} }',
            throws: 'Parser error! Can only use `super.foo` in class or object methods or in arrows nested in those methods/arrows',
          });
        });
        describe('wrapped in plain class in constructor', _ => {
          test('as class name', {
            code: 'class outer { constructor(){  class super.foo { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer { constructor(){  class x extends super.foo { }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'Super',
                                  },
                                  property: {
                                    type: 'Identifier',
                                    name: 'foo',
                                  },
                                  computed: false,
                                },
                                body: {
                                  type: 'ClassBody',
                                  body: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('in extends with args', {
            code: 'class outer { constructor(){  class x extends super.foo y { }  }}',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 121 (curc: `y`, token: `y`)',
          });
          test('in wrapped extends no args', {
            code: 'class outer { constructor(){  class x extends feh(super.foo) { }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: {
                                  type: 'CallExpression',
                                  callee: {
                                    type: 'Identifier',
                                    name: 'feh',
                                  },
                                  arguments: [
                                    {
                                      type: 'MemberExpression',
                                      object: {
                                        type: 'Super',
                                      },
                                      property: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      computed: false,
                                    },
                                  ],
                                },
                                body: {
                                  type: 'ClassBody',
                                  body: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('in wrapped extends with args', {
            code: 'class outer { constructor(){  class x extends feh(super.foo y) { }  }}',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
          });
          test('as param', {
            code: 'class outer { constructor(){  class x { foo(super.foo){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer { constructor(){  class x { foo(x=super.foo){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [
                                          {
                                            type: 'AssignmentPattern',
                                            left: {
                                              type: 'Identifier',
                                              name: 'x',
                                            },
                                            right: {
                                              type: 'MemberExpression',
                                              object: {
                                                type: 'Super',
                                              },
                                              property: {
                                                type: 'Identifier',
                                                name: 'foo',
                                              },
                                              computed: false,
                                            },
                                          },
                                        ],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('as default with arg', {
            code: 'class outer { constructor(){  class x { foo(x=super.foo y){} }  }}',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
          });
          test('nested', {
            code: 'class outer { constructor(){  class x { foo(x=new (super.foo)()){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [
                                          {
                                            type: 'AssignmentPattern',
                                            left: {
                                              type: 'Identifier',
                                              name: 'x',
                                            },
                                            right: {
                                              type: 'NewExpression',
                                              arguments: [],
                                              callee: {
                                                type: 'MemberExpression',
                                                object: {
                                                  type: 'Super',
                                                },
                                                property: {
                                                  type: 'Identifier',
                                                  name: 'foo',
                                                },
                                                computed: false,
                                              },
                                            },
                                          },
                                        ],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('method key', {
            code: 'class outer { constructor(){  class x { super.foo(){} }  }}',
            throws: 'Parser error! Either the current modifier is unknown or the input that followed was unexpected',
          });
          test('computed no arg', {
            code: 'class outer { constructor(){  class x { [super.foo](){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'MemberExpression',
                                        object: {
                                          type: 'Super',
                                        },
                                        property: {
                                          type: 'Identifier',
                                          name: 'foo',
                                        },
                                        computed: false,
                                      },
                                      static: false,
                                      computed: true,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('computed with arg', {
            code: 'class outer { constructor(){  class x { [super.foo y](){} }  }}',
            throws: 'Parser error! Next ord should be 93 (`]`) but was 121 (curc: `y`, token: `y`)',
          });
        });
        describe('wrapped in plain class in method', _ => {
          test('as class name', {
            code: 'class outer { meh(){  class super.foo { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer { meh(){  class x extends super.foo { }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'Super',
                                  },
                                  property: {
                                    type: 'Identifier',
                                    name: 'foo',
                                  },
                                  computed: false,
                                },
                                body: {
                                  type: 'ClassBody',
                                  body: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('in extends with args', {
            code: 'class outer { meh(){  class x extends super.foo y { }  }}',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 121 (curc: `y`, token: `y`)',
          });
          test('in wrapped extends no args', {
            code: 'class outer { meh(){  class x extends feh(super.foo) { }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: {
                                  type: 'CallExpression',
                                  callee: {
                                    type: 'Identifier',
                                    name: 'feh',
                                  },
                                  arguments: [
                                    {
                                      type: 'MemberExpression',
                                      object: {
                                        type: 'Super',
                                      },
                                      property: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      computed: false,
                                    },
                                  ],
                                },
                                body: {
                                  type: 'ClassBody',
                                  body: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('in wrapped extends with args', {
            code: 'class outer { meh(){  class x extends feh(super.foo y) { }  }}',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
          });
          test('as param', {
            code: 'class outer { meh(){  class x { foo(super.foo){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer { meh(){  class x { foo(x=super.foo){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [
                                          {
                                            type: 'AssignmentPattern',
                                            left: {
                                              type: 'Identifier',
                                              name: 'x',
                                            },
                                            right: {
                                              type: 'MemberExpression',
                                              object: {
                                                type: 'Super',
                                              },
                                              property: {
                                                type: 'Identifier',
                                                name: 'foo',
                                              },
                                              computed: false,
                                            },
                                          },
                                        ],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('as default with arg', {
            code: 'class outer { meh(){  class x { foo(x=super.foo y){} }  }}',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
          });
          test('nested', {
            code: 'class outer { meh(){  class x { foo(x=new (super.foo)()){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [
                                          {
                                            type: 'AssignmentPattern',
                                            left: {
                                              type: 'Identifier',
                                              name: 'x',
                                            },
                                            right: {
                                              type: 'NewExpression',
                                              arguments: [],
                                              callee: {
                                                type: 'MemberExpression',
                                                object: {
                                                  type: 'Super',
                                                },
                                                property: {
                                                  type: 'Identifier',
                                                  name: 'foo',
                                                },
                                                computed: false,
                                              },
                                            },
                                          },
                                        ],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('method key', {
            code: 'class outer { meh(){  class x { super.foo(){} }  }}',
            throws: 'Parser error! Either the current modifier is unknown or the input that followed was unexpected',
          });
          test('computed no arg', {
            code: 'class outer { meh(){  class x { [super.foo](){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'MemberExpression',
                                        object: {
                                          type: 'Super',
                                        },
                                        property: {
                                          type: 'Identifier',
                                          name: 'foo',
                                        },
                                        computed: false,
                                      },
                                      static: false,
                                      computed: true,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('computed with arg', {
            code: 'class outer { meh(){  class x { [super.foo y](){} }  }}',
            throws: 'Parser error! Next ord should be 93 (`]`) but was 121 (curc: `y`, token: `y`)',
          });
        });
        describe('wrapped in extending class in constructor', _ => {
          test('as class name', {
            code: 'class outer extends S { constructor(){  class super.foo { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer extends S { constructor(){  class x extends super.foo { }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'Super',
                                  },
                                  property: {
                                    type: 'Identifier',
                                    name: 'foo',
                                  },
                                  computed: false,
                                },
                                body: {
                                  type: 'ClassBody',
                                  body: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('in extends with args', {
            code: 'class outer extends S { constructor(){  class x extends super.foo y { }  }}',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 121 (curc: `y`, token: `y`)',
          });
          test('in wrapped extends no args', {
            code: 'class outer extends S { constructor(){  class x extends feh(super.foo) { }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: {
                                  type: 'CallExpression',
                                  callee: {
                                    type: 'Identifier',
                                    name: 'feh',
                                  },
                                  arguments: [
                                    {
                                      type: 'MemberExpression',
                                      object: {
                                        type: 'Super',
                                      },
                                      property: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      computed: false,
                                    },
                                  ],
                                },
                                body: {
                                  type: 'ClassBody',
                                  body: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('in wrapped extends with args', {
            code: 'class outer extends S { constructor(){  class x extends feh(super.foo y) { }  }}',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
          });
          test('as param', {
            code: 'class outer extends S { constructor(){  class x { foo(super.foo){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer extends S { constructor(){  class x { foo(x=super.foo){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [
                                          {
                                            type: 'AssignmentPattern',
                                            left: {
                                              type: 'Identifier',
                                              name: 'x',
                                            },
                                            right: {
                                              type: 'MemberExpression',
                                              object: {
                                                type: 'Super',
                                              },
                                              property: {
                                                type: 'Identifier',
                                                name: 'foo',
                                              },
                                              computed: false,
                                            },
                                          },
                                        ],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('as default with arg', {
            code: 'class outer extends S { constructor(){  class x { foo(x=super.foo y){} }  }}',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
          });
          test('nested', {
            code: 'class outer extends S { constructor(){  class x { foo(x=new (super.foo)()){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [
                                          {
                                            type: 'AssignmentPattern',
                                            left: {
                                              type: 'Identifier',
                                              name: 'x',
                                            },
                                            right: {
                                              type: 'NewExpression',
                                              arguments: [],
                                              callee: {
                                                type: 'MemberExpression',
                                                object: {
                                                  type: 'Super',
                                                },
                                                property: {
                                                  type: 'Identifier',
                                                  name: 'foo',
                                                },
                                                computed: false,
                                              },
                                            },
                                          },
                                        ],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('method key', {
            code: 'class outer extends S { constructor(){  class x { super.foo(){} }  }}',
            throws: 'Parser error! Either the current modifier is unknown or the input that followed was unexpected',
          });
          test('computed no arg', {
            code: 'class outer extends S { constructor(){  class x { [super.foo](){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'MemberExpression',
                                        object: {
                                          type: 'Super',
                                        },
                                        property: {
                                          type: 'Identifier',
                                          name: 'foo',
                                        },
                                        computed: false,
                                      },
                                      static: false,
                                      computed: true,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('computed with arg', {
            code: 'class outer extends S { constructor(){  class x { [super.foo y](){} }  }}',
            throws: 'Parser error! Next ord should be 93 (`]`) but was 121 (curc: `y`, token: `y`)',
          });
        });
        describe('wrapped in extending class in method', _ => {
          test('as class name', {
            code: 'class outer extends S { meh(){  class super.foo { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer extends S { meh(){  class x extends super.foo { }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'Super',
                                  },
                                  property: {
                                    type: 'Identifier',
                                    name: 'foo',
                                  },
                                  computed: false,
                                },
                                body: {
                                  type: 'ClassBody',
                                  body: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('in extends with args', {
            code: 'class outer extends S { meh(){  class x extends super.foo y { }  }}',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 121 (curc: `y`, token: `y`)',
          });
          test('in wrapped extends no args', {
            code: 'class outer extends S { meh(){  class x extends feh(super.foo) { }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: {
                                  type: 'CallExpression',
                                  callee: {
                                    type: 'Identifier',
                                    name: 'feh',
                                  },
                                  arguments: [
                                    {
                                      type: 'MemberExpression',
                                      object: {
                                        type: 'Super',
                                      },
                                      property: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      computed: false,
                                    },
                                  ],
                                },
                                body: {
                                  type: 'ClassBody',
                                  body: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('in wrapped extends with args', {
            code: 'class outer extends S { meh(){  class x extends feh(super.foo y) { }  }}',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
          });
          test('as param', {
            code: 'class outer extends S { meh(){  class x { foo(super.foo){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer extends S { meh(){  class x { foo(x=super.foo){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [
                                          {
                                            type: 'AssignmentPattern',
                                            left: {
                                              type: 'Identifier',
                                              name: 'x',
                                            },
                                            right: {
                                              type: 'MemberExpression',
                                              object: {
                                                type: 'Super',
                                              },
                                              property: {
                                                type: 'Identifier',
                                                name: 'foo',
                                              },
                                              computed: false,
                                            },
                                          },
                                        ],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('as default with arg', {
            code: 'class outer extends S { meh(){  class x { foo(x=super.foo y){} }  }}',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
          });
          test('nested', {
            code: 'class outer extends S { meh(){  class x { foo(x=new (super.foo)()){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'Identifier',
                                        name: 'foo',
                                      },
                                      static: false,
                                      computed: false,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [
                                          {
                                            type: 'AssignmentPattern',
                                            left: {
                                              type: 'Identifier',
                                              name: 'x',
                                            },
                                            right: {
                                              type: 'NewExpression',
                                              arguments: [],
                                              callee: {
                                                type: 'MemberExpression',
                                                object: {
                                                  type: 'Super',
                                                },
                                                property: {
                                                  type: 'Identifier',
                                                  name: 'foo',
                                                },
                                                computed: false,
                                              },
                                            },
                                          },
                                        ],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('method key', {
            code: 'class outer extends S { meh(){  class x { super.foo(){} }  }}',
            throws: 'Parser error! Either the current modifier is unknown or the input that followed was unexpected',
          });
          test('computed no arg', {
            code: 'class outer extends S { meh(){  class x { [super.foo](){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'meh',
                        },
                        static: false,
                        computed: false,
                        kind: 'method',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'MemberExpression',
                                        object: {
                                          type: 'Super',
                                        },
                                        property: {
                                          type: 'Identifier',
                                          name: 'foo',
                                        },
                                        computed: false,
                                      },
                                      static: false,
                                      computed: true,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('computed with arg', {
            code: 'class outer extends S { meh(){  class x { [super.foo y](){} }  }}',
            throws: 'Parser error! Next ord should be 93 (`]`) but was 121 (curc: `y`, token: `y`)',
          });
        });
      });
      describe('super call', _ => {
        describe('unwrapped', _ => {
          test('as class name', {
            code: 'class super() { }',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class x extends super() { }',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in extends with args', {
            code: 'class x extends super() y { }',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in wrapped extends no args', {
            code: 'class x extends feh(super()) { }',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in wrapped extends with args', {
            code: 'class x extends feh(super() y) { }',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('as param', {
            code: 'class x { foo(super()){} }',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class x { foo(x=super()){} }',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('as default of constructor', {
            code: 'class x { constructor(x=super()){} }',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('as default with arg', {
            code: 'class x { foo(x=super() y){} }',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('nested', {
            code: 'class x { foo(x=new (super())()){} }',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('method key', {
            code: 'class x { super()(){} }',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 40 (curc: `(`, token: `(`)',
          });
          test('computed no arg', {
            code: 'class x { [super()](){} }',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('computed with arg', {
            code: 'class x { [super() y](){} }',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
        });
        describe('wrapped in plain class in constructor', _ => {
          test('as class name', {
            code: 'class outer { constructor(){  class super() { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer { constructor(){  class x extends super() { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in extends with args', {
            code: 'class outer { constructor(){  class x extends super() y { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in wrapped extends no args', {
            code: 'class outer { constructor(){  class x extends feh(super()) { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in wrapped extends with args', {
            code: 'class outer { constructor(){  class x extends feh(super() y) { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('as param', {
            code: 'class outer { constructor(){  class x { foo(super()){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer { constructor(){  class x { foo(x=super()){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('as default with arg', {
            code: 'class outer { constructor(){  class x { foo(x=super() y){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('nested', {
            code: 'class outer { constructor(){  class x { foo(x=new (super())()){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('method key', {
            code: 'class outer { constructor(){  class x { super()(){} }  }}',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 40 (curc: `(`, token: `(`)',
          });
          test('computed no arg', {
            code: 'class outer { constructor(){  class x { [super()](){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('computed with arg', {
            code: 'class outer { constructor(){  class x { [super() y](){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
        });
        describe('wrapped in plain class in method', _ => {
          test('as class name', {
            code: 'class outer { meh(){  class super() { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer { meh(){  class x extends super() { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in extends with args', {
            code: 'class outer { meh(){  class x extends super() y { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in wrapped extends no args', {
            code: 'class outer { meh(){  class x extends feh(super()) { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in wrapped extends with args', {
            code: 'class outer { meh(){  class x extends feh(super() y) { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('as param', {
            code: 'class outer { meh(){  class x { foo(super()){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer { meh(){  class x { foo(x=super()){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('as default with arg', {
            code: 'class outer { meh(){  class x { foo(x=super() y){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('nested', {
            code: 'class outer { meh(){  class x { foo(x=new (super())()){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('method key', {
            code: 'class outer { meh(){  class x { super()(){} }  }}',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 40 (curc: `(`, token: `(`)',
          });
          test('computed no arg', {
            code: 'class outer { meh(){  class x { [super()](){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('computed with arg', {
            code: 'class outer { meh(){  class x { [super() y](){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
        });
        describe('wrapped in extending class in constructor', _ => {
          test('as class name', {
            code: 'class outer extends S { constructor(){  class super() { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer extends S { constructor(){  class x extends super() { }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: {
                                  type: 'CallExpression',
                                  callee: {
                                    type: 'Super',
                                  },
                                  arguments: [],
                                },
                                body: {
                                  type: 'ClassBody',
                                  body: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('in extends with args', {
            code: 'class outer extends S { constructor(){  class x extends super() y { }  }}',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 121 (curc: `y`, token: `y`)',
          });
          test('in wrapped extends no args', {
            code: 'class outer extends S { constructor(){  class x extends feh(super()) { }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: {
                                  type: 'CallExpression',
                                  callee: {
                                    type: 'Identifier',
                                    name: 'feh',
                                  },
                                  arguments: [
                                    {
                                      type: 'CallExpression',
                                      callee: {
                                        type: 'Super',
                                      },
                                      arguments: [],
                                    },
                                  ],
                                },
                                body: {
                                  type: 'ClassBody',
                                  body: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('in wrapped extends with args', {
            code: 'class outer extends S { constructor(){  class x extends feh(super() y) { }  }}',
            throws: 'Parser error! Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)',
          });
          test('as param', {
            code: 'class outer extends S { constructor(){  class x { foo(super()){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer extends S { constructor(){  class x { foo(x=super()){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('as default with arg', {
            code: 'class outer extends S { constructor(){  class x { foo(x=super() y){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('nested', {
            code: 'class outer extends S { constructor(){  class x { foo(x=new (super())()){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('method key', {
            code: 'class outer extends S { constructor(){  class x { super()(){} }  }}',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 40 (curc: `(`, token: `(`)',
          });
          test('computed no arg', {
            code: 'class outer extends S { constructor(){  class x { [super()](){} }  }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'outer',
                  },
                  superClass: {
                    type: 'Identifier',
                    name: 'S',
                  },
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {
                          type: 'Identifier',
                          name: 'constructor',
                        },
                        static: false,
                        computed: false,
                        kind: 'constructor',
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
                                type: 'ClassDeclaration',
                                id: {
                                  type: 'Identifier',
                                  name: 'x',
                                },
                                superClass: null,
                                body: {
                                  type: 'ClassBody',
                                  body: [
                                    {
                                      type: 'MethodDefinition',
                                      key: {
                                        type: 'CallExpression',
                                        callee: {
                                          type: 'Super',
                                        },
                                        arguments: [],
                                      },
                                      static: false,
                                      computed: true,
                                      kind: 'method',
                                      value: {
                                        type: 'FunctionExpression',
                                        generator: false,
                                        async: false,
                                        id: null,
                                        params: [],
                                        body: {
                                          type: 'BlockStatement',
                                          body: [],
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });
          test('computed with arg', {
            code: 'class outer extends S { constructor(){  class x { [super() y](){} }  }}',
            throws: 'Parser error! Next ord should be 93 (`]`) but was 121 (curc: `y`, token: `y`)',
          });
        });
        describe('wrapped in extending class in method', _ => {
          test('as class name', {
            code: 'class outer extends S { meh(){  class super() { }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('in extends no args', {
            code: 'class outer extends S { meh(){  class x extends super() { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in extends with args', {
            code: 'class outer extends S { meh(){  class x extends super() y { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in wrapped extends no args', {
            code: 'class outer extends S { meh(){  class x extends feh(super()) { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('in wrapped extends with args', {
            code: 'class outer extends S { meh(){  class x extends feh(super() y) { }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('as param', {
            code: 'class outer extends S { meh(){  class x { foo(super()){} }  }}',
            throws: 'Parser error! Cannot use this name (super) as a variable name because: Cannot never use this reserved word as a variable name',
          });
          test('as default no arg', {
            code: 'class outer extends S { meh(){  class x { foo(x=super()){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('as default with arg', {
            code: 'class outer extends S { meh(){  class x { foo(x=super() y){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('nested', {
            code: 'class outer extends S { meh(){  class x { foo(x=new (super())()){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('method key', {
            code: 'class outer extends S { meh(){  class x { super()(){} }  }}',
            throws: 'Parser error! Next ord should be 123 (`{`) but was 40 (curc: `(`, token: `(`)',
          });
          test('computed no arg', {
            code: 'class outer extends S { meh(){  class x { [super()](){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
          test('computed with arg', {
            code: 'class outer extends S { meh(){  class x { [super() y](){} }  }}',
            throws: 'Parser error! Can only use `super()` in constructors of classes that extend another class',
          });
        });
      });
    });
  });
};
