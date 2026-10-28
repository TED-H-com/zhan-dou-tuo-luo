module.exports = {
  calculateScore: function(type) {
    const validScores = {
        'spin': 1,
        'over': 2,
        'burst': 2,
        'xtreme': 3
    };
    if (typeof type !== 'string') return 0;
    if (!(type in validScores)) return 0;
    return validScores[type];
  },
  checkWinCondition: function(score) {
    if (typeof score !== 'number' || score < 0) return false;
    return score >= 4;
  }
};
