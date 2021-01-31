## Layouts

Layout widgets. See [interfaces.d.ts](./../interfaces.d.ts) for properties and methods.

#### `cov/layouts/FullView`

A a full view layout widget with a title in the upper left corner.

```typescript
import MapView from '@arcgis/core/views/MapView';
import FullView from 'cov/layouts/FullView';

const view = new MapView(/* ... */);

const fullView = new FullView({
  view,
  title: 'My Map',
  container: document.createElement('div'),
});

document.body.append(fullView.container);
```
