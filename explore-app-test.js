const fs = require('fs');
const code = fs.readFileSync('tests/site_app.test.js', 'utf8');
const lines = code.split('\n');
const checkLines = [[16, 17], [43, 43], [56, 56], [63, 63], [66, 66], [182, 182], [281, 287]];
for (const [start, end] of checkLines) {
  console.log(`\nLines ${start}-${end}:`);
  for (let i = start - 1; i < end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
