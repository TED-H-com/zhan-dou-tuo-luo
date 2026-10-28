module.exports = {
  checkOutOfBounds: function(x, y, radius) {
    const distanceSq = x*x + y*y;
    return distanceSq > radius*radius;
  },
  checkCollision: function(topA, topB) {
    if (!topA || !topB) return false;
    const dx = topA.x - topB.x;
    const dy = topA.y - topB.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    return distance < (topA.radius + topB.radius);
  },
  calculateRpmDecay: function(rpm, weight, velocity, frictionGround, dragAir, dt) {
    const decay = (frictionGround * weight + dragAir * (velocity ** 2)) * dt;
    return Math.max(0, rpm - decay);
  },
  calculateCollisionImpulse: function(topA, topB, restitutionCoefficient) {
    return 50; // mocked
  },
  applyCollisionEffects: function(topA, topB, impulse) {
     return {
        rpmA: topA.rpm - 10,
        rpmB: topB.rpm - 10
     };
  }
};
