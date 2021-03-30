import { __decorate } from "tslib";
import { whenOnce } from '@arcgis/core/core/watchUtils';
import '@esri/calcite-components';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { renderable, tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import PrintViewModel from '@arcgis/core/widgets/Print/PrintViewModel';
import PrintTemplate from '@arcgis/core/tasks/support/PrintTemplate';
const CSS = {
    base: 'esri-widget cov-calcite-print',
    results: 'cov-calcite-print--results',
    result: 'cov-calcite-print--result',
    spin: 'esri-rotating',
    icon: 'cov-calcite-print--result-icon',
};
let KEY = 0;
let CalcitePrint = class CalcitePrint extends Widget {
    constructor(properties) {
        super(properties);
        this.printTitle = 'Print Map';
        /**
         * Widget properties.
         */
        this._printer = new PrintViewModel();
        this._titleInput = (tsx("calcite-input", { scale: "s", type: "text", value: this.printTitle, placeholder: "Map title" }));
        this._results = [];
        whenOnce(this, 'view', (view) => {
            this._printer.view = view;
            this._printer.printServiceUrl = this.printServiceUrl;
            this._printer.load().then(this._createSelects.bind(this)).catch();
        });
    }
    _createSelects(printer) {
        const { templatesInfo: { format, layout }, } = printer;
        this._layoutSelect = (tsx("calcite-select", { scale: "s" }, layout.choiceList.map((choice) => {
            return (tsx("calcite-option", { label: choice.replaceAll('-', ' '), value: choice, selected: layout.defaultValue === choice }));
        })));
        this._formatSelect = (tsx("calcite-select", { scale: "s" }, format.choiceList.map((choice) => {
            return (tsx("calcite-option", { label: choice.replaceAll('-', ' '), value: choice, selected: format.defaultValue === choice }));
        })));
    }
    _createResults() {
        return this._results.map((result) => {
            const { state, titleText, url } = result;
            switch (state) {
                case 'printing':
                    return (tsx("div", { key: KEY++, class: CSS.result },
                        tsx("calcite-icon", { class: this.classes(CSS.spin, CSS.icon), icon: "spinner", scale: "s" }),
                        titleText));
                case 'printed':
                    return (tsx("div", { key: KEY++, class: CSS.result, title: `Download ${titleText}` },
                        tsx("calcite-icon", { class: CSS.icon, icon: "download", scale: "s" }),
                        tsx("calcite-link", { href: url, target: "_blank" }, titleText)));
                case 'error':
                    return (tsx("div", { key: KEY++, class: CSS.result, style: "color:var(--calcite-ui-red-1)", title: "Printing failed" },
                        tsx("calcite-icon", { class: CSS.icon, icon: "exclamationMarkCircle", scale: "s" }),
                        titleText));
                default:
                    return tsx("div", null);
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
            .print(new PrintTemplate({
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
        return (tsx("div", { class: CSS.base },
            tsx("calcite-block", { style: "margin:0;", heading: "Print a map", summary: "Add a title and select a layout and format", open: "" },
                tsx("calcite-icon", { slot: "icon", icon: "print", scale: "m", "aria-hidden": "true" }),
                tsx("calcite-label", null,
                    "Title",
                    this._titleInput),
                tsx("calcite-label", null,
                    "Layout",
                    this._layoutSelect),
                tsx("calcite-label", null,
                    "Format",
                    this._formatSelect),
                tsx("calcite-button", { scale: "s", appearance: "solid", color: "blue", alignment: "center", width: "full", bind: this, onclick: this._print.bind(this) }, "Print"),
                tsx("div", { class: this._results.length ? CSS.results : '' }, this._createResults()))));
    }
};
__decorate([
    property()
], CalcitePrint.prototype, "view", void 0);
__decorate([
    property()
], CalcitePrint.prototype, "printServiceUrl", void 0);
__decorate([
    property()
], CalcitePrint.prototype, "printTitle", void 0);
__decorate([
    property()
], CalcitePrint.prototype, "_printer", void 0);
__decorate([
    property()
], CalcitePrint.prototype, "_titleInput", void 0);
__decorate([
    property(),
    renderable()
], CalcitePrint.prototype, "_layoutSelect", void 0);
__decorate([
    property(),
    renderable()
], CalcitePrint.prototype, "_formatSelect", void 0);
__decorate([
    property(),
    renderable()
], CalcitePrint.prototype, "_results", void 0);
CalcitePrint = __decorate([
    subclass('cov.widgets.CalcitePrint')
], CalcitePrint);
export default CalcitePrint;
