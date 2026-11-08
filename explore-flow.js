const fs = require('fs');
const code = fs.readFileSync('site/flow.js', 'utf8');
const lines = code.split('\n');

const checkLines = [
  [10, 13],
  [136, 144],
  [166, 169],
  [172, 174],
  [181, 184],
  [217, 219],
  [230, 238],
  [437, 439],
  [515, 518],
  [658, 663],
  [698, 701],
  [712, 714],
  [721, 722]
];

for (const [start, end] of checkLines) {
  console.log(`\nLines ${start}-${end}:`);
  for (let i = start - 1; i < end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
