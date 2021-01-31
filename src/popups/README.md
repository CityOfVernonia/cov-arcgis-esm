## Popups

Popup templates for various layers.

#### `cov/popups/TaxLotPopup`

```typescript
import TaxLotPopup from 'cov/popups/TaxLotPopup';

const layer = new FeatureLayer({
  portalItem: {
    id: 'abcd1e2345',
  },
  popupTemplate: new TaxLotPopup(),
});
```
