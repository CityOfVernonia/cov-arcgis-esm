import Measure from './Measure';

describe('cov/widgets/Measure', () => {
  const measure = new Measure({
    elevationLayer: 'url',
  });

  it('should have default state', () => {
    expect(measure.state).toStrictEqual({
      action: 'ready',
      length: 0,
      area: 0,
      latitude: 0,
      longitude: 0,
      elevation: 0,
    });
  });
});
