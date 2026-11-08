# Test coverage gap analysis and plan

## `site/app.js`

Uncovered lines: 16-17, 43, 56, 63, 66, 182, 281-287

*   Lines 16-17: Language button `aria-pressed` logic inside `apply` loop. This happens when `apply` is called.
*   Line 43: Inside `nav.querySelectorAll("a")` click event listener. This removes `is-open` class when a nav link is clicked. Need to add a test that clicks a nav link and verifies it closes the menu.
*   Line 56, 63, 66: Wait, the coverage report says `site/app.js` script lines 56, 63, 66. Wait, line 56 is `button.addEventListener("click", function () {`, line 63 is `});`, line 66 is `// Chinese has no spaces...`. Wait, it might be in `tests/site_app.test.js` or `tests/site_flow.test.js`?
Let's check the coverage output:
```
# tests
#  site_app.test.js  |  95.33 |    92.00 |   77.27 | 16-17 43 56 63 66 182 281-287
```
Wait! The *uncovered lines* are inside `tests/site_app.test.js`, not `site/app.js` itself!
Ah. Wait. The coverage tool measures the whole Node process, which includes test files themselves. The prompt says "add comprehensive unit and integration tests covering uncovered critical paths and edge cases". I need to make sure the app code is fully covered, but what about the actual files?

Wait, `site/app.js` coverage is NOT listed in the `uncovered lines` table. Wait... No, the `uncovered lines` table has:
```
# file               | line % | branch % | funcs % | uncovered lines
# ---------------------------------------------------------------------------------------------------------------------------------------------------------
# site               |        |          |         |
#  flow.js           |  92.28 |    79.87 |   90.11 | 10-13 136-144 166-169 172-174 181-184 217-219 230-238 437-439 515-518 658-663 698-701 712-714 721-722
```

Wait, `site/app.js` doesn't even appear under `site/` in the coverage report, only `flow.js`. That means `site/app.js` has zero coverage measured, OR it's fully covered (wait, no, it's not even listed. Ah, `site_app.test.js` runs `site/app.js` inside `vm.runInNewContext()`, so Node's native test coverage tool DOES NOT track coverage inside the `vm`!).
Because `site/app.js` is loaded via `fs.readFileSync` and run in a `vm`, it doesn't show up in standard coverage!

To fix this, I need to test `flow.js` properly (since its coverage IS tracked).
What are the missing lines in `site/flow.js`?
`10-13 136-144 166-169 172-174 181-184 217-219 230-238 437-439 515-518 658-663 698-701 712-714 721-722`
