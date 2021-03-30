/**
 * A measurement widget to measure lengths and areas, coordinates, and elevations.
 */
import { __decorate } from "tslib";
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx, renderable } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import UnitsViewModel from './../viewModels/UnitsViewModel';
import { pausable, watch, whenDefinedOnce } from '@arcgis/core/core/watchUtils';
import { Point, Polyline, Polygon } from '@arcgis/core/geometry';
import { SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol } from '@arcgis/core/symbols';
import Draw from '@arcgis/core/views/draw/Draw';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import ElevationLayer from '@arcgis/core/layers/ElevationLayer';
import { load as coordinateFormatterLoad, toLatitudeLongitude } from '@arcgis/core/geometry/coordinateFormatter';
import { geodesicArea, geodesicLength, simplify } from '@arcgis/core/geometry/geometryEngine';
import { webMercatorToGeographic } from '@arcgis/core/geometry/support/webMercatorUtils';
const CSS = {
    base: 'esri-widget cov-measure',
    tabs: 'cov-tabs',
    tabsContentWrapper: 'cov-tabs--content-wrapper',
    tabsContent: 'cov-tabs--content',
    tabsContentNoPadding: 'cov-tabs--content_no-padding',
    formRow: 'cov-form--row',
    formControl: 'cov-form--control',
    button: 'esri-button',
    select: 'esri-select',
    checkboxInput: 'cov-measure--checkbox-input',
    checked: 'esri-icon-checkbox-checked',
    unchecked: 'esri-icon-checkbox-unchecked',
    result: 'cov-measure--result',
};
const SYMBOL = {
    width: 4,
    opacity: 0.2,
    size: 12,
    primary: [73, 80, 87],
    secondary: [255, 255, 255],
};
let KEY = 0;
let Measure = class Measure extends Widget {
    constructor(properties) {
        super(properties);
        this.state = {
            action: 'ready',
            length: 0,
            area: 0,
            latitude: 0,
            longitude: 0,
            elevation: 0,
        };
        this._units = new UnitsViewModel();
        this._draw = new Draw();
        this._layer = new GraphicsLayer({
            listMode: 'hide',
        });
        this._showTextSymbol = false;
        this._activeTab = 'data-tab-0';
        whenDefinedOnce(this, 'view', (view) => {
            this._draw.view = view;
            view.map.add(this._layer);
            // coordinate handling
            coordinateFormatterLoad();
            this._centerLocation(view.center);
            this._coordCenterHandle = pausable(view, 'center', this._centerLocation.bind(this));
            this._coordFormatHandle = pausable(this._units, 'locationUnit', this._centerLocation.bind(this, view.center));
            // elevation handling
            if (typeof this.elevationLayer === 'string') {
                this.elevationLayer = new ElevationLayer({
                    url: this.elevationLayer,
                });
            }
            this._centerElevation(view.center);
            this._elevCenterHandle = pausable(view, 'center', this._centerElevation.bind(this));
            this._elevFormatHandle = pausable(this, 'elevationUnit', this._centerElevation.bind(this, view.center));
            // wire up units change events
            watch(this._units, ['lengthUnit', 'areaUnit', 'locationUnit'], (value, old, name) => {
                const state = this.state;
                const graphics = this._layer.graphics;
                let geometry;
                if (name === 'lengthUnit' && (state.action === 'length' || state.action === 'measuringLength')) {
                    geometry = graphics.getItemAt(graphics.length - 2).geometry;
                    this._lengthEvent({
                        vertices: geometry.paths,
                    });
                }
                if ((name === 'areaUnit' || name === 'lengthUnit') &&
                    (state.action === 'area' || state.action === 'measuringArea')) {
                    geometry = graphics.getItemAt(graphics.length - 4).geometry;
                    this._areaEvent({
                        vertices: geometry.rings[0],
                    });
                }
                if (name === 'locationUnit' && (state.action === 'location' || state.action === 'findingLocation')) {
                    geometry = graphics.getItemAt(graphics.length - 1).geometry;
                    this._locationEvent({
                        vertices: [[geometry.x, geometry.y]],
                    });
                }
                if (name === 'elevationUnit' && (state.action === 'elevation' || state.action === 'findingElevation')) {
                    geometry = graphics.getItemAt(graphics.length - 1).geometry;
                    this._elevationEvent({
                        vertices: [[geometry.x, geometry.y]],
                    });
                }
            });
        });
    }
    render() {
        const { state, _units: units } = this;
        let measureResult;
        switch (state.action) {
            case 'measuringLength':
            case 'length':
                measureResult = (tsx("div", { class: CSS.result },
                    tsx("p", null,
                        tsx("b", null, "Length:"),
                        " ",
                        state.length.toLocaleString(),
                        " ",
                        units.lengthUnit),
                    tsx("button", { class: CSS.button, bind: this, onclick: this._clear, style: "width:auto;" }, "Clear")));
                break;
            case 'measuringArea':
            case 'area':
                measureResult = (tsx("div", { class: CSS.result },
                    tsx("p", { key: KEY++ },
                        tsx("b", null, "Area:"),
                        " ",
                        state.area.toLocaleString(),
                        " ",
                        units.areaUnit),
                    tsx("p", { key: KEY++ },
                        tsx("b", null, "Perimeter:"),
                        " ",
                        state.length.toLocaleString(),
                        " ",
                        units.lengthUnit),
                    tsx("button", { class: CSS.button, bind: this, onclick: this._clear, style: "width:auto;" }, "Clear")));
                break;
            case 'ready':
            default:
                measureResult = tsx("div", { class: CSS.result }, "Select a measure tool");
                break;
        }
        return (tsx("div", { class: CSS.base },
            tsx("ul", { class: CSS.tabs, role: "tablist" },
                tsx("li", { "data-tab-0": true, id: `${this.id}_tab_0`, "aria-selected": this._activeTab === 'data-tab-0' ? 'true' : 'false', bind: this, onclick: () => {
                        this._activeTab = 'data-tab-0';
                        this._clear();
                    } }, "Measure"),
                tsx("li", { "data-tab-1": true, id: `${this.id}_tab_1`, "aria-selected": this._activeTab === 'data-tab-1' ? 'true' : 'false', bind: this, onclick: () => {
                        this._activeTab = 'data-tab-1';
                        this._clear();
                    } }, "Location"),
                tsx("li", { "data-tab-1": true, id: `${this.id}_tab_2`, "aria-selected": this._activeTab === 'data-tab-2' ? 'true' : 'false', bind: this, onclick: () => {
                        this._activeTab = 'data-tab-2';
                        this._clear();
                    } }, "Elevation")),
            tsx("main", { class: CSS.tabsContentWrapper },
                tsx("section", { class: CSS.tabsContent, "aria-labelledby": `${this.id}_tab_0`, role: "tabcontent", style: `display:${this._activeTab === 'data-tab-0' ? 'block' : 'none'}` },
                    tsx("div", { class: CSS.formRow },
                        tsx("div", { class: CSS.formControl },
                            tsx("button", { class: CSS.button, title: "Measure Length", bind: this, onclick: this._measureLength }, "Length")),
                        tsx("div", { class: CSS.formControl }, units.lengthSelect(null, 'Select Length Unit'))),
                    tsx("div", { class: CSS.formRow },
                        tsx("div", { class: CSS.formControl },
                            tsx("button", { class: CSS.button, title: "Measure Area", bind: this, onclick: this._measureArea }, "Area")),
                        tsx("div", { class: CSS.formControl }, units.areaSelect(null, 'Select Area Unit'))),
                    this._createShowTextSymbolCheckbox(),
                    measureResult),
                tsx("section", { class: CSS.tabsContent, "aria-labelledby": `${this.id}_tab_1`, role: "tabcontent", style: `display:${this._activeTab === 'data-tab-1' ? 'block' : 'none'}` },
                    tsx("div", { class: CSS.formRow },
                        tsx("div", { class: CSS.formControl },
                            tsx("button", { class: CSS.button, title: "Identify Location", bind: this, onclick: this._identifyLocation }, "Spot Location")),
                        tsx("div", { class: CSS.formControl }, units.locationSelect(null, 'Select Coordinate Unit'))),
                    this._createShowTextSymbolCheckbox(),
                    tsx("div", { class: CSS.result },
                        tsx("p", null,
                            tsx("b", null, "Latitude:"),
                            " ",
                            state.latitude),
                        tsx("p", null,
                            tsx("b", null, "Longitude"),
                            " ",
                            state.longitude),
                        state.action === 'findingLocation' || state.action === 'location' ? (tsx("button", { class: CSS.button, bind: this, onclick: this._clear, style: "width:auto;" }, "Clear")) : null)),
                tsx("section", { class: CSS.tabsContent, "aria-labelledby": `${this.id}_tab_2`, role: "tabcontent", style: `display:${this._activeTab === 'data-tab-2' ? 'block' : 'none'}` },
                    tsx("div", { class: CSS.formRow },
                        tsx("div", { class: CSS.formControl },
                            tsx("button", { class: CSS.button, title: "Identify Elevation", bind: this, onclick: this._identifyElevation }, "Spot Elevation")),
                        tsx("div", { class: CSS.formControl }, units.elevationSelect(null, 'Select Elevation Unit'))),
                    this._createShowTextSymbolCheckbox(),
                    tsx("div", { class: CSS.result },
                        tsx("p", null,
                            tsx("b", null, "Elevation:"),
                            " ",
                            state.elevation.toLocaleString(),
                            " ",
                            this._units.elevationUnit),
                        state.action === 'findingElevation' || state.action === 'elevation' ? (tsx("button", { class: CSS.button, bind: this, onclick: this._clear, style: "width:auto;" }, "Clear")) : null)))));
    }
    // create show text symbol checkbox
    _createShowTextSymbolCheckbox() {
        return (tsx("div", { key: KEY++, class: CSS.formRow },
            tsx("label", { class: CSS.checkboxInput },
                tsx("span", { role: "checkbox", "aria-checked": this._showTextSymbol, class: this._showTextSymbol ? CSS.checked : CSS.unchecked, bind: this, onclick: () => {
                        this._showTextSymbol = !this._showTextSymbol;
                    } }),
                "Show measurement text")));
    }
    // --------------------------------------------------------------------------
    //
    //    helpers
    //
    // --------------------------------------------------------------------------
    // clear/reset any active actions, graphics layer, etc
    _clear() {
        this._coordCenterHandle.resume();
        this._coordFormatHandle.resume();
        this._elevCenterHandle.resume();
        this._elevFormatHandle.resume();
        this._draw.reset();
        this._layer.removeAll();
        this.state = {
            ...this.state,
            action: 'ready',
            length: 0,
            area: 0,
        };
    }
    // calculate the length of polyline
    _calculateLength(polyline) {
        const lengthUnit = this._units.lengthUnit;
        let length = geodesicLength(polyline, lengthUnit);
        if (length < 0) {
            const simplifiedPolyline = simplify(polyline);
            if (simplifiedPolyline) {
                length = geodesicLength(simplifiedPolyline, lengthUnit);
            }
        }
        return Number(length.toFixed(2));
    }
    // return esri.Point at midpoint of polyline
    _polylineMidpoint(polyline) {
        const _distance = (a, b) => {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        const _lineInterpolate = (point1, point2, distance) => {
            const xabs = Math.abs(point1.x - point2.x);
            const yabs = Math.abs(point1.y - point2.y);
            const xdiff = point2.x - point1.x;
            const ydiff = point2.y - point1.y;
            const length = Math.sqrt(Math.pow(xabs, 2) + Math.pow(yabs, 2));
            const steps = length / distance;
            const xstep = xdiff / steps;
            const ystep = ydiff / steps;
            return {
                x: point1.x + xstep,
                y: point1.y + ystep,
            };
        };
        const _lineMidpoint = (lineSegments) => {
            let totalDistance = 0;
            for (let i = 0; i < lineSegments.length - 1; i += 1) {
                totalDistance += _distance(lineSegments[i], lineSegments[i + 1]);
            }
            let distanceSoFar = 0;
            for (let i = 0; i < lineSegments.length - 1; i += 1) {
                if (distanceSoFar + _distance(lineSegments[i], lineSegments[i + 1]) > totalDistance / 2) {
                    const distanceToMidpoint = totalDistance / 2 - distanceSoFar;
                    return _lineInterpolate(lineSegments[i], lineSegments[i + 1], distanceToMidpoint);
                }
                distanceSoFar += _distance(lineSegments[i], lineSegments[i + 1]);
            }
            return lineSegments[0];
        };
        const segments = [];
        polyline.paths[0].forEach((pnt) => {
            segments.push({
                x: pnt[0],
                y: pnt[1],
            });
        });
        const midpoint = _lineMidpoint(segments);
        return new Point({
            x: midpoint.x,
            y: midpoint.y,
            spatialReference: polyline.spatialReference,
        });
    }
    // public method to call when hiding, switching, etc the widget
    onHide() {
        this._clear();
    }
    // --------------------------------------------------------------------------
    //
    //    graphics
    //
    // --------------------------------------------------------------------------
    // add marker to graphics layer
    _addMarkerGraphic(vertex) {
        this._layer.add(new Graphic({
            geometry: new Point({
                x: vertex[0],
                y: vertex[1],
                spatialReference: this.view.spatialReference,
            }),
            symbol: new SimpleMarkerSymbol({
                color: SYMBOL.primary,
                size: SYMBOL.width * 2,
                outline: {
                    type: 'simple-line',
                    width: 0,
                },
            }),
        }));
    }
    // add polyline to graphics layer
    _addLineGraphic(geometry) {
        this._layer.addMany([
            new Graphic({
                geometry,
                symbol: new SimpleLineSymbol({
                    cap: 'butt',
                    join: 'round',
                    color: SYMBOL.primary,
                    width: SYMBOL.width,
                }),
            }),
            new Graphic({
                geometry,
                symbol: new SimpleLineSymbol({
                    style: 'dash',
                    cap: 'butt',
                    join: 'round',
                    color: SYMBOL.secondary,
                    width: SYMBOL.width - 2,
                }),
            }),
        ]);
    }
    // add polygon to graphics layer
    _addFillGraphic(geometry) {
        this._layer.add(new Graphic({
            geometry,
            symbol: new SimpleFillSymbol({
                style: 'solid',
                color: [...SYMBOL.primary, ...[0.2]],
                outline: {
                    width: 0,
                },
            }),
        }));
    }
    // add text to graphics layer
    _addTextGraphic(geometry, text) {
        switch (geometry.type) {
            case 'polyline':
                geometry = this._polylineMidpoint(geometry);
                break;
            case 'polygon':
                geometry = geometry.centroid;
                break;
            default:
                break;
        }
        this._layer.add(new Graphic({
            geometry,
            symbol: new TextSymbol({
                color: SYMBOL.secondary,
                haloColor: SYMBOL.primary,
                haloSize: 1.5,
                text,
                verticalAlignment: 'middle',
                horizontalAlignment: 'center',
                yoffset: 0,
                xoffset: 0,
                font: {
                    size: SYMBOL.size,
                    family: 'sans-serif',
                    weight: 'bold',
                },
            }),
        }));
    }
    // --------------------------------------------------------------------------
    //
    //    length
    //
    // --------------------------------------------------------------------------
    _measureLength() {
        this._clear();
        this.state.action = 'measuringLength';
        const action = this._draw.create('polyline', {
            mode: 'click',
        });
        this.view.focus();
        action.on(['vertex-add', 'cursor-update', 'vertex-remove', 'draw-complete'], this._lengthEvent.bind(this));
    }
    _lengthEvent(evt) {
        // polyline to calc length and for graphics
        const polyline = new Polyline({
            paths: evt.vertices,
            spatialReference: this.view.spatialReference,
        });
        // length of polyline
        const length = this._calculateLength(polyline);
        // clear graphics
        this._layer.removeAll();
        // add point and polyline graphics
        polyline.paths[0].forEach((vertex) => {
            this._addMarkerGraphic(vertex);
        });
        this._addLineGraphic(polyline);
        // set state
        this.state =
            evt.type === 'draw-complete'
                ? {
                    ...this.state,
                    action: 'length',
                    length,
                }
                : {
                    ...this.state,
                    length,
                };
        // add text after state is updating so text graphic and results match
        this._addTextGraphic(polyline, `${length.toLocaleString()} ${this._units.lengthUnit}`);
    }
    // --------------------------------------------------------------------------
    //
    //    area
    //
    // --------------------------------------------------------------------------
    _measureArea() {
        this._clear();
        this.state.action = 'measuringArea';
        const action = this._draw.create('polygon', {
            mode: 'click',
        });
        this.view.focus();
        action.on(['vertex-add', 'cursor-update', 'vertex-remove', 'draw-complete'], this._areaEvent.bind(this));
    }
    _areaEvent(evt) {
        const spatialReference = this.view.spatialReference;
        // polyline to calc perimeter
        const polyline = new Polyline({
            paths: [...evt.vertices, ...[evt.vertices[0]]],
            spatialReference,
        });
        // length of polyline
        const length = this._calculateLength(polyline);
        // polygon to calc area
        const polygon = new Polygon({
            rings: evt.vertices,
            spatialReference,
        });
        // calc area
        const areaUnit = this._units.areaUnit;
        let area = geodesicArea(polygon, areaUnit);
        if (area < 0) {
            const simplifiedPolygon = simplify(polygon);
            if (simplifiedPolygon) {
                area = geodesicArea(simplifiedPolygon, areaUnit);
            }
        }
        area = Number(area.toFixed(2));
        // clear graphics
        this._layer.removeAll();
        // add point, polyline and polygon graphics
        polygon.rings[0].forEach((vertex) => {
            this._addMarkerGraphic(vertex);
        });
        this._addFillGraphic(polygon);
        this._addLineGraphic(polyline);
        // set state
        this.state =
            evt.type === 'draw-complete'
                ? {
                    ...this.state,
                    action: 'area',
                    length,
                    area,
                }
                : {
                    ...this.state,
                    length,
                    area,
                };
        // add text after state is updating so text graphic and results match
        this._addTextGraphic(polygon, `${area.toLocaleString()} ${areaUnit}`);
    }
    // --------------------------------------------------------------------------
    //
    //    location
    //
    // --------------------------------------------------------------------------
    _centerLocation(center) {
        if (this._units.locationUnit === 'dec') {
            this.state = {
                ...this.state,
                latitude: Number(center.latitude.toFixed(6)),
                longitude: Number(center.longitude.toFixed(6)),
            };
        }
        else {
            const dms = toLatitudeLongitude(webMercatorToGeographic(center), 'dms', 2);
            const index = dms.indexOf('N') !== -1 ? dms.indexOf('N') : dms.indexOf('S');
            this.state = {
                ...this.state,
                latitude: dms.substring(0, index + 1),
                longitude: dms.substring(index + 2, dms.length),
            };
        }
    }
    _identifyLocation() {
        this._clear();
        this._coordCenterHandle.pause();
        this._coordFormatHandle.pause();
        this.state.action = 'findingLocation';
        const action = this._draw.create('point', {});
        this.view.focus();
        action.on(['cursor-update', 'draw-complete'], this._locationEvent.bind(this));
    }
    _locationEvent(evt) {
        const x = evt.vertices[0][0];
        const y = evt.vertices[0][1];
        const spatialReference = this.view.spatialReference;
        const point = new Point({
            x,
            y,
            spatialReference,
        });
        this._centerLocation(point);
        // clear graphics
        this._layer.removeAll();
        // set state
        if (evt.type === 'draw-complete') {
            this.state.action = 'location';
        }
        // add graphics
        this._addMarkerGraphic([x, y]);
        this._addTextGraphic(point, `${this.state.latitude} ${this.state.longitude}`);
    }
    // --------------------------------------------------------------------------
    //
    //    elevation
    //
    // --------------------------------------------------------------------------
    _centerElevation(center) {
        const el = this.elevationLayer;
        el.queryElevation(center)
            .then((res) => {
            const point = res.geometry;
            const elevation = Math.round(point.z * (this._units.elevationUnit === 'feet' ? 3.2808399 : 1) * 10) / 10;
            this.state = {
                ...this.state,
                elevation,
            };
        })
            .catch(() => {
            this.state.elevation = 0;
        });
    }
    _identifyElevation() {
        this._clear();
        this._elevCenterHandle.pause();
        this._elevFormatHandle.pause();
        this.state.action = 'findingElevation';
        const action = this._draw.create('point', {});
        this.view.focus();
        action.on(['cursor-update', 'draw-complete'], this._elevationEvent.bind(this));
    }
    _elevationEvent(evt) {
        const x = evt.vertices[0][0];
        const y = evt.vertices[0][1];
        const spatialReference = this.view.spatialReference;
        const point = new Point({
            x,
            y,
            spatialReference,
        });
        this._centerElevation(point);
        // clear graphics
        this._layer.removeAll();
        // set state
        if (evt.type === 'draw-complete') {
            this.state.action = 'elevation';
        }
        // add graphics
        this._addMarkerGraphic([x, y]);
        this._addTextGraphic(point, `${this.state.elevation.toLocaleString()} ${this._units.elevationUnit}`);
    }
};
__decorate([
    property()
], Measure.prototype, "view", void 0);
__decorate([
    property()
], Measure.prototype, "elevationLayer", void 0);
__decorate([
    property(),
    renderable()
], Measure.prototype, "state", void 0);
__decorate([
    property({
        type: UnitsViewModel,
    })
], Measure.prototype, "_units", void 0);
__decorate([
    property()
], Measure.prototype, "_draw", void 0);
__decorate([
    property()
], Measure.prototype, "_layer", void 0);
__decorate([
    property()
], Measure.prototype, "_coordCenterHandle", void 0);
__decorate([
    property()
], Measure.prototype, "_coordFormatHandle", void 0);
__decorate([
    property()
], Measure.prototype, "_elevCenterHandle", void 0);
__decorate([
    property()
], Measure.prototype, "_elevFormatHandle", void 0);
__decorate([
    property(),
    renderable()
], Measure.prototype, "_showTextSymbol", void 0);
__decorate([
    property(),
    renderable()
], Measure.prototype, "_activeTab", void 0);
Measure = __decorate([
    subclass('app.widgets.Measure')
], Measure);
export default Measure;
