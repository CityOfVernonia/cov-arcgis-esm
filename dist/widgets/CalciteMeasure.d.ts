/**
 * Classic Vernonia measure in Calcite.
 */
import cov = __cov;
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import '@esri/calcite-components';
import MeasureViewModel from './../viewModels/MeasureViewModel';
export default class CalciteMeasure extends Widget {
    /**
     * Constructor properties.
     */
    view: esri.MapView;
    theme: string;
    widthScale: string;
    scale: string;
    showText: boolean;
    color: any;
    fillColor: any;
    /**
     * Public widget properties.
     */
    viewModel: MeasureViewModel;
    protected state: cov.MeasureState;
    protected units: cov.UnitsViewModel;
    protected hasGround: boolean;
    /**
     * View model methods called by the widget.
     */
    clear(): void;
    length(): void;
    area(): void;
    elevation(): void;
    location(): void;
    /**
     * Wire swich change to showText.
     * @param _switch
     */
    private _showTextHandle;
    /**
     * Wire units change to units<unit>.
     * @param type
     * @param select
     */
    private _unitChangeHandle;
    render(): tsx.JSX.Element;
    /**
     * tsx helpers.
     */
    private _createUnitOptions;
    private _createMeasureResut;
}
