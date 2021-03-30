"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
require("@esri/calcite-components");
const MeasureViewModel_1 = tslib_1.__importDefault(require("./../viewModels/MeasureViewModel"));
const CSS = {
    base: 'cov-calcite-measure',
    tabs: 'tabs',
    tabNav: 'tab-nav',
    tab: 'tab',
    switch: 'cov-calcite-measure--switch',
    content: 'cov-calcite-measure--content',
    row: 'cov-calcite-measure--row',
    rowItem: 'cov-calcite-measure--row-item',
    result: 'cov-calcite-measure--result',
    resultLabel: 'cov-calcite-measure--result-label',
    clear: 'cov-calcite-measure--clear',
    clearVisible: 'visible',
};
let KEY = 0;
let CalciteMeasure = class CalciteMeasure extends Widget_1.default {
    constructor() {
        super(...arguments);
        this.theme = 'light';
        this.widthScale = 'm';
        this.scale = 's';
        /**
         * Public widget properties.
         */
        this.viewModel = new MeasureViewModel_1.default();
    }
    /**
     * View model methods called by the widget.
     */
    clear() {
        this.viewModel.clear();
    }
    length() {
        this.viewModel.length();
    }
    area() {
        this.viewModel.area();
    }
    elevation() {
        this.viewModel.elevation();
    }
    location() {
        this.viewModel.location();
    }
    /**
     * Wire swich change to showText.
     * @param _switch
     */
    _showTextHandle(_switch) {
        _switch.addEventListener('calciteSwitchChange', (evt) => {
            this.showText = evt.detail.switched;
        });
    }
    /**
     * Wire units change to units<unit>.
     * @param type
     * @param select
     */
    _unitChangeHandle(type, select) {
        select.addEventListener('calciteSelectChange', (evt) => {
            const value = evt.target.selectedOption.value;
            switch (type) {
                case 'length':
                    this.units.lengthUnit = value;
                    break;
                case 'area':
                    this.units.areaUnit = value;
                    break;
                case 'location':
                    this.units.locationUnit = value;
                    break;
                case 'elevation':
                    this.units.elevationUnit = value;
                    break;
                default:
                    break;
            }
        });
    }
    render() {
        const { state, hasGround, theme, widthScale, scale, showText, units: { lengthUnits, lengthUnit, areaUnits, areaUnit, locationUnits, locationUnit, elevationUnits, elevationUnit, }, } = this;
        const measureClear = {
            [CSS.clearVisible]: state.action === 'measuringLength' ||
                state.action === 'length' ||
                state.action === 'measuringArea' ||
                state.action === 'area',
        };
        const locationClear = {
            [CSS.clearVisible]: state.action === 'queryingElevation' || state.action === 'location',
        };
        const elevationClear = {
            [CSS.clearVisible]: state.action === 'queryingElevation' || state.action === 'elevation',
        };
        return (widget_1.tsx("calcite-shell", { class: CSS.base },
            widget_1.tsx("calcite-shell-panel", { theme: theme, "width-scale": widthScale },
                widget_1.tsx("calcite-tabs", { class: CSS.tabs, layout: "center" },
                    widget_1.tsx("calcite-tab-nav", { class: CSS.tabNav, slot: "tab-nav" },
                        widget_1.tsx("calcite-tab-title", { active: true }, "Measure"),
                        widget_1.tsx("calcite-tab-title", null, "Location"),
                        hasGround ? widget_1.tsx("calcite-tab-title", null, "Elevation") : null),
                    widget_1.tsx("calcite-tab", { class: CSS.tab, active: true },
                        widget_1.tsx("div", { class: CSS.content },
                            widget_1.tsx("div", { class: CSS.row },
                                widget_1.tsx("calcite-button", { class: CSS.rowItem, title: "Measure length", scale: scale, bind: this, onclick: this.length.bind(this) }, "Length"),
                                widget_1.tsx("calcite-select", { class: CSS.rowItem, title: "Select length unit", scale: scale, bind: this, afterCreate: this._unitChangeHandle.bind(this, 'length') }, this._createUnitOptions(lengthUnits, lengthUnit))),
                            widget_1.tsx("div", { class: CSS.row },
                                widget_1.tsx("calcite-button", { class: CSS.rowItem, title: "Measure area", scale: scale, bind: this, onclick: this.area.bind(this) }, "Area"),
                                widget_1.tsx("calcite-select", { class: CSS.rowItem, title: "Select area unit", scale: scale, bind: this, afterCreate: this._unitChangeHandle.bind(this, 'area') }, this._createUnitOptions(areaUnits, areaUnit))),
                            widget_1.tsx("div", { class: CSS.row },
                                widget_1.tsx("label", { class: CSS.switch },
                                    widget_1.tsx("calcite-switch", { title: "Show text while measuring", switched: showText, scale: scale, bind: this, afterCreate: this._showTextHandle.bind(this) }),
                                    "Show text")),
                            this._createMeasureResut(),
                            widget_1.tsx("div", { class: this.classes(CSS.clear, measureClear) },
                                widget_1.tsx("calcite-button", { title: "Clear", width: "auto", scale: scale, bind: this, onclick: this.clear.bind(this) }, "Clear")))),
                    widget_1.tsx("calcite-tab", { class: CSS.tab },
                        widget_1.tsx("div", { class: CSS.content },
                            widget_1.tsx("div", { class: CSS.row },
                                widget_1.tsx("calcite-button", { title: "Identify location", class: CSS.rowItem, scale: scale, bind: this, onclick: this.location.bind(this) }, "Location"),
                                widget_1.tsx("calcite-select", { title: "Select location unit", class: CSS.rowItem, scale: scale, bind: this, afterCreate: this._unitChangeHandle.bind(this, 'location') }, this._createUnitOptions(locationUnits, locationUnit))),
                            widget_1.tsx("div", { class: CSS.row },
                                widget_1.tsx("label", { class: CSS.switch },
                                    widget_1.tsx("calcite-switch", { title: "Show text while measuring", switched: showText, scale: scale, bind: this, afterCreate: this._showTextHandle.bind(this) }),
                                    "Show text")),
                            widget_1.tsx("div", { class: CSS.result },
                                widget_1.tsx("div", null,
                                    widget_1.tsx("span", { class: CSS.resultLabel }, "Latitude:"),
                                    " ",
                                    state.y),
                                widget_1.tsx("div", null,
                                    widget_1.tsx("span", { class: CSS.resultLabel }, "Longitude:"),
                                    " ",
                                    state.x)),
                            widget_1.tsx("div", { class: this.classes(CSS.clear, locationClear) },
                                widget_1.tsx("calcite-button", { title: "Clear", width: "auto", scale: scale, bind: this, onclick: this.clear.bind(this) }, "Clear")))),
                    hasGround ? (widget_1.tsx("calcite-tab", { class: CSS.tab },
                        widget_1.tsx("div", { class: CSS.content },
                            widget_1.tsx("div", { class: CSS.row },
                                widget_1.tsx("calcite-button", { title: "Identify elevation", class: CSS.rowItem, scale: scale, bind: this, onclick: this.elevation.bind(this) }, "Elevation"),
                                widget_1.tsx("calcite-select", { title: "Select elevation unit", class: CSS.rowItem, scale: scale, bind: this, afterCreate: this._unitChangeHandle.bind(this, 'elevation') }, this._createUnitOptions(elevationUnits, elevationUnit))),
                            widget_1.tsx("div", { class: CSS.row },
                                widget_1.tsx("label", { class: CSS.switch },
                                    widget_1.tsx("calcite-switch", { title: "Show text while measuring", switched: showText, scale: scale, bind: this, afterCreate: this._showTextHandle.bind(this) }),
                                    "Show text")),
                            widget_1.tsx("div", { class: CSS.result },
                                widget_1.tsx("span", { class: CSS.resultLabel }, "Elevation:"),
                                " ",
                                state.z,
                                " ",
                                elevationUnit),
                            widget_1.tsx("div", { class: this.classes(CSS.clear, elevationClear) },
                                widget_1.tsx("calcite-button", { title: "clear", width: "auto", scale: scale, bind: this, onclick: this.clear.bind(this) }, "Clear"))))) : null))));
    }
    /**
     * tsx helpers.
     */
    _createUnitOptions(units, defaultUnit) {
        const options = [];
        for (const unit in units) {
            options.push(widget_1.tsx("calcite-option", { key: KEY++, value: unit, selected: unit === defaultUnit }, units[unit]));
        }
        return options;
    }
    _createMeasureResut() {
        const { state, units: { lengthUnit, areaUnit }, } = this;
        switch (state.action) {
            case 'length':
            case 'measuringLength':
                return (widget_1.tsx("div", { key: KEY++, class: CSS.result },
                    widget_1.tsx("span", { class: CSS.resultLabel }, "Length:"),
                    " ",
                    state.length.toLocaleString(),
                    " ",
                    lengthUnit));
            case 'area':
            case 'measuringArea':
                return (widget_1.tsx("div", { key: KEY++, class: CSS.result },
                    widget_1.tsx("div", null,
                        widget_1.tsx("span", { class: CSS.resultLabel }, "Area:"),
                        " ",
                        state.area.toLocaleString(),
                        " ",
                        areaUnit),
                    widget_1.tsx("div", null,
                        widget_1.tsx("span", { class: CSS.resultLabel }, "Perimeter:"),
                        " ",
                        state.length.toLocaleString(),
                        " ",
                        lengthUnit)));
            default:
                return (widget_1.tsx("div", { key: KEY++, class: CSS.result }, "Select a measure tool"));
        }
    }
};
tslib_1.__decorate([
    decorators_1.property({
        aliasOf: 'viewModel.view',
    })
], CalciteMeasure.prototype, "view", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalciteMeasure.prototype, "theme", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalciteMeasure.prototype, "widthScale", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalciteMeasure.prototype, "scale", void 0);
tslib_1.__decorate([
    decorators_1.property({
        aliasOf: 'viewModel.showText',
    }),
    widget_1.renderable()
], CalciteMeasure.prototype, "showText", void 0);
tslib_1.__decorate([
    decorators_1.property({
        aliasOf: 'viewModel.color',
    }),
    widget_1.renderable()
], CalciteMeasure.prototype, "color", void 0);
tslib_1.__decorate([
    decorators_1.property({
        aliasOf: 'viewModel.fillColor',
    }),
    widget_1.renderable()
], CalciteMeasure.prototype, "fillColor", void 0);
tslib_1.__decorate([
    decorators_1.property({
        type: MeasureViewModel_1.default,
    })
], CalciteMeasure.prototype, "viewModel", void 0);
tslib_1.__decorate([
    decorators_1.property({
        aliasOf: 'viewModel.state',
    }),
    widget_1.renderable()
], CalciteMeasure.prototype, "state", void 0);
tslib_1.__decorate([
    decorators_1.property({
        aliasOf: 'viewModel.units',
    })
], CalciteMeasure.prototype, "units", void 0);
tslib_1.__decorate([
    decorators_1.property({
        aliasOf: 'viewModel.hasGround',
    }),
    widget_1.renderable()
], CalciteMeasure.prototype, "hasGround", void 0);
tslib_1.__decorate([
    widget_1.accessibleHandler()
], CalciteMeasure.prototype, "clear", null);
tslib_1.__decorate([
    widget_1.accessibleHandler()
], CalciteMeasure.prototype, "length", null);
tslib_1.__decorate([
    widget_1.accessibleHandler()
], CalciteMeasure.prototype, "area", null);
tslib_1.__decorate([
    widget_1.accessibleHandler()
], CalciteMeasure.prototype, "elevation", null);
tslib_1.__decorate([
    widget_1.accessibleHandler()
], CalciteMeasure.prototype, "location", null);
CalciteMeasure = tslib_1.__decorate([
    decorators_1.subclass('cov.widgets.CalciteMeasure')
], CalciteMeasure);
exports.default = CalciteMeasure;
