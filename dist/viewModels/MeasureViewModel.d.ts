/**
 * Provides logic for measuring widgets.
 */
import cov = __cov;
import Accessor from '@arcgis/core/core/Accessor';
import UnitsViewModel from './UnitsViewModel';
import Draw from '@arcgis/core/views/draw/Draw';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
export default class MeasureViewModel extends Accessor {
    view: esri.MapView;
    showText: boolean;
    color: number[];
    fillColor: number[];
    protected hasGround: boolean;
    protected state: cov.MeasureState;
    protected units: UnitsViewModel;
    protected draw: Draw;
    protected ground: esri.Ground;
    protected layer: GraphicsLayer;
    private _coordCenterHandle;
    private _coordFormatHandle;
    private _elevCenterHandle;
    private _elevFormatHandle;
    private _color;
    private _fillColor;
    constructor(properties?: cov.MeasureViewModelProperties);
    /**
     * Clear any graphics, resume paused handles and reset state.
     */
    clear(): void;
    /**
     * Start measuring length.
     */
    length(): void;
    private _length;
    /**
     * Start measuring ares.
     */
    area(): void;
    private _area;
    /**
     * Start querying location.
     */
    location(): void;
    private _location;
    /**
     * Start querying elevation.
     */
    elevation(): void;
    private _elevation;
    /**
     * Initalize.
     * @param view
     */
    private _init;
    /**
     * Intialize elevation.
     * @param view
     * @param units
     */
    private _initElevation;
    /**
     * Update state<x, y>.
     * @param point
     */
    private _setLocation;
    /**
     * Update state<z>.
     * @param point
     */
    private _setElevation;
    private _addMarker;
    private _addText;
}
