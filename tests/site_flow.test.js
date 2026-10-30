const { describe, it } = require('node:test');
const assert = require('node:assert');
const TedFlow = require('../site/flow.js');

describe('site/flow.js module', () => {
  it('should correctly calculate status at given elapsed time', () => {
    // Tests statusAt(elapsed, count)
    const res1 = TedFlow.statusAt(0, 0);
    assert.deepStrictEqual(res1, { index: 0, opacity: 0, span: TedFlow.STATUS.fade + TedFlow.STATUS.hold + TedFlow.STATUS.out + TedFlow.STATUS.gap, local: 0 });

    const res2 = TedFlow.statusAt(100, 1);
    assert.deepStrictEqual(res2, { index: 0, opacity: 1, span: TedFlow.STATUS.fade + TedFlow.STATUS.hold + TedFlow.STATUS.out + TedFlow.STATUS.gap, local: 0 });

    const res3 = TedFlow.statusAt(0, 3);
    assert.strictEqual(res3.index, 0);
    assert.strictEqual(res3.opacity, 0);

    const span = TedFlow.STATUS.fade + TedFlow.STATUS.hold + TedFlow.STATUS.out + TedFlow.STATUS.gap;
    const res4 = TedFlow.statusAt(span + 10, 3);
    assert.strictEqual(res4.index, 1);
  });

  it('should correctly tokenize strings', () => {
    const tokens1 = TedFlow.tokenise('Hello world');
    assert.deepStrictEqual(tokens1, ['Hello', ' ', 'world']);

    const tokens2 = TedFlow.tokenise('中文測試');
    assert.deepStrictEqual(tokens2, ['中', '文', '測', '試']);

    const tokens3 = TedFlow.tokenise('Mixed 中文 test');
    assert.deepStrictEqual(tokens3, ['Mixed', ' ', '中', '文', ' ', 'test']);
  });

  it('should export list of icon names correctly', () => {
    const icons = TedFlow.iconNames;
    assert.ok(Array.isArray(icons));
    assert.ok(icons.includes('chat'));
    assert.ok(icons.includes('hub'));
    assert.ok(icons.includes('shield'));
  });
});
