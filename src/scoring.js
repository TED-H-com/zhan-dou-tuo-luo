module.exports = {
  calculateScore: (type) => {
    if (type === 'spin') return 1;
    if (type === 'over' || type === 'burst') return 2;
    if (type === 'xtreme') return 3;
    return 0;
  },
  checkWinCondition: (score) => score >= 4,
};
