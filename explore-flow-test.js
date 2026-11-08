const fs = require('fs');
const code = fs.readFileSync('tests/site_flow.test.js', 'utf8');
const lines = code.split('\n');
const checkLines = [[58, 58], [70, 70], [173, 173], [206, 206], [272, 272]];
for (const [start, end] of checkLines) {
  console.log(`\nLines ${start}-${end}:`);
  for (let i = start - 1; i < end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
