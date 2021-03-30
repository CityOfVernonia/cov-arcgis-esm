/**
 * Layout with resizable map, widget, and table containers.
 */
import cov = __cov;
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
export default class MapWidgetTable extends Widget {
    view: esri.MapView;
    featureTable: esri.FeatureTable;
    widget: esri.Widget;
    constructor(properties: cov.MapWidgetTableProperties);
    private _init;
    render(): tsx.JSX.Element;
}
