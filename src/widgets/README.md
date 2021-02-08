## Widgets

Widgets. See [interfaces.d.ts](./../interfaces.d.ts) for properties, methods and events.

#### `cov/widgets/CalciteMeasure`

Classic Vernonia measure in Calcite.

```typescript
import CalciteMeasure from 'cov/widgets/CalciteMeasure';

view.ui.add(
  new CalciteMeasure({ view }),
  'top-right',
);
```

#### `cov/widgets/Disclaimer`

A widget to display a disclaimer with a `Don't show me this again` option.

```typescript
import Disclaimer from 'cov/widgets/Disclaimer';

const disclaimer = new Disclaimer({
  container: document.createElement('div'),
});

document.body.append(disclaimer.container);
```

#### `cov/widgets/LayerListLegend`

A widget with tabbed Esri LayerList and Legend widgets.

```typescript
import LayerListLegend from 'cov/widgets/LayerListLegend';

view.ui.add(
  new LayerListLegend({ view }),
  'top-right',
);
```

#### `cov/widgets/MapNavigation`

A map navigation widget to replace the default zoom control, including optional compass, home, locate and fullscreen controls.

```typescript
import MapNavigation from 'cov/widgets/MapNavigation';

view.ui.empty('top-left');

view.ui.add(
  new MapNavigation({ view }),
  'top-left',
);
```

#### `cov/widgets/Measurement`

A measurement widget to measure lengths and areas, coordinates, and elevations.

```typescript
import Measure from 'cov/widgets/Measure';

view.ui.add(
  new Measure({
    view,
    elevationLayer: new ElevationLayer(), // service url or ElevationLayer instance
  }),
  'top-right',
);
```
