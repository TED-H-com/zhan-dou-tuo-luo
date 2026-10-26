const { describe, it } = require('node:test');
const assert = require('node:assert');
const physics = require('../src/physics.js');

describe('Spinning Top Angular Momentum Calculations', () => {
  describe('Angular Momentum Decay', () => {
    it('should calculate RPM decay over time based on friction and air resistance', () => {
      const top = { weight: 45, rpm: 8000 };
      const dt = 0.1;
      const frictionGround = 0.05;
      const dragAir = 0.002;
      const velocity = 10;

      const newRpm = physics.calculateRpmDecay(top.rpm, top.weight, velocity, frictionGround, dragAir, dt);

      // Expected formula: RPM_new = RPM_current - (Friction_ground * W + Drag_air * V^2) * dt
      const expectedDecay = (frictionGround * top.weight + dragAir * (velocity ** 2)) * dt;
      const expectedRpm = top.rpm - expectedDecay;

      assert.strictEqual(newRpm, expectedRpm);
    });
  });

  describe('Rotational Friction', () => {
    it('should result in higher RPM loss when weight or friction increases', () => {
      const rpm = 5000;
      const velocity = 5;
      const dragAir = 0.001;
      const dt = 0.1;

      const decayBase = physics.calculateRpmDecay(rpm, 30, velocity, 0.02, dragAir, dt);
      const decayHeavier = physics.calculateRpmDecay(rpm, 50, velocity, 0.02, dragAir, dt);
      const decayHigherFriction = physics.calculateRpmDecay(rpm, 30, velocity, 0.05, dragAir, dt);

      assert.ok(decayHeavier < decayBase, 'Heavier top should lose more RPM');
      assert.ok(decayHigherFriction < decayBase, 'Higher friction should cause more RPM loss');
    });
  });

  describe('Collision Impulse Response', () => {
    it('should calculate collision impulse between two tops', () => {
      const topA = { mass: 40, momentOfInertia: 1000, velocity: 5, rpm: 7000 };
      const topB = { mass: 45, momentOfInertia: 1200, velocity: -3, rpm: 6500 };
      const restitutionCoefficient = 0.8;

      // Calculate impulse
      const impulse = physics.calculateCollisionImpulse(topA, topB, restitutionCoefficient);

      assert.ok(impulse !== undefined, 'Impulse should be calculated');
      assert.strictEqual(typeof impulse, 'number');
    });

    it('should decrease RPM of both tops after collision due to energy transfer', () => {
      const topA = { mass: 40, rpm: 7000 };
      const topB = { mass: 45, rpm: 6500 };
      const impulse = 50;

      const { rpmA, rpmB } = physics.applyCollisionEffects(topA, topB, impulse);

      assert.ok(rpmA < topA.rpm, 'Top A RPM should decrease after collision');
      assert.ok(rpmB < topB.rpm, 'Top B RPM should decrease after collision');
    });
  });
});
