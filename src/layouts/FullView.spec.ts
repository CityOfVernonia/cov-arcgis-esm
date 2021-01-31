import FullView from './FullView';

import MapView from '@arcgis/core/views/MapView';

describe('cov.viewModels.FullView', () => {
  const fullView = new FullView({
    view: new MapView(),
    title: 'My Map',
  });

  it('should have default title', () => {
    expect(fullView.title).toBe('City of Vernonia');
  });
});
