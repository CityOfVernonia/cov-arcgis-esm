import MadeWith from './MadeWith';

describe('cov/widgets/MadeWith', () => {
  const madeWith = new MadeWith();

  it('should have default properties', () => {
    expect(madeWith.size).toBe('14px');
    expect(madeWith.color).toBe('#000000');
    expect(madeWith.backgroundColor).toBe('#FFFFFF');
    expect(madeWith.opacity).toBe(0.6);
  });
});
