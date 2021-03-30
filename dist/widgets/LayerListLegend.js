"use strict";
/**
 * A widget with tabbed Esri LayerList and Legend widgets.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const LayerList_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/LayerList"));
const Legend_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Legend"));
const CSS = {
    base: 'esri-widget cov-layer-list-legend',
    tabs: 'cov-tabs',
    tabsContentWrapper: 'cov-tabs--content-wrapper',
    tabsContent: 'cov-tabs--content',
    tabsContentNoPadding: 'cov-tabs--content_no-padding',
};
let LayerListLegend = class LayerListLegend extends Widget_1.default {
    constructor() {
        super(...arguments);
        this.layerListProperties = {};
        this.legendProperties = {};
        this._activeTab = 'data-tab-0';
    }
    render() {
        return (widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("ul", { class: CSS.tabs, role: "tablist" },
                widget_1.tsx("li", { id: `tab_${this.id}_tab_0`, "aria-selected": this._activeTab === 'data-tab-0' ? 'true' : 'false', bind: this, onclick: () => {
                        this._activeTab = 'data-tab-0';
                    } }, "Layers"),
                widget_1.tsx("li", { id: `tab_${this.id}_tab_1`, "aria-selected": this._activeTab === 'data-tab-1' ? 'true' : 'false', bind: this, onclick: () => {
                        this._activeTab = 'data-tab-1';
                    } }, "Legend")),
            widget_1.tsx("main", { class: CSS.tabsContentWrapper },
                widget_1.tsx("section", { class: this.classes(CSS.tabsContent, CSS.tabsContentNoPadding), "aria-labelledby": `tab_${this.id}_tab_0`, role: "tabcontent", style: `display:${this._activeTab === 'data-tab-0' ? 'block' : 'none'}` },
                    widget_1.tsx("div", { bind: this, afterCreate: (layerListDiv) => {
                            new LayerList_1.default({
                                container: layerListDiv,
                                view: this.view,
                                ...this.layerListProperties,
                            });
                        } })),
                widget_1.tsx("section", { class: this.classes(CSS.tabsContent, CSS.tabsContentNoPadding), "aria-labelledby": `tab_${this.id}_tab_1`, role: "tabcontent", style: `display:${this._activeTab === 'data-tab-1' ? 'block' : 'none'}` },
                    widget_1.tsx("div", { bind: this, afterCreate: (legendDiv) => {
                            new Legend_1.default({
                                container: legendDiv,
                                view: this.view,
                                ...this.legendProperties,
                            });
                        } })))));
    }
};
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], LayerListLegend.prototype, "view", void 0);
tslib_1.__decorate([
    decorators_1.property()
], LayerListLegend.prototype, "layerListProperties", void 0);
tslib_1.__decorate([
    decorators_1.property()
], LayerListLegend.prototype, "legendProperties", void 0);
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], LayerListLegend.prototype, "_activeTab", void 0);
LayerListLegend = tslib_1.__decorate([
    decorators_1.subclass('cov.widgets.LayerListLegend')
], LayerListLegend);
exports.default = LayerListLegend;
