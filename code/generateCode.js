const fs = require('fs');
let argv = process.argv[2];

fs.mkdirSync(`./q${argv}`);
fs.writeFileSync(`./q${argv}/index.js`, '');

fs.writeFileSync(
  `./q${argv}/test.js`,
  `import q${argv} from './';
describe('', () => {
  test('', () => {
    expect(q${argv}('')).toBe();
  });
})`
);
