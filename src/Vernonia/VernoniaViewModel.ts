import Accessor from '@arcgis/core/core/Accessor';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';

interface VernoniaViewModelProperties extends Object {
  view?: esri.MapView;
}

@subclass('cov.Vernonia.VernoniaViewModel')
export default class VernoniaViewModel extends Accessor {
  @property()
  view!: esri.MapView;

  constructor(properties?: VernoniaViewModelProperties) {
    super(properties);
  }
}
