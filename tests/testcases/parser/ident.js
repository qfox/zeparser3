let {$ASI, $IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('identifiers', _ => {
    describe('statements', _ => {
      test('ident with semi', {
        code: 'foo;',
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR],
      });

      test('ident with eof', {
        code: 'foo',
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}],
        },
        tokens: [$IDENT, $ASI],
      });

      test('double ident with semi', {
        code: 'foo;bar;',
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}, {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('double ident with asi', {
        code: 'foo\nbar',
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}, {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}],
        },
        tokens: [$IDENT, $ASI, $IDENT, $ASI],
      });
    });

    describe('unicode escapes', _ => {

      test.pass('classic unicode escape at start', {
        code: '\\u0065xxx',
      });

      test.pass('classic unicode escape in middle', {
        code: 'xxx\\u0065xxx',
      });

      test.pass('classic unicode escape at end', {
        code: 'xxx\\u0065',
      });

      test.pass('codepoint unicode escape at start', {
        code: '\\u{65}xxx',
      });

      test.pass('codepoint unicode escape in middle', {
        code: 'xxx\\u{65}xxx',
      });

      test.pass('codepoint unicode escape at end', {
        code: 'xxx\\u{65}',
      });

      test.fail('hex escapes are not supported at start', {
        code: '\\x61xxx',
      });

      test.fail('hex escapes are not supported at mid', {
        code: 'xxx\\x61xxx',
      });

      test.fail('hex escapes are not supported at end', {
        code: 'xxx\\x61',
      });

      test.fail('weird escapes are not supported at start', {
        code: '\\Axxx',
      });

      test.fail('weird escapes are not supported at mid', {
        code: 'xxx\\Axxx',
      });

      test.fail('weird escapes are not supported at end', {
        code: 'xxx\\A',
      });
    });
  });
