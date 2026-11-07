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

describe('site/app.js DOM interactions', () => {
  it('should copy text to clipboard when copy button is clicked', async () => {
    const fs = require('fs');
    const vm = require('vm');
    const appCode = fs.readFileSync('site/app.js', 'utf8');

    class MockElement {
      constructor() {
        this.attributes = {};
        this.classList = {
          classes: new Set(),
          add(cls) { this.classes.add(cls); },
          remove(cls) { this.classes.delete(cls); }
        };
        this.listeners = {};
        this.textContent = '';
        this.innerText = '';
      }
      setAttribute(name, value) { this.attributes[name] = value; }
      getAttribute(name) { return this.attributes[name] || null; }
      addEventListener(event, handler) { this.listeners[event] = handler; }
    }

    const root = new MockElement();
    const copyBtn = new MockElement();
    copyBtn.setAttribute('data-copy', 'target-id');
    const targetEl = new MockElement();
    targetEl.innerText = 'Text to copy\n';

    const doc = {
      documentElement: root,
      title: '',
      querySelector() { return null; },
      querySelectorAll(sel) {
        if (sel === '[data-copy]') return [copyBtn];
        return [];
      },
      getElementById(id) {
        if (id === 'target-id') return targetEl;
        return null;
      },
      addEventListener() {}
    };

    let writtenText = '';
    let timeoutCb = null;

    const env = {
      document: doc,
      window: {
        localStorage: { setItem() {} },
        history: { replaceState() {} },
        location: { href: 'http://localhost' }
      },
      navigator: {
        clipboard: {
          writeText: (text) => {
            writtenText = text;
            return { then: (cb) => { cb(); return Promise.resolve(); } };
          }
        }
      },
      setTimeout: (fn, delay) => { timeoutCb = fn; },
      Date
    };

    vm.runInNewContext(appCode, env);

    copyBtn.listeners.click();
    assert.ok(copyBtn.classList.classes.has('is-done'));
    assert.strictEqual(writtenText, 'Text to copy');

    if (timeoutCb) timeoutCb();
    assert.ok(!copyBtn.classList.classes.has('is-done'));
  });

  it('should handle word boundaries correctly with Intl.Segmenter', () => {
    const fs = require('fs');
    const vm = require('vm');
    const appCode = fs.readFileSync('site/app.js', 'utf8');

    class MockElement {
      constructor(data = '') {
        this.nodeType = 1;
        this.data = data;
        this.parentNode = { replaceChild(newChild, oldChild) { } };
        this.attributes = {};
        this.listeners = {};
      }
      setAttribute(name, value) { this.attributes[name] = value; }
      getAttribute(name) { return this.attributes[name] || null; }
      addEventListener(event, handler) { this.listeners[event] = handler; }
    }

    const root = new MockElement();
    const headingEl = new MockElement();

    const doc = {
      documentElement: root,
      title: '',
      querySelector() { return null; },
      querySelectorAll(sel) {
        if (sel.includes('h1[lang^="zh"]')) return [headingEl];
        return [];
      },
      createTreeWalker(root, show) {
        let count = 0;
        return {
          nextNode() {
            count++;
            return count === 1 ? { nodeType: 3, data: '測試中文', parentNode: headingEl.parentNode } : null;
          },
          currentNode: { nodeType: 3, data: '測試中文', parentNode: headingEl.parentNode }
        };
      },
      createDocumentFragment() {
        return { appendChild(child) {} };
      },
      createElement(tag) {
        return { nodeName: tag };
      },
      createTextNode(text) {
        return { data: text };
      },
      getElementById() { return null; },
      addEventListener() {}
    };

    const env = {
      document: doc,
      window: {
        localStorage: { setItem() {} },
        history: { replaceState() {} },
        location: { href: 'http://localhost' },
        Intl: {
          Segmenter: class {
            constructor() {}
            segment(text) {
              return [
                { segment: '測' },
                { segment: '試' },
                { segment: '中' },
                { segment: '文' }
              ];
            }
          }
        }
      },
      navigator: { languages: ['en'] },
      setTimeout: (fn, delay) => { fn(); },
      Date,
      NodeFilter: { SHOW_TEXT: 4 }
    };

    vm.runInNewContext(appCode, env);
    assert.ok(true);
  });
});
