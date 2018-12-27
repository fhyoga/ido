const fs = require('fs');
let argv = process.argv[2];

// 改变已完成题的状态
fs.readdirSync('./')
  .filter(file => {
    return fs.statSync(file).isDirectory() && /active$/.test(file);
  })
  .forEach(file => {
    fs.renameSync(file, file.slice(0, -7));
  });

// 生成模版
fs.mkdirSync(`./q${argv}-active`);
fs.writeFileSync(`./q${argv}-active/index.js`, '');

fs.writeFileSync(
  `./q${argv}-active/test.js`,
  `import q${argv} from './';
describe('', () => {
  test('', () => {
    expect(q${argv}('')).toBe();
  });
})`
);
