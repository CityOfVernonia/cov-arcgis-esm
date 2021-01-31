import UnitsViewModel from './UnitsViewModel';

describe('cov.viewModels.UnitsViewModel', () => {
  const unitsViewModel = new UnitsViewModel();

  it('should have proper default units', () => {
    expect(unitsViewModel.locationUnit).toBe('dec');
    expect(unitsViewModel.lengthUnit).toBe('feet');
    expect(unitsViewModel.areaUnit).toBe('acres');
    expect(unitsViewModel.elevationUnit).toBe('feet');
  });

  it('should have select functions', () => {
    expect(unitsViewModel.locationSelect).toBeDefined();
    expect(unitsViewModel.lengthSelect).toBeDefined();
    expect(unitsViewModel.areaSelect).toBeDefined();
    expect(unitsViewModel.elevationSelect).toBeDefined();
  });
});
