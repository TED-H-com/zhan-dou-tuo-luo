const { describe, it } = require('node:test');
const assert = require('node:assert');
const TedFlow = require('../site/flow.js');

describe('Performance Benchmarks', () => {
  it('should run wrap efficiently within time limit', () => {
    // Generate a sufficiently long text
    const text = "This is a very long text that needs to be wrapped multiple times to test performance. 中文測試看看效能如何，這是一段很長的文字。".repeat(10);
    const iterations = 1000;
    const timeLimitMs = 1500; // Expected to finish well under 1.5 seconds

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      TedFlow.wrap(text, 15, 50);
    }
    const end = performance.now();
    const duration = end - start;

    console.log(`Wrap time for ${iterations} iterations: ${duration.toFixed(2)}ms`);
    assert.ok(duration < timeLimitMs, `Wrap function should run faster than ${timeLimitMs}ms, took ${duration.toFixed(2)}ms`);
  });

  it('should run advance efficiently within time limit', () => {
    const text = "This is a very long text that needs to be wrapped multiple times to test performance. 中文測試看看效能如何，這是一段很長的文字。".repeat(100);
    const iterations = 1000;
    const timeLimitMs = 1000; // Expected to finish well under 1 second

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      TedFlow.advance(text, 15);
    }
    const end = performance.now();
    const duration = end - start;

    console.log(`Advance time for ${iterations} iterations: ${duration.toFixed(2)}ms`);
    assert.ok(duration < timeLimitMs, `Advance function should run faster than ${timeLimitMs}ms, took ${duration.toFixed(2)}ms`);
  });
});
