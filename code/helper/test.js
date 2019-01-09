import { gennerateBinaryTree } from './';
describe('gennerateBinaryTree', () => {
  test('[3, 9, 20, null, null, 15, 7]', () => {
    expect(gennerateBinaryTree([3, 9, 20, null, null, 15, 7])).toEqual({
      val: 3,
      left: {
        val: 9
      },
      right: {
        val: 20,
        left: {
          val: 15
        },
        right: {
          val:7
        }
      }
    });
  });
});
