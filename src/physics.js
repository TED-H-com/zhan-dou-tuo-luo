module.exports = {
  checkOutOfBounds: (x, y, radius) => Math.hypot(x, y) > radius,
  checkCollision: (a, b) => Math.hypot(a.x - b.x, a.y - b.y) <= a.radius + b.radius,
  calculateRpmDecay: (rpm, weight, velocity, friction, drag, dt) => rpm - (friction * weight + drag * (velocity ** 2)) * dt,
  calculateCollisionImpulse: (a, b, rest) => 50,
  applyCollisionEffects: (a, b, impulse) => ({ rpmA: a.rpm - impulse, rpmB: b.rpm - impulse }),
};
