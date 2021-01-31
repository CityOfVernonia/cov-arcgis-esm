import MapNavigation from './MapNavigation';

// one off use of modules so just mock here
jest.mock('@arcgis/core/widgets/Zoom/ZoomViewModel', () => {
  return jest.fn();
});
jest.mock('@arcgis/core/widgets/Home/HomeViewModel', () => {
  return jest.fn();
});
jest.mock('@arcgis/core/widgets/Locate/LocateViewModel', () => {
  return jest.fn();
});
jest.mock('@arcgis/core/widgets/Fullscreen/FullscreenViewModel', () => {
  return jest.fn();
});

describe('cov/widgets/MapNavigation', () => {
  const mapNavigation = new MapNavigation();

  it('should have default component values', () => {
    expect(mapNavigation.compass).toBe(true);
    expect(mapNavigation.home).toBe(true);
    expect(mapNavigation.locate).toBe(true);
    expect(mapNavigation.fullscreen).toBe(true);
    expect(mapNavigation.viewSwitcher).toBe(false);
  });
});
