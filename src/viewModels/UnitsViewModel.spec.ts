import UnitsViewModel from './UnitsViewModel';

describe('cov.viewModels.UnitsViewModel', () => {
  const unitsViewModel = new UnitsViewModel();

  it('should have proper default units', () => {
    expect(unitsViewModel.locationUnit).toBe('dec');
    expect(unitsViewModel.lengthUnit).toBe('feet');
    expect(unitsViewModel.areaUnit).toBe('acres');
    expect(unitsViewModel.elevationUnit).toBe('feet');
    expect(unitsViewModel.locationUnits).toStrictEqual({
      dec: 'Decimal Degrees',
      dms: 'Degrees Minutes Seconds',
    });
    expect(unitsViewModel.lengthUnits).toStrictEqual({
      meters: 'Meters',
      feet: 'Feet',
      kilometers: 'Kilometers',
      miles: 'Miles',
      'nautical-miles': 'Nautical Miles',
      yards: 'Yards',
    });
    expect(unitsViewModel.areaUnits).toStrictEqual({
      acres: 'Acres',
      ares: 'Ares',
      hectares: 'Hectacres',
      'square-feet': 'Square Feet',
      'square-meters': 'Square Meters',
      'square-yards': 'Square Yards',
      'square-kilometers': 'Square Kilometers',
      'square-miles': 'Square Miles',
    });
    expect(unitsViewModel.elevationUnits).toStrictEqual({
      feet: 'Feet',
      meters: 'Meters',
    });
  });

  it('should return when calling select methods', () => {
    expect(unitsViewModel.locationSelect()).toBeDefined();
    expect(unitsViewModel.lengthSelect()).toBeDefined();
    expect(unitsViewModel.areaSelect()).toBeDefined();
    expect(unitsViewModel.elevationSelect()).toBeDefined();
  });

  it('should call _createUnitOptions when calling a select method', () => {
    const spy = jest.spyOn(UnitsViewModel.prototype as any, '_createUnitOptions');
    const uvm = new UnitsViewModel();
    uvm.locationSelect();
    expect(spy).toHaveBeenCalled();
  });
});
