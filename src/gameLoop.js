module.exports = {
  tick: (state) => {
    if (state.status === 'game_over') return state;
    // Optimized state update (mutating state rather than returning a completely new object every tick can be an option in engines, but we keep it immutable here yet optimized)
    return Object.assign({}, state, { tick: state.tick + 1 });
  },
};
