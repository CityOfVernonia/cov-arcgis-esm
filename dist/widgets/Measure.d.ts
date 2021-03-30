/**
 * A measurement widget to measure lengths and areas, coordinates, and elevations.
 */
import cov = __cov;
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import ElevationLayer from '@arcgis/core/layers/ElevationLayer';
interface MeasureState {
    action: 'ready' | 'measuringLength' | 'measuringArea' | 'length' | 'area' | 'findingLocation' | 'location' | 'findingElevation' | 'elevation';
    length: number;
    area: number;
    latitude: number | string;
    longitude: number | string;
    elevation: number;
}
export default class Measure extends Widget {
    view: esri.MapView;
    elevationLayer: ElevationLayer;
    state: MeasureState;
    private _units;
    private _draw;
    private _layer;
    private _coordCenterHandle;
    private _coordFormatHandle;
    private _elevCenterHandle;
    private _elevFormatHandle;
    private _showTextSymbol;
    private _activeTab;
    constructor(properties: cov.MeasureProperties);
    render(): tsx.JSX.Element;
    private _createShowTextSymbolCheckbox;
    private _clear;
    private _calculateLength;
    private _polylineMidpoint;
    onHide(): void;
    private _addMarkerGraphic;
    private _addLineGraphic;
    private _addFillGraphic;
    private _addTextGraphic;
    private _measureLength;
    private _lengthEvent;
    private _measureArea;
    private _areaEvent;
    private _centerLocation;
    private _identifyLocation;
    private _locationEvent;
    private _centerElevation;
    private _identifyElevation;
    private _elevationEvent;
}
export {};
