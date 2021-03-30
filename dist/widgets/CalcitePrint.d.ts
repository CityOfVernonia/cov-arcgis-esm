/**
 * Simple print widget in calcite (not production ready).
 */
import cov = __cov;
import '@esri/calcite-components';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
export default class CalcitePrint extends Widget {
    /**
     * Constructor properties.
     */
    view: esri.MapView | esri.SceneView;
    printServiceUrl: string;
    printTitle: string;
    /**
     * Widget properties.
     */
    private _printer;
    private _titleInput;
    private _layoutSelect;
    private _formatSelect;
    private _results;
    constructor(properties: cov.CalcitePrintProperties);
    private _createSelects;
    private _createResults;
    private _print;
    render(): tsx.JSX.Element;
}
