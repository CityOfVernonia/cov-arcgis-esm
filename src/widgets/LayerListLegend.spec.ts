import LayerListLegend from './LayerListLegend';

// one off use of modules so just mock here
jest.mock('@arcgis/core/widgets/LayerList', () => {
  return jest.fn();
});
jest.mock('@arcgis/core/widgets/Legend', () => {
  return jest.fn();
});

describe('cov/widgets/LayerListLegend', () => {
  const layerListLegend = new LayerListLegend();

  it('should have default LayerList and Legend properties', () => {
    expect(layerListLegend.layerListProperties).toStrictEqual({});
    expect(layerListLegend.legendProperties).toStrictEqual({});
  });
});
