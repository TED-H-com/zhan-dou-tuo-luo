const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');

const langCode = fs.readFileSync('site/lang.js', 'utf8');

function createEnv(options = {}) {
  const root = {
    attributes: {},
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    lang: ''
  };

  class URLSearchParams {
    constructor(str) { this.str = str; }
    get(key) {
      if (!this.str) return null;
      const match = new RegExp('[?&]' + key + '=([^&]+)').exec(this.str);
      return match ? decodeURIComponent(match[1]) : null;
    }
  }

  const env = {
    URLSearchParams,
    window: {
      location: { search: options.search || '' },
      localStorage: {
        getItem() { return options.localStorage || null; }
      }
    },
    document: {
      documentElement: root
    },
    navigator: {
      languages: options.languages || ['en'],
      language: options.language || 'en'
    }
  };

  return { env, root };
}

describe('site/lang.js script', () => {
  it('should default to english when no preferences are set', () => {
    const { env, root } = createEnv();
    vm.runInNewContext(langCode, env);
    assert.strictEqual(root.attributes['data-lang'], 'en');
    assert.strictEqual(root.lang, 'en');
  });

  it('should pick zh if it is in browser languages', () => {
    const { env, root } = createEnv({ languages: ['zh-TW', 'en'] });
    vm.runInNewContext(langCode, env);
    assert.strictEqual(root.attributes['data-lang'], 'zh');
    assert.strictEqual(root.lang, 'zh-Hant');
  });

  it('should prioritize URL param over browser languages', () => {
    const { env, root } = createEnv({ search: '?lang=en', languages: ['zh-TW'] });
    vm.runInNewContext(langCode, env);
    assert.strictEqual(root.attributes['data-lang'], 'en');
    assert.strictEqual(root.lang, 'en');

    const { env: env2, root: root2 } = createEnv({ search: '?lang=zh-TW', languages: ['en'] });
    vm.runInNewContext(langCode, env2);
    assert.strictEqual(root2.attributes['data-lang'], 'zh');
    assert.strictEqual(root2.lang, 'zh-Hant');
  });
});
