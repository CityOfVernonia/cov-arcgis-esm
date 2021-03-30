/**
 * A widget with tabbed Esri LayerList and Legend widgets.
 */
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
export default class LayerListLegend extends Widget {
    view: esri.MapView | esri.SceneView;
    layerListProperties: esri.LayerListProperties;
    legendProperties: esri.LegendProperties;
    private _activeTab;
    render(): tsx.JSX.Element;
}
