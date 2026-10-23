const { describe, it } = require('node:test');
const assert = require('node:assert');

const gameLoop = require('../src/gameLoop.js');
const physics = require('../src/physics.js');
const scoring = require('../src/scoring.js');

describe('Gameplay Logic and Physics Simulation', () => {
  describe('Core game loops', () => {
    it('should update game state on each tick', () => {
      let state = { tick: 0, status: 'playing' };

      state = gameLoop.tick(state);
      assert.strictEqual(state.tick, 1);

      state = gameLoop.tick(state);
      assert.strictEqual(state.tick, 2);
    });

    it('should stop tick updates when game is over', () => {
      let state = { tick: 5, status: 'game_over' };

      state = gameLoop.tick(state);
      assert.strictEqual(state.tick, 5);
    });
  });

  describe('Collision boundaries', () => {
    it('should detect when a top goes out of bounds (Over Finish)', () => {
      const arenaRadius = 100;

      assert.strictEqual(physics.checkOutOfBounds(0, 0, arenaRadius), false);
      assert.strictEqual(physics.checkOutOfBounds(50, 50, arenaRadius), false);
      assert.strictEqual(physics.checkOutOfBounds(100, 10, arenaRadius), true);
    });

    it('should detect collision between two tops', () => {
      const topA = { x: 0, y: 0, radius: 10 };
      const topB = { x: 15, y: 0, radius: 10 };
      const topC = { x: 50, y: 50, radius: 10 };

      assert.strictEqual(physics.checkCollision(topA, topB), true);
      assert.strictEqual(physics.checkCollision(topA, topC), false);
    });
  });

  describe('Score accounting', () => {
    it('should award 1 point for a Spin Finish', () => {
      assert.strictEqual(scoring.calculateScore('spin'), 1);
    });

    it('should award 2 points for an Over or Burst Finish', () => {
      assert.strictEqual(scoring.calculateScore('over'), 2);
      assert.strictEqual(scoring.calculateScore('burst'), 2);
    });

    it('should award 3 points for an Xtreme Finish', () => {
      assert.strictEqual(scoring.calculateScore('xtreme'), 3);
    });

    it('should declare a winner when a player reaches 4 points', () => {
      assert.strictEqual(scoring.checkWinCondition(3), false);
      assert.strictEqual(scoring.checkWinCondition(4), true);
      assert.strictEqual(scoring.checkWinCondition(5), true);
    });
  });
});
