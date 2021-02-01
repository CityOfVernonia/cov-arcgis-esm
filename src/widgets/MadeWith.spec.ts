import MadeWith from './MadeWith';

describe('cov/widgets/MadeWith', () => {
  const madeWith = new MadeWith();

  it('should have default properties', () => {
    expect(madeWith.color).toBe('#000000');
    expect(madeWith.size).toBe('16px');
  });
});
