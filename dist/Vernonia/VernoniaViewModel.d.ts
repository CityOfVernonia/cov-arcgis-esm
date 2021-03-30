import Accessor from '@arcgis/core/core/Accessor';
interface VernoniaViewModelProperties extends Object {
    view?: esri.MapView;
}
export default class VernoniaViewModel extends Accessor {
    view: esri.MapView;
    constructor(properties?: VernoniaViewModelProperties);
}
export {};
