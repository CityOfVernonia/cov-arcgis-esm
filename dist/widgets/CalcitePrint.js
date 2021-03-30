"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const watchUtils_1 = require("@arcgis/core/core/watchUtils");
require("@esri/calcite-components");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const PrintViewModel_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Print/PrintViewModel"));
const PrintTemplate_1 = tslib_1.__importDefault(require("@arcgis/core/tasks/support/PrintTemplate"));
const CSS = {
    base: 'esri-widget cov-calcite-print',
    results: 'cov-calcite-print--results',
    result: 'cov-calcite-print--result',
    spin: 'esri-rotating',
    icon: 'cov-calcite-print--result-icon',
};
let KEY = 0;
let CalcitePrint = class CalcitePrint extends Widget_1.default {
    constructor(properties) {
        super(properties);
        this.printTitle = 'Print Map';
        /**
         * Widget properties.
         */
        this._printer = new PrintViewModel_1.default();
        this._titleInput = (widget_1.tsx("calcite-input", { scale: "s", type: "text", value: this.printTitle, placeholder: "Map title" }));
        this._results = [];
        watchUtils_1.whenOnce(this, 'view', (view) => {
            this._printer.view = view;
            this._printer.printServiceUrl = this.printServiceUrl;
            this._printer.load().then(this._createSelects.bind(this)).catch();
        });
    }
    _createSelects(printer) {
        const { templatesInfo: { format, layout }, } = printer;
        this._layoutSelect = (widget_1.tsx("calcite-select", { scale: "s" }, layout.choiceList.map((choice) => {
            return (widget_1.tsx("calcite-option", { label: choice.replaceAll('-', ' '), value: choice, selected: layout.defaultValue === choice }));
        })));
        this._formatSelect = (widget_1.tsx("calcite-select", { scale: "s" }, format.choiceList.map((choice) => {
            return (widget_1.tsx("calcite-option", { label: choice.replaceAll('-', ' '), value: choice, selected: format.defaultValue === choice }));
        })));
    }
    _createResults() {
        return this._results.map((result) => {
            const { state, titleText, url } = result;
            switch (state) {
                case 'printing':
                    return (widget_1.tsx("div", { key: KEY++, class: CSS.result },
                        widget_1.tsx("calcite-icon", { class: this.classes(CSS.spin, CSS.icon), icon: "spinner", scale: "s" }),
                        titleText));
                case 'printed':
                    return (widget_1.tsx("div", { key: KEY++, class: CSS.result, title: `Download ${titleText}` },
                        widget_1.tsx("calcite-icon", { class: CSS.icon, icon: "download", scale: "s" }),
                        widget_1.tsx("calcite-link", { href: url, target: "_blank" }, titleText)));
                case 'error':
                    return (widget_1.tsx("div", { key: KEY++, class: CSS.result, style: "color:var(--calcite-ui-red-1)", title: "Printing failed" },
                        widget_1.tsx("calcite-icon", { class: CSS.icon, icon: "exclamationMarkCircle", scale: "s" }),
                        titleText));
                default:
                    return widget_1.tsx("div", null);
            }
        });
    }
    _print() {
        const { _printer, _titleInput, _layoutSelect, _formatSelect, _results } = this;
        //@ts-ignore
        const titleText = _titleInput.domNode.value;
        //@ts-ignore
        const format = _formatSelect.domNode.selectedOption.value;
        //@ts-ignore
        const layout = _layoutSelect.domNode.selectedOption.value;
        if (!titleText) {
            console.log(_titleInput);
            //@ts-ignore
            _titleInput.domNode.setFocus();
            return;
        }
        const result = {
            state: 'printing',
            titleText,
            url: '',
        };
        _results.push(result);
        _printer
            .print(new PrintTemplate_1.default({
            format,
            layout,
            layoutOptions: {
                titleText,
            },
        }))
            .then((printResult) => {
            result.state = 'printed';
            result.url = printResult.url;
        })
            .catch((printError) => {
            console.log(printError);
            result.state = 'error';
        })
            .then(this.scheduleRender.bind(this));
    }
    render() {
        return (widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("calcite-block", { style: "margin:0;", heading: "Print a map", summary: "Add a title and select a layout and format", open: "" },
                widget_1.tsx("calcite-icon", { slot: "icon", icon: "print", scale: "m", "aria-hidden": "true" }),
                widget_1.tsx("calcite-label", null,
                    "Title",
                    this._titleInput),
                widget_1.tsx("calcite-label", null,
                    "Layout",
                    this._layoutSelect),
                widget_1.tsx("calcite-label", null,
                    "Format",
                    this._formatSelect),
                widget_1.tsx("calcite-button", { scale: "s", appearance: "solid", color: "blue", alignment: "center", width: "full", bind: this, onclick: this._print.bind(this) }, "Print"),
                widget_1.tsx("div", { class: this._results.length ? CSS.results : '' }, this._createResults()))));
    }
};
tslib_1.__decorate([
    decorators_1.property()
], CalcitePrint.prototype, "view", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalcitePrint.prototype, "printServiceUrl", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalcitePrint.prototype, "printTitle", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalcitePrint.prototype, "_printer", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalcitePrint.prototype, "_titleInput", void 0);
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], CalcitePrint.prototype, "_layoutSelect", void 0);
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], CalcitePrint.prototype, "_formatSelect", void 0);
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], CalcitePrint.prototype, "_results", void 0);
CalcitePrint = tslib_1.__decorate([
    decorators_1.subclass('cov.widgets.CalcitePrint')
], CalcitePrint);
exports.default = CalcitePrint;
