const { describe, it } = require('node:test');
const assert = require('node:assert');
const cache = require('../src/cache.js');
const gameLoop = require('../src/gameLoop.js');

describe('Performance Benchmarks', () => {
  describe('Parts Combo Lookup Cache', () => {
    it('should retrieve 100,000 combo stats within 50ms', () => {
      const start = process.hrtime.bigint();

      for (let i = 0; i < 100000; i++) {
        cache.getComboStats(`combo_${i % 100}`);
      }

      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;

      assert.ok(durationMs < 50, `Cache lookup took too long: ${durationMs}ms`);
    });
  });

  describe('Battle Outcome Calculation Loop', () => {
    it('should compute 1,000 battle loops within 100ms', () => {
      const state = { tick: 0, status: 'playing', tops: [{ x: 0, y: 0, rpm: 8000 }, { x: 50, y: 50, rpm: 7000 }] };
      const start = process.hrtime.bigint();

      let currentState = state;
      for (let i = 0; i < 1000; i++) {
        currentState = gameLoop.tick(currentState);
      }

      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;

      assert.ok(durationMs < 100, `Calculation loop took too long: ${durationMs}ms`);
    });
  });

  describe('Memory Allocations', () => {
    it('should not leak memory during large simulation runs', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      const state = { tick: 0, status: 'playing', tops: [] };
      let currentState = state;
      for (let i = 0; i < 50000; i++) {
         currentState = gameLoop.tick(currentState);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryDiffMB = (finalMemory - initialMemory) / 1024 / 1024;

      assert.ok(memoryDiffMB < 50, `Memory increased by too much: ${memoryDiffMB.toFixed(2)} MB`);
    });
  });
});
