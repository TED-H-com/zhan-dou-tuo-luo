const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');

const appCode = fs.readFileSync('site/app.js', 'utf8');

function createEnv() {
  class MockElement {
    constructor() {
      this.attributes = {};
      this.classList = {
        classes: new Set(),
        toggle(cls, force) {
          if (force === undefined) {
            if (this.classes.has(cls)) this.classes.delete(cls);
            else this.classes.add(cls);
          } else {
            if (force) this.classes.add(cls);
            else this.classes.delete(cls);
          }
        },
        remove(cls) { this.classes.delete(cls); },
        contains(cls) { return this.classes.has(cls); },
        add(cls) { this.classes.add(cls); }
      };
      this.listeners = {};
      this.textContent = '';
      this.innerText = '';
    }
    setAttribute(name, value) { this.attributes[name] = value; }
    getAttribute(name) { return this.attributes[name] || null; }
    addEventListener(event, handler) { this.listeners[event] = handler; }
    focus() {}
  }

  const root = new MockElement();
  const description = new MockElement();
  const menuBtn = new MockElement();
  const nav = new MockElement();
  nav.querySelectorAll = (sel) => {
    if (sel === 'a') return [new MockElement()];
    return [];
  };
  const langBtn = new MockElement();
  langBtn.setAttribute('data-language', 'zh');
  const yearEl = new MockElement();

  const doc = {
    documentElement: root,
    title: '',
    querySelector(sel) {
      if (sel === 'meta[name="description"]') return description;
      if (sel === '.menu-button') return menuBtn;
      if (sel === '.site-nav') return nav;
      return null;
    },
    querySelectorAll(sel) {
      if (sel === '[data-language]') return [langBtn];
      if (sel === '[data-copy]') return [];
      if (sel === 'h1[lang^="zh"], h2[lang^="zh"], h1 [lang^="zh"], h2 [lang^="zh"], .quote[lang^="zh"]') return [];
      if (sel === '[data-year]') return [yearEl];
      return [];
    },
    getElementById(id) {
      return null;
    },
    addEventListener(ev, handler) {
      this.listeners = this.listeners || {};
      this.listeners[ev] = handler;
    }
  };

  const env = {
    document: doc,
    window: {
      localStorage: { setItem() {} },
      history: { replaceState() {} },
      URL: class URL {
        constructor(url) { this.searchParams = { set() {}, delete() {} }; }
      },
      location: { href: 'http://localhost' },
      Intl: undefined
    },
    navigator: {
      clipboard: {
        writeText: (text) => ({ then: (cb) => { cb(); return Promise.resolve(); } })
      }
    },
    setTimeout: (fn, delay) => { fn(); },
    Date,
    URL: class URL {
      constructor(url) { this.searchParams = { set() {}, delete() {} }; }
    }
  };

  return { env, root, menuBtn, nav, langBtn, doc, yearEl };
}

describe('site/app.js script', () => {
  it('should toggle mobile menu when menu button is clicked', () => {
    const { env, menuBtn, nav } = createEnv();
    vm.runInNewContext(appCode, env);

    menuBtn.listeners.click();
    assert.strictEqual(menuBtn.getAttribute('aria-expanded'), 'true');
    assert.ok(nav.classList.contains('is-open'));

    menuBtn.listeners.click();
    assert.strictEqual(menuBtn.getAttribute('aria-expanded'), 'false');
    assert.ok(!nav.classList.contains('is-open'));
  });

  it('should close mobile menu on Escape key', () => {
    const { env, menuBtn, nav, doc } = createEnv();
    vm.runInNewContext(appCode, env);

    menuBtn.listeners.click(); // open it
    doc.listeners.keydown({ key: 'Escape' });
    assert.strictEqual(menuBtn.getAttribute('aria-expanded'), 'false');
    assert.ok(!nav.classList.contains('is-open'));
  });

  it('should update lang on root when language button is clicked', () => {
    const { env, root, langBtn } = createEnv();
    vm.runInNewContext(appCode, env);

    assert.strictEqual(root.getAttribute('data-lang'), 'en');

    langBtn.listeners.click();
    assert.strictEqual(root.getAttribute('data-lang'), 'zh');
    assert.strictEqual(root.lang, 'zh-Hant');
  });

  it('should set year to current year', () => {
    const { env, yearEl } = createEnv();
    vm.runInNewContext(appCode, env);

    assert.strictEqual(yearEl.textContent, String(new Date().getFullYear()));
  });
});
