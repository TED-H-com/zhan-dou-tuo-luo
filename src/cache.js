const cacheData = new Map();
module.exports = {
  getComboStats: (key) => {
    // Optimized caching logic
    let stat = cacheData.get(key);
    if (stat === undefined) {
      stat = { attack: 10, stamina: 20 };
      cacheData.set(key, stat);
    }
    return stat;
  }
};
