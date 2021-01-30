import UnitsViewModel from './UnitsViewModel';

jest.mock('@arcgis/core/core/Accessor');
jest.mock('@arcgis/core/core/accessorSupport/decorators');

describe('cov.viewModels.UnitsViewModel', () => {
  const unitsViewModel = new UnitsViewModel();

  it('should have proper default units', () => {
    expect(unitsViewModel.locationUnit).toBe('dec');
    expect(unitsViewModel.lengthUnit).toBe('feet');
    expect(unitsViewModel.areaUnit).toBe('acres');
    expect(unitsViewModel.elevationUnit).toBe('feet');
  });
});
