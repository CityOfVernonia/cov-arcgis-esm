import { __decorate } from "tslib";
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { watch, whenOnce, pausable } from '@arcgis/core/core/watchUtils';
import Accessor from '@arcgis/core/core/Accessor';
import UnitsViewModel from './UnitsViewModel';
import Draw from '@arcgis/core/views/draw/Draw';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Color from '@arcgis/core/Color';
import { load as coordinateFormatterLoad, toLatitudeLongitude } from '@arcgis/core/geometry/coordinateFormatter';
import { geodesicArea, geodesicLength, simplify } from '@arcgis/core/geometry/geometryEngine';
import { webMercatorToGeographic } from '@arcgis/core/geometry/support/webMercatorUtils';
import { Point, Polygon, Polyline } from '@arcgis/core/geometry';
import { SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, TextSymbol } from '@arcgis/core/symbols';
import { midpoint } from './../support/cogo';
let MeasureViewModel = class MeasureViewModel extends Accessor {
    constructor(properties) {
        super(properties);
        this.showText = true;
        this.color = [230, 82, 64];
        this.fillColor = [230, 82, 64, 0.15];
        this.hasGround = false;
        this.state = {
            action: 'ready',
            length: 0,
            area: 0,
            x: 0,
            y: 0,
            z: 0,
        };
        this.units = new UnitsViewModel();
        this.draw = new Draw();
        this.layer = new GraphicsLayer({
            listMode: 'hide',
        });
        whenOnce(this, 'view', this._init.bind(this));
    }
    /**
     * Clear any graphics, resume paused handles and reset state.
     */
    clear() {
        const { view, draw, layer, _coordCenterHandle, _coordFormatHandle, _elevCenterHandle, _elevFormatHandle } = this;
        _coordCenterHandle.resume();
        _coordFormatHandle.resume();
        this._setLocation(view.center);
        if (_elevCenterHandle && _elevFormatHandle) {
            _elevCenterHandle.resume();
            _elevFormatHandle.resume();
            this._setElevation(view.center);
        }
        draw.reset();
        layer.removeAll();
        this.state = {
            ...this.state,
            action: 'ready',
            length: 0,
            area: 0,
        };
    }
    /**
     * Start measuring length.
     */
    length() {
        const { view, view: { spatialReference }, draw, } = this;
        this.clear();
        this.state.action = 'measuringLength';
        const action = draw.create('polyline', {
            mode: 'click',
        });
        view.focus();
        action.on(['vertex-add', 'cursor-update', 'vertex-remove', 'draw-complete'], (evt) => {
            const polyline = new Polyline({
                paths: evt.vertices,
                spatialReference,
            });
            if (evt.type === 'draw-complete') {
                this.state.action = 'length';
            }
            this._length(polyline);
        });
    }
    _length(polyline) {
        const { layer, _color, units: { lengthUnit }, showText, } = this;
        layer.removeAll();
        let length = geodesicLength(polyline, lengthUnit);
        if (length < 0) {
            const simplifiedPolyline = simplify(polyline);
            if (simplifiedPolyline) {
                length = geodesicLength(simplifiedPolyline, lengthUnit);
            }
        }
        length = Number(length.toFixed(2));
        this.state = {
            ...this.state,
            length,
        };
        // add polyline graphics
        layer.addMany([
            new Graphic({
                geometry: polyline,
                symbol: new SimpleLineSymbol({
                    cap: 'butt',
                    join: 'round',
                    color: _color,
                    width: 2,
                }),
            }),
            new Graphic({
                geometry: polyline,
                symbol: new SimpleLineSymbol({
                    style: 'dash',
                    cap: 'butt',
                    join: 'round',
                    color: 'white',
                    width: 1,
                }),
            }),
        ]);
        // add vertices graphics
        polyline.paths[0].forEach(this._addMarker.bind(this));
        // add text graphic
        if (showText) {
            this._addText(midpoint(polyline), `${this.state.length.toLocaleString()} ${lengthUnit}`);
        }
    }
    /**
     * Start measuring ares.
     */
    area() {
        const { view, view: { spatialReference }, draw, } = this;
        this.clear();
        this.state.action = 'measuringArea';
        const action = draw.create('polygon', {
            mode: 'click',
        });
        view.focus();
        action.on(['vertex-add', 'cursor-update', 'vertex-remove', 'draw-complete'], (evt) => {
            const polygon = new Polygon({
                rings: evt.vertices,
                spatialReference,
            });
            if (evt.type === 'draw-complete') {
                this.state.action = 'area';
            }
            this._area(polygon);
        });
    }
    _area(polygon) {
        const { layer, _color, _fillColor, units: { lengthUnit, areaUnit }, showText, } = this;
        layer.removeAll();
        let area = geodesicArea(polygon, areaUnit);
        if (area < 0) {
            const simplifiedPolygon = simplify(polygon);
            if (simplifiedPolygon) {
                area = geodesicArea(simplifiedPolygon, areaUnit);
            }
        }
        const length = geodesicLength(polygon, lengthUnit);
        this.state = {
            ...this.state,
            length,
            area,
        };
        layer.addMany([
            new Graphic({
                geometry: polygon,
                symbol: new SimpleFillSymbol({
                    color: _fillColor,
                    outline: {
                        cap: 'butt',
                        join: 'round',
                        color: _color,
                        width: 2,
                    },
                }),
            }),
            new Graphic({
                geometry: polygon,
                symbol: new SimpleFillSymbol({
                    color: [0, 0, 0, 0],
                    outline: {
                        style: 'dash',
                        cap: 'butt',
                        join: 'round',
                        color: 'white',
                        width: 1,
                    },
                }),
            }),
        ]);
        // add vertices graphics
        polygon.rings[0].forEach(this._addMarker.bind(this));
        // add text graphic
        if (showText) {
            this._addText(polygon.centroid, `${this.state.area.toLocaleString()} ${areaUnit}`);
        }
    }
    /**
     * Start querying location.
     */
    location() {
        const { view, view: { spatialReference }, draw, _coordCenterHandle, _coordFormatHandle, } = this;
        this.clear();
        _coordCenterHandle.pause();
        _coordFormatHandle.pause();
        this.state.action = 'queryingLocation';
        const action = draw.create('point', {});
        view.focus();
        action.on(['cursor-update', 'draw-complete'], (evt) => {
            const [x, y] = evt.coordinates;
            const point = new Point({
                x,
                y,
                spatialReference,
            });
            if (evt.type === 'draw-complete') {
                this.state.action = 'location';
            }
            this._setLocation(point);
            this._location(point);
        });
    }
    _location(point) {
        const { layer, showText } = this;
        const { x, y } = point;
        layer.removeAll();
        this._addMarker([x, y]);
        if (showText) {
            this._addText(point, `${this.state.x} ${this.state.y}`);
        }
    }
    /**
     * Start querying elevation.
     */
    elevation() {
        const { view, view: { spatialReference }, hasGround, draw, _elevCenterHandle, _elevFormatHandle, } = this;
        if (!hasGround)
            return;
        this.clear();
        _elevCenterHandle.pause();
        _elevFormatHandle.pause();
        this.state.action = 'queryingElevation';
        const action = draw.create('point', {});
        view.focus();
        action.on(['cursor-update', 'draw-complete'], (evt) => {
            const [x, y] = evt.coordinates;
            const point = new Point({
                x,
                y,
                spatialReference,
            });
            if (evt.type === 'draw-complete') {
                this.state.action = 'elevation';
            }
            this._setElevation(point);
            this._elevation(point);
        });
    }
    _elevation(point) {
        const { units: { elevationUnit }, layer, showText, } = this;
        const { x, y } = point;
        layer.removeAll();
        this._addMarker([x, y]);
        if (showText) {
            this._addText(point, `${this.state.z.toLocaleString()} ${elevationUnit}`);
        }
    }
    /**
     * Initalize.
     * @param view
     */
    _init(view) {
        const { draw, color, fillColor, layer, units } = this;
        // initialize draw and colors
        draw.view = view;
        view.map.add(layer);
        this._color = new Color(color);
        this._fillColor = new Color(fillColor);
        // initialize coordinates
        coordinateFormatterLoad();
        this._setLocation(view.center);
        this._coordCenterHandle = pausable(view, 'center', this._setLocation.bind(this));
        this._coordFormatHandle = pausable(units, 'locationUnit', this._setLocation.bind(this, view.center));
        // initialize elevation
        if (view.map.ground.layers.length) {
            this._initElevation(view, units);
        }
        else {
            watch(view, 'map.ground.layers.length', this._initElevation.bind(this, view, units));
        }
        // wire units change
        watch(units, ['lengthUnit', 'areaUnit', 'locationUnit', 'elevationUnit'], (_value, _old, updated) => {
            const { state: { action }, layer: { graphics }, } = this;
            let graphic;
            switch (updated) {
                case 'lengthUnit':
                    if (action !== 'length' && action !== 'measuringLength')
                        break;
                    graphic = graphics.find((graphic) => {
                        return graphic.geometry.type === 'polyline';
                    });
                    this._length(graphic.geometry);
                    break;
                case 'areaUnit':
                    if (action !== 'area' && action !== 'measuringArea')
                        break;
                    graphic = graphics.find((graphic) => {
                        return graphic.geometry.type === 'polygon';
                    });
                    this._area(graphic.geometry);
                    break;
                case 'locationUnit':
                    if (action !== 'location' && action !== 'queryingLocation')
                        break;
                    graphic = graphics.find((graphic) => {
                        return graphic.geometry.type === 'point';
                    });
                    this._location(graphic.geometry);
                    break;
                case 'elevationUnit':
                    if (action !== 'elevation' && action !== 'queryingElevation')
                        break;
                    graphic = graphics.find((graphic) => {
                        return graphic.geometry.type === 'point';
                    });
                    this._elevation(graphic.geometry);
                    break;
                default:
                    break;
            }
        });
    }
    /**
     * Intialize elevation.
     * @param view
     * @param units
     */
    _initElevation(view, units) {
        this.hasGround = true;
        this.ground = view.map.ground;
        this._setElevation(view.center);
        this._elevCenterHandle = pausable(view, 'center', this._setElevation.bind(this));
        this._elevFormatHandle = pausable(units, 'elevationUnit', this._setElevation.bind(this, view.center));
    }
    /**
     * Update state<x, y>.
     * @param point
     */
    _setLocation(point) {
        const { units } = this;
        if (units.locationUnit === 'dec') {
            this.state = {
                ...this.state,
                y: Number(point.latitude.toFixed(6)),
                x: Number(point.longitude.toFixed(6)),
            };
        }
        else {
            const dms = toLatitudeLongitude(webMercatorToGeographic(point), 'dms', 2);
            const index = dms.indexOf('N') !== -1 ? dms.indexOf('N') : dms.indexOf('S');
            this.state = {
                ...this.state,
                y: dms.substring(0, index + 1),
                x: dms.substring(index + 2, dms.length),
            };
        }
    }
    /**
     * Update state<z>.
     * @param point
     */
    _setElevation(point) {
        const { units } = this;
        this.ground
            .queryElevation(point)
            .then((result) => {
            const z = Number((result.geometry.z * (units.elevationUnit === 'feet' ? 3.2808399 : 1)).toFixed(2));
            this.state = {
                ...this.state,
                z,
            };
        })
            .catch(() => {
            this.state = {
                ...this.state,
                z: -99999,
            };
        });
    }
    _addMarker(coordinates) {
        const { view: { spatialReference }, layer, _color, } = this;
        const [x, y] = coordinates;
        const graphic = new Graphic({
            geometry: new Point({ x, y, spatialReference }),
            symbol: new SimpleMarkerSymbol({
                style: 'x',
                size: 8,
                outline: {
                    color: _color,
                    width: 1.5,
                },
            }),
        });
        layer.add(graphic);
    }
    _addText(geometry, text) {
        const { layer, _color } = this;
        layer.add(new Graphic({
            geometry,
            symbol: new TextSymbol({
                text,
                color: _color,
                haloColor: 'white',
                haloSize: 1,
                yoffset: 10,
                font: {
                    size: 10,
                },
            }),
        }));
    }
};
__decorate([
    property()
], MeasureViewModel.prototype, "view", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "showText", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "color", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "fillColor", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "hasGround", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "state", void 0);
__decorate([
    property({
        type: UnitsViewModel,
    })
], MeasureViewModel.prototype, "units", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "draw", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "ground", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "layer", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "_coordCenterHandle", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "_coordFormatHandle", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "_elevCenterHandle", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "_elevFormatHandle", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "_color", void 0);
__decorate([
    property()
], MeasureViewModel.prototype, "_fillColor", void 0);
MeasureViewModel = __decorate([
    subclass('cov.viewModels.MeasureViewModel')
], MeasureViewModel);
export default MeasureViewModel;
