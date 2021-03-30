/**
 * A a full view layout widget with a title in the upper left corner.
 */
import cov = __cov;
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
export default class FullView extends Widget {
    view: esri.MapView | esri.SceneView;
    title: string;
    constructor(properties: cov.FullViewProperties);
    private _init;
    render(): tsx.JSX.Element;
}
