const { describe, it } = require('node:test');
const assert = require('node:assert');
const TedFlow = require('../site/flow.js');

describe('site/flow.js module', () => {
  it('should correctly calculate status at given elapsed time', () => {
    // Tests statusAt(elapsed, count)
    const res1 = TedFlow.statusAt(0, 0);
    assert.deepStrictEqual(res1, { index: 0, opacity: 0, span: TedFlow.STATUS.fade + TedFlow.STATUS.hold + TedFlow.STATUS.out + TedFlow.STATUS.gap, local: 0 });

    const res2 = TedFlow.statusAt(100, 1);
    assert.deepStrictEqual(res2, { index: 0, opacity: 1, span: TedFlow.STATUS.fade + TedFlow.STATUS.hold + TedFlow.STATUS.out + TedFlow.STATUS.gap, local: 0 });

    const res3 = TedFlow.statusAt(0, 3);
    assert.strictEqual(res3.index, 0);
    assert.strictEqual(res3.opacity, 0);

    const span = TedFlow.STATUS.fade + TedFlow.STATUS.hold + TedFlow.STATUS.out + TedFlow.STATUS.gap;
    const res4 = TedFlow.statusAt(span + 10, 3);
    assert.strictEqual(res4.index, 1);
  });

  it('should correctly tokenize strings', () => {
    const tokens1 = TedFlow.tokenise('Hello world');
    assert.deepStrictEqual(tokens1, ['Hello', ' ', 'world']);

    const tokens2 = TedFlow.tokenise('中文測試');
    assert.deepStrictEqual(tokens2, ['中', '文', '測', '試']);

    const tokens3 = TedFlow.tokenise('Mixed 中文 test');
    assert.deepStrictEqual(tokens3, ['Mixed', ' ', '中', '文', ' ', 'test']);
  });

  it('should export list of icon names correctly', () => {
    const icons = TedFlow.iconNames;
    assert.ok(Array.isArray(icons));
    assert.ok(icons.includes('chat'));
    assert.ok(icons.includes('hub'));
    assert.ok(icons.includes('shield'));
  });
});

  it('draw and render logic', () => {
    // Tests branches with edges, wires, meters, multiple texts, multiple boxes, multiple columns
    const mockFig = {
      nodeType: 1,
      getAttribute(name) {
        if (name === 'data-fd') return JSON.stringify({
          columns: [[0], [1]],
          sinks: [2],
          lanes: ['L1'],
          core: 0,
          meter: true,
          tickCount: 2,
          boundaryAfter: 0,
          loop: true
        });
        return null;
      },
      querySelectorAll(sel) {
        if (sel === ':scope > .fd-legend > .fd-node') {
          return [
            { getAttribute(a) { return a === 'data-tone' ? 'accent' : (a==='data-step'? '0' : null); }, querySelector(s) { if (s === '.fd-title') return { childNodes: [{nodeType: 3, data: 'Node 0'}], getAttribute(){}, textContent: 'Node 0' }; if (s === '.fd-note') return { childNodes: [{nodeType: 3, data: 'Note 0'}], getAttribute(){}, textContent: 'Note 0' }; if (s === '.fd-chip') return { appendChild() {}, querySelector() { return null; } }; return null; } },
            { getAttribute(a) { return a === 'data-tone' ? 'neutral' : (a==='data-step'? '1' : null); }, querySelector(s) { if (s === '.fd-title') return { childNodes: [{nodeType: 3, data: 'Node 1'}], getAttribute(){}, textContent: 'Node 1' }; return null; } },
            { getAttribute(a) { return a === 'data-tone' ? 'neutral' : (a==='data-step'? '2' : null); }, querySelector(s) { if (s === '.fd-title') return { childNodes: [{nodeType: 3, data: 'Node 2'}], getAttribute(){}, textContent: 'Node 2' }; return null; } }
          ];
        }
        if (sel === ':scope > .fd-ticks > li') return [{ textContent: 'Tick 1' }, { textContent: 'Tick 2' }];
        if (sel === ':scope > .fd-zones > li') return [{ textContent: 'Zone 1' }, { textContent: 'Zone 2' }, { textContent: 'Zone 3' }];
        return [];
      },
      querySelector(sel) {
        if (sel === ':scope > .fd-svg') return { remove() {} };
        return null;
      },
      classList: { add() {}, toggle() {}, contains() { return false; } },
      insertBefore() {},
      appendChild() {},
      __fdLive: false
    };

    global.document = {
      createElementNS(ns, name) {
        return {
          nodeName: name,
          setAttribute() {},
          appendChild() {},
          classList: { add() {}, remove() {}, toggle() {} },
          querySelectorAll() { return []; },
          querySelector() { return null; },
          addEventListener() {},
          textContent: '',
          remove() {}
        };
      },
      createElement(name) {
        return {
          nodeName: name,
          setAttribute() {},
          appendChild() {},
          classList: { add() {}, remove() {}, toggle() {} },
          querySelectorAll() { return []; },
          querySelector() { return null; },
          addEventListener() {},
          textContent: '',
          remove() {}
        };
      }
    };

    global.window = { matchMedia() { return { matches: false }; } };
    global.IntersectionObserver = class { constructor(){} observe(){} };
    global.requestAnimationFrame = (cb) => cb();

    assert.doesNotThrow(() => {
      TedFlow.render(mockFig);
    });

    delete global.document;
    delete global.window;
    delete global.IntersectionObserver;
    delete global.requestAnimationFrame;
  });

  it('advance', () => {
    assert.strictEqual(Math.round(TedFlow.advance('a', 10) * 10), 56);
    assert.strictEqual(Math.round(TedFlow.advance(' ', 10) * 10), 28);
    assert.strictEqual(Math.round(TedFlow.advance('中', 10) * 10), 100);
  });

  it('wrap', () => {
    const lines = TedFlow.wrap('abc def', 10, 20);
    assert.ok(Array.isArray(lines));
  });

  it('textWithBreaks', () => {
    const mockNode = {
      childNodes: [
        { nodeType: 3, data: 'hello ' },
        { nodeType: 1, nodeName: 'BR' },
        { nodeType: 3, data: ' world' },
        { nodeType: 1, nodeName: 'SPAN', childNodes: [{ nodeType: 3, data: '!' }] }
      ]
    };
    assert.strictEqual(TedFlow.textWithBreaks(mockNode), "hello\nworld!");
  });

  it('statusVisible', () => {
    const res = TedFlow.statusVisible(100, 3);
    assert.strictEqual(res.length, 3);
  });

  it('plan', () => {
    const spec = {
      columns: [[0, 1], [2]],
      sinks: [3],
      lanes: ['Lane 1', 'Lane 2'],
      core: 1,
      selectedLane: 0
    };
    const titles = ['Title 0', 'Title 1', 'Title 2', 'Title 3'];
    const notes = ['', 'Note 1', '', ''];
    const tones = ['neutral', 'accent', 'neutral', 'neutral'];
    const p = TedFlow.plan(spec, titles, notes, tones);
    assert.ok(p.boxes.length > 0);
  });

  it('draw with error path', () => {
    const mockFig = {
      nodeType: 1,
      getAttribute(name) {
        if (name === 'data-fd') return "invalid json";
        return null;
      }
    };
    TedFlow.render(mockFig);
  });

  it('avoidLone / edge cases', () => {
    const wrapped = TedFlow.wrap("測試 lone word wrapper with some extremelylongunbreakabletext", 10, 20);
    assert.ok(wrapped.length > 0);
    const mark = TedFlow.wrap("測試，", 10, 20);
    assert.ok(mark.length > 0);
  });

  it('frozenAt logic', () => {
    const mockScope = {
      querySelectorAll(sel) { return sel === 'figure.fd' ? [{ nodeType: 1, getAttribute(){return null;} }] : []; }
    };
    TedFlow.renderAll(mockScope);
  });

  it('frozenAt logic when param present', () => {
    const oldLocation = global.location;
    global.location = { search: '?fd-at=150' };
    const oldURLSearchParams = global.URLSearchParams;
    global.URLSearchParams = class {
      constructor(str) { this.str = str; }
      get(k) { return k === 'fd-at' ? '150' : null; }
    };

    const mockFig = {
      nodeType: 1,
      getAttribute(name) {
        if (name === 'data-fd') return JSON.stringify({ columns: [[0]], core: 0, tickCount: 2 });
        return null;
      },
      querySelectorAll(sel) {
        if (sel === ':scope > .fd-ticks > li') return [{ textContent: 'Tick 1' }, { textContent: 'Tick 2' }];
        return [];
      },
      querySelector(sel) {
        if (sel === ':scope > .fd-svg') return { remove() {} };
        return null;
      },
      classList: { add() {}, toggle() {} },
      insertBefore() {},
      appendChild() {},
      __fdLive: false
    };

    global.document = {
      createElementNS(ns, name) {
        return {
          nodeName: name,
          setAttribute() {},
          appendChild() {},
          classList: { add() {}, remove() {}, toggle() {} },
          querySelectorAll() { return []; },
          querySelector() { return null; },
          addEventListener() {},
          textContent: '',
          remove() {}
        };
      },
      createElement(name) {
        return {
          nodeName: name,
          setAttribute() {},
          appendChild() {},
          classList: { add() {}, remove() {}, toggle() {} },
          querySelectorAll() { return []; },
          querySelector() { return null; },
          addEventListener() {},
          textContent: '',
          remove() {}
        };
      }
    };
    global.window = { matchMedia() { return { matches: false }; } };
    global.IntersectionObserver = class { constructor(){} observe(){} };
    global.requestAnimationFrame = (cb) => cb();

    TedFlow.render(mockFig);
    global.location = oldLocation;
    global.URLSearchParams = oldURLSearchParams;

    delete global.document;
    delete global.window;
    delete global.IntersectionObserver;
    delete global.requestAnimationFrame;
  });

  it('reduced motion and animation logic', () => {
    global.window = {
      matchMedia() { return { matches: true }; }
    };
    const mockFig = {
      nodeType: 1,
      getAttribute(name) {
        if (name === 'data-fd') return JSON.stringify({ columns: [[0]], core: 0 });
        return null;
      },
      querySelectorAll() { return []; },
      querySelector(sel) {
        if (sel === ':scope > .fd-svg') return { querySelector() { return { addEventListener(ev, cb) { cb({ animationName: 'fd-tick', target: this }); } }; }, remove() {} };
        if (sel === ':scope > .fd-status') return { addEventListener(ev, cb) { cb({ animationName: 'fd-tick', target: this }); } };
        return null;
      },
      classList: { add() {}, toggle() {} },
      insertBefore() {},
      appendChild() {},
      __fdLive: false
    };

    global.document = {
      createElementNS(ns, name) {
        return {
          nodeName: name,
          setAttribute() {},
          appendChild() {},
          classList: { add() {}, remove() {}, toggle() {} },
          querySelectorAll() { return []; },
          querySelector() { return null; },
          addEventListener() {},
          textContent: '',
          remove() {}
        };
      },
      createElement(name) {
        return {
          nodeName: name,
          setAttribute() {},
          appendChild() {},
          classList: { add() {}, remove() {}, toggle() {} },
          querySelectorAll() { return []; },
          querySelector() { return null; },
          addEventListener() {},
          textContent: '',
          remove() {}
        };
      }
    };
    global.IntersectionObserver = class { constructor(){} observe(){} };

    TedFlow.render(mockFig);

    delete global.document;
    delete global.window;
    delete global.IntersectionObserver;
  });
