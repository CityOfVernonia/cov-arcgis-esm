import CalciteMeasure from './CalciteMeasure';

jest.mock('./../viewModels/MeasureViewModel', () => {
  return jest.fn();
});

describe('cov/widgets/CalciteMeasure', () => {
  const instance = new CalciteMeasure();

  it('should have default properties', () => {
    expect(instance.theme).toBe('light');
    expect(instance.widthScale).toBe('m');
    expect(instance.scale).toBe('s');
  });
});
