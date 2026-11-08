# Plan to add comprehensive unit and integration tests

## 1. Fix `site_app.test.js` coverage gaps
- Modify `site_app.test.js` to simulate a language button click that does NOT match the default, exercising the `apply` logic.
- Modify the nav link click test to test the `.querySelectorAll("a")` click listener which sets `aria-expanded` to false.
- Ensure `getElementById` returns an element during the `[data-copy]` logic to test the true branch, and check `replace(/\n$/, "")` is called.
- Ensure the `document.getElementById` and `Intl.Segmenter` tests properly cover all edges.

## 2. Fix `site_flow.test.js` coverage gaps
- Test line 10-13: Add a test calling `boot()` via simulated `DOMContentLoaded` or checking `TedFlow.renderAll`.
- Test `greedy`/`advance` complex paths (lines 136-144, 166-169, 172-174, 181-184). Simulate text wrapping edge cases involving lone words and wide characters.
- Test `wrap` with newlines (lines 230-238).
- Test layout constraints (lines 437-439, 515-518, 658-663, 698-701, 712-714, 721-722): Add tests for intersection observer, resize event / layout calculations, animation logic, and status visibility fallback.

## 3. Pre-commit
- Run `pre_commit_instructions` tool to make sure proper testing, verifications, reviews and reflections are done.

## 4. Finalize
- Ensure all tests pass.
- Commit to a new branch and submit the PR against main with title `[jules] Add e2e and integration tests for core workflows`.
