"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const watchUtils_1 = require("@arcgis/core/core/watchUtils");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const interactjs_1 = tslib_1.__importDefault(require("interactjs"));
const CSS = {
    base: 'cov-map-table-widget',
    topLeft: 'cov-map-table-widget--top-left',
    topRight: 'cov-map-table-widget--top-right',
    bottom: 'cov-map-table-widget--bottom',
    view: 'cov-map-table-widget--view',
    widget: 'cov-map-table-widget--widget',
    table: 'cov-map-table-widget--table',
};
let MapWidgetTable = class MapWidgetTable extends Widget_1.default {
    constructor(properties) {
        super(properties);
        watchUtils_1.whenOnce(this, 'view', this._init.bind(this));
    }
    async _init(view) {
        const { widget, featureTable } = this;
        setTimeout(() => {
            view.container = document.querySelector(`div[class="${CSS.view}"]`);
            widget.container = document.querySelector(`div[class="${CSS.widget}"]`);
            featureTable.container = document.querySelector(`div[class="${CSS.table}"]`);
        }, 0);
        await view.when();
        const base = document.querySelector(`div[class="${CSS.base}"]`);
        const topLeft = document.querySelector(`div[class="${CSS.topLeft}"]`);
        const topRight = document.querySelector(`div[class="${CSS.topRight}"]`);
        const bottom = document.querySelector(`div[class="${CSS.bottom}"]`);
        interactjs_1.default(topLeft).resizable({
            edges: {
                top: false,
                right: true,
                bottom: false,
                left: false,
            },
            listeners: {
                move: (event) => {
                    const { offsetWidth } = base;
                    const percent = event.rect.width / offsetWidth;
                    const inverse = 1 - percent;
                    if (percent < 0.25 || inverse < 0.25)
                        return;
                    topLeft.style.right = `calc(100% * ${inverse})`;
                    topRight.style.left = `calc(100% * ${percent})`;
                },
            },
        });
        interactjs_1.default(bottom).resizable({
            edges: {
                top: true,
                right: false,
                bottom: false,
                left: false,
            },
            listeners: {
                move: (event) => {
                    const { offsetHeight } = base;
                    const percent = event.rect.height / offsetHeight;
                    const inverse = 1 - percent;
                    if (percent < 0.25 || inverse < 0.25)
                        return;
                    bottom.style.height = `calc(100% * ${percent})`;
                    topLeft.style.height = `calc(100% * ${inverse})`;
                    topRight.style.height = `calc(100% * ${inverse})`;
                },
            },
        });
    }
    render() {
        return (widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("div", { class: CSS.topLeft },
                widget_1.tsx("div", { class: CSS.view })),
            widget_1.tsx("div", { class: CSS.topRight },
                widget_1.tsx("div", { class: CSS.widget })),
            widget_1.tsx("div", { class: CSS.bottom },
                widget_1.tsx("div", { class: CSS.table }))));
    }
};
tslib_1.__decorate([
    decorators_1.property()
], MapWidgetTable.prototype, "view", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapWidgetTable.prototype, "featureTable", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapWidgetTable.prototype, "widget", void 0);
MapWidgetTable = tslib_1.__decorate([
    decorators_1.subclass('cov.layouts.MapWidgetTable')
], MapWidgetTable);
exports.default = MapWidgetTable;
