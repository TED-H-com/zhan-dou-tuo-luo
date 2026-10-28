module.exports = {
  tick: function(state) {
    if (!state) throw new Error('State cannot be null or undefined');
    if (typeof state.tick !== 'number' || state.tick < 0) {
       state.tick = 0;
    }
    const validStatuses = ['playing', 'game_over', 'paused'];
    if (!validStatuses.includes(state.status)) {
        state.status = 'playing';
    }
    if (state.status === 'game_over') {
        return state;
    }
    state.tick += 1;
    return state;
  }
};
