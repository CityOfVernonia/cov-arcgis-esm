import { __decorate } from "tslib";
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { accessibleHandler, renderable, tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import '@esri/calcite-components';
import MeasureViewModel from './../viewModels/MeasureViewModel';
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
let CalciteMeasure = class CalciteMeasure extends Widget {
    constructor() {
        super(...arguments);
        this.theme = 'light';
        this.widthScale = 'm';
        this.scale = 's';
        /**
         * Public widget properties.
         */
        this.viewModel = new MeasureViewModel();
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
        return (tsx("calcite-shell", { class: CSS.base },
            tsx("calcite-shell-panel", { theme: theme, "width-scale": widthScale },
                tsx("calcite-tabs", { class: CSS.tabs, layout: "center" },
                    tsx("calcite-tab-nav", { class: CSS.tabNav, slot: "tab-nav" },
                        tsx("calcite-tab-title", { active: true }, "Measure"),
                        tsx("calcite-tab-title", null, "Location"),
                        hasGround ? tsx("calcite-tab-title", null, "Elevation") : null),
                    tsx("calcite-tab", { class: CSS.tab, active: true },
                        tsx("div", { class: CSS.content },
                            tsx("div", { class: CSS.row },
                                tsx("calcite-button", { class: CSS.rowItem, title: "Measure length", scale: scale, bind: this, onclick: this.length.bind(this) }, "Length"),
                                tsx("calcite-select", { class: CSS.rowItem, title: "Select length unit", scale: scale, bind: this, afterCreate: this._unitChangeHandle.bind(this, 'length') }, this._createUnitOptions(lengthUnits, lengthUnit))),
                            tsx("div", { class: CSS.row },
                                tsx("calcite-button", { class: CSS.rowItem, title: "Measure area", scale: scale, bind: this, onclick: this.area.bind(this) }, "Area"),
                                tsx("calcite-select", { class: CSS.rowItem, title: "Select area unit", scale: scale, bind: this, afterCreate: this._unitChangeHandle.bind(this, 'area') }, this._createUnitOptions(areaUnits, areaUnit))),
                            tsx("div", { class: CSS.row },
                                tsx("label", { class: CSS.switch },
                                    tsx("calcite-switch", { title: "Show text while measuring", switched: showText, scale: scale, bind: this, afterCreate: this._showTextHandle.bind(this) }),
                                    "Show text")),
                            this._createMeasureResut(),
                            tsx("div", { class: this.classes(CSS.clear, measureClear) },
                                tsx("calcite-button", { title: "Clear", width: "auto", scale: scale, bind: this, onclick: this.clear.bind(this) }, "Clear")))),
                    tsx("calcite-tab", { class: CSS.tab },
                        tsx("div", { class: CSS.content },
                            tsx("div", { class: CSS.row },
                                tsx("calcite-button", { title: "Identify location", class: CSS.rowItem, scale: scale, bind: this, onclick: this.location.bind(this) }, "Location"),
                                tsx("calcite-select", { title: "Select location unit", class: CSS.rowItem, scale: scale, bind: this, afterCreate: this._unitChangeHandle.bind(this, 'location') }, this._createUnitOptions(locationUnits, locationUnit))),
                            tsx("div", { class: CSS.row },
                                tsx("label", { class: CSS.switch },
                                    tsx("calcite-switch", { title: "Show text while measuring", switched: showText, scale: scale, bind: this, afterCreate: this._showTextHandle.bind(this) }),
                                    "Show text")),
                            tsx("div", { class: CSS.result },
                                tsx("div", null,
                                    tsx("span", { class: CSS.resultLabel }, "Latitude:"),
                                    " ",
                                    state.y),
                                tsx("div", null,
                                    tsx("span", { class: CSS.resultLabel }, "Longitude:"),
                                    " ",
                                    state.x)),
                            tsx("div", { class: this.classes(CSS.clear, locationClear) },
                                tsx("calcite-button", { title: "Clear", width: "auto", scale: scale, bind: this, onclick: this.clear.bind(this) }, "Clear")))),
                    hasGround ? (tsx("calcite-tab", { class: CSS.tab },
                        tsx("div", { class: CSS.content },
                            tsx("div", { class: CSS.row },
                                tsx("calcite-button", { title: "Identify elevation", class: CSS.rowItem, scale: scale, bind: this, onclick: this.elevation.bind(this) }, "Elevation"),
                                tsx("calcite-select", { title: "Select elevation unit", class: CSS.rowItem, scale: scale, bind: this, afterCreate: this._unitChangeHandle.bind(this, 'elevation') }, this._createUnitOptions(elevationUnits, elevationUnit))),
                            tsx("div", { class: CSS.row },
                                tsx("label", { class: CSS.switch },
                                    tsx("calcite-switch", { title: "Show text while measuring", switched: showText, scale: scale, bind: this, afterCreate: this._showTextHandle.bind(this) }),
                                    "Show text")),
                            tsx("div", { class: CSS.result },
                                tsx("span", { class: CSS.resultLabel }, "Elevation:"),
                                " ",
                                state.z,
                                " ",
                                elevationUnit),
                            tsx("div", { class: this.classes(CSS.clear, elevationClear) },
                                tsx("calcite-button", { title: "clear", width: "auto", scale: scale, bind: this, onclick: this.clear.bind(this) }, "Clear"))))) : null))));
    }
    /**
     * tsx helpers.
     */
    _createUnitOptions(units, defaultUnit) {
        const options = [];
        for (const unit in units) {
            options.push(tsx("calcite-option", { key: KEY++, value: unit, selected: unit === defaultUnit }, units[unit]));
        }
        return options;
    }
    _createMeasureResut() {
        const { state, units: { lengthUnit, areaUnit }, } = this;
        switch (state.action) {
            case 'length':
            case 'measuringLength':
                return (tsx("div", { key: KEY++, class: CSS.result },
                    tsx("span", { class: CSS.resultLabel }, "Length:"),
                    " ",
                    state.length.toLocaleString(),
                    " ",
                    lengthUnit));
            case 'area':
            case 'measuringArea':
                return (tsx("div", { key: KEY++, class: CSS.result },
                    tsx("div", null,
                        tsx("span", { class: CSS.resultLabel }, "Area:"),
                        " ",
                        state.area.toLocaleString(),
                        " ",
                        areaUnit),
                    tsx("div", null,
                        tsx("span", { class: CSS.resultLabel }, "Perimeter:"),
                        " ",
                        state.length.toLocaleString(),
                        " ",
                        lengthUnit)));
            default:
                return (tsx("div", { key: KEY++, class: CSS.result }, "Select a measure tool"));
        }
    }
};
__decorate([
    property({
        aliasOf: 'viewModel.view',
    })
], CalciteMeasure.prototype, "view", void 0);
__decorate([
    property()
], CalciteMeasure.prototype, "theme", void 0);
__decorate([
    property()
], CalciteMeasure.prototype, "widthScale", void 0);
__decorate([
    property()
], CalciteMeasure.prototype, "scale", void 0);
__decorate([
    property({
        aliasOf: 'viewModel.showText',
    }),
    renderable()
], CalciteMeasure.prototype, "showText", void 0);
__decorate([
    property({
        aliasOf: 'viewModel.color',
    }),
    renderable()
], CalciteMeasure.prototype, "color", void 0);
__decorate([
    property({
        aliasOf: 'viewModel.fillColor',
    }),
    renderable()
], CalciteMeasure.prototype, "fillColor", void 0);
__decorate([
    property({
        type: MeasureViewModel,
    })
], CalciteMeasure.prototype, "viewModel", void 0);
__decorate([
    property({
        aliasOf: 'viewModel.state',
    }),
    renderable()
], CalciteMeasure.prototype, "state", void 0);
__decorate([
    property({
        aliasOf: 'viewModel.units',
    })
], CalciteMeasure.prototype, "units", void 0);
__decorate([
    property({
        aliasOf: 'viewModel.hasGround',
    }),
    renderable()
], CalciteMeasure.prototype, "hasGround", void 0);
__decorate([
    accessibleHandler()
], CalciteMeasure.prototype, "clear", null);
__decorate([
    accessibleHandler()
], CalciteMeasure.prototype, "length", null);
__decorate([
    accessibleHandler()
], CalciteMeasure.prototype, "area", null);
__decorate([
    accessibleHandler()
], CalciteMeasure.prototype, "elevation", null);
__decorate([
    accessibleHandler()
], CalciteMeasure.prototype, "location", null);
CalciteMeasure = __decorate([
    subclass('cov.widgets.CalciteMeasure')
], CalciteMeasure);
export default CalciteMeasure;
