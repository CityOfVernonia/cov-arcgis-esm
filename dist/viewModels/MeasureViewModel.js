"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const watchUtils_1 = require("@arcgis/core/core/watchUtils");
const Accessor_1 = tslib_1.__importDefault(require("@arcgis/core/core/Accessor"));
const UnitsViewModel_1 = tslib_1.__importDefault(require("./UnitsViewModel"));
const Draw_1 = tslib_1.__importDefault(require("@arcgis/core/views/draw/Draw"));
const Graphic_1 = tslib_1.__importDefault(require("@arcgis/core/Graphic"));
const GraphicsLayer_1 = tslib_1.__importDefault(require("@arcgis/core/layers/GraphicsLayer"));
const Color_1 = tslib_1.__importDefault(require("@arcgis/core/Color"));
const coordinateFormatter_1 = require("@arcgis/core/geometry/coordinateFormatter");
const geometryEngine_1 = require("@arcgis/core/geometry/geometryEngine");
const webMercatorUtils_1 = require("@arcgis/core/geometry/support/webMercatorUtils");
const geometry_1 = require("@arcgis/core/geometry");
const symbols_1 = require("@arcgis/core/symbols");
const cogo_1 = require("./../support/cogo");
let MeasureViewModel = class MeasureViewModel extends Accessor_1.default {
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
        this.units = new UnitsViewModel_1.default();
        this.draw = new Draw_1.default();
        this.layer = new GraphicsLayer_1.default({
            listMode: 'hide',
        });
        watchUtils_1.whenOnce(this, 'view', this._init.bind(this));
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
            const polyline = new geometry_1.Polyline({
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
        let length = geometryEngine_1.geodesicLength(polyline, lengthUnit);
        if (length < 0) {
            const simplifiedPolyline = geometryEngine_1.simplify(polyline);
            if (simplifiedPolyline) {
                length = geometryEngine_1.geodesicLength(simplifiedPolyline, lengthUnit);
            }
        }
        length = Number(length.toFixed(2));
        this.state = {
            ...this.state,
            length,
        };
        // add polyline graphics
        layer.addMany([
            new Graphic_1.default({
                geometry: polyline,
                symbol: new symbols_1.SimpleLineSymbol({
                    cap: 'butt',
                    join: 'round',
                    color: _color,
                    width: 2,
                }),
            }),
            new Graphic_1.default({
                geometry: polyline,
                symbol: new symbols_1.SimpleLineSymbol({
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
            this._addText(cogo_1.midpoint(polyline), `${this.state.length.toLocaleString()} ${lengthUnit}`);
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
            const polygon = new geometry_1.Polygon({
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
        let area = geometryEngine_1.geodesicArea(polygon, areaUnit);
        if (area < 0) {
            const simplifiedPolygon = geometryEngine_1.simplify(polygon);
            if (simplifiedPolygon) {
                area = geometryEngine_1.geodesicArea(simplifiedPolygon, areaUnit);
            }
        }
        const length = geometryEngine_1.geodesicLength(polygon, lengthUnit);
        this.state = {
            ...this.state,
            length,
            area,
        };
        layer.addMany([
            new Graphic_1.default({
                geometry: polygon,
                symbol: new symbols_1.SimpleFillSymbol({
                    color: _fillColor,
                    outline: {
                        cap: 'butt',
                        join: 'round',
                        color: _color,
                        width: 2,
                    },
                }),
            }),
            new Graphic_1.default({
                geometry: polygon,
                symbol: new symbols_1.SimpleFillSymbol({
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
            const point = new geometry_1.Point({
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
            const point = new geometry_1.Point({
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
        this._color = new Color_1.default(color);
        this._fillColor = new Color_1.default(fillColor);
        // initialize coordinates
        coordinateFormatter_1.load();
        this._setLocation(view.center);
        this._coordCenterHandle = watchUtils_1.pausable(view, 'center', this._setLocation.bind(this));
        this._coordFormatHandle = watchUtils_1.pausable(units, 'locationUnit', this._setLocation.bind(this, view.center));
        // initialize elevation
        if (view.map.ground.layers.length) {
            this._initElevation(view, units);
        }
        else {
            watchUtils_1.watch(view, 'map.ground.layers.length', this._initElevation.bind(this, view, units));
        }
        // wire units change
        watchUtils_1.watch(units, ['lengthUnit', 'areaUnit', 'locationUnit', 'elevationUnit'], (_value, _old, updated) => {
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
        this._elevCenterHandle = watchUtils_1.pausable(view, 'center', this._setElevation.bind(this));
        this._elevFormatHandle = watchUtils_1.pausable(units, 'elevationUnit', this._setElevation.bind(this, view.center));
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
            const dms = coordinateFormatter_1.toLatitudeLongitude(webMercatorUtils_1.webMercatorToGeographic(point), 'dms', 2);
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
        const graphic = new Graphic_1.default({
            geometry: new geometry_1.Point({ x, y, spatialReference }),
            symbol: new symbols_1.SimpleMarkerSymbol({
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
        layer.add(new Graphic_1.default({
            geometry,
            symbol: new symbols_1.TextSymbol({
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
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "view", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "showText", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "color", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "fillColor", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "hasGround", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "state", void 0);
tslib_1.__decorate([
    decorators_1.property({
        type: UnitsViewModel_1.default,
    })
], MeasureViewModel.prototype, "units", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "draw", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "ground", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "layer", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "_coordCenterHandle", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "_coordFormatHandle", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "_elevCenterHandle", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "_elevFormatHandle", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "_color", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MeasureViewModel.prototype, "_fillColor", void 0);
MeasureViewModel = tslib_1.__decorate([
    decorators_1.subclass('cov.viewModels.MeasureViewModel')
], MeasureViewModel);
exports.default = MeasureViewModel;
