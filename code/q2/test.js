import q2 from './';
let l1 = {
  val: 2,
  next: { val: 4, next: { val: 3, next: { val: 1, next: null } } }
};
let l2 = {
  val: 5,
  next: { val: 6, next: { val: 4, next: null } }
};
test('q2两数相加', () => {
  expect(q2(l1, l2)).toEqual({
    val: 7,
    next: { val: 0, next: { val: 8, next: { val: 1, next: null } } }
  });
});
