import FullView from './FullView';

import MapView from '@arcgis/core/views/MapView';

describe('cov/layouts/FullView', () => {
  const fullView = new FullView({
    view: new MapView(),
  });

  it('should have default title', () => {
    expect(fullView.title).toBe('City of Vernonia');
  });
});
