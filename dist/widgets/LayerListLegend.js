/**
 * A widget with tabbed Esri LayerList and Legend widgets.
 */
import { __decorate } from "tslib";
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { renderable, tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
const CSS = {
    base: 'esri-widget cov-layer-list-legend',
    tabs: 'cov-tabs',
    tabsContentWrapper: 'cov-tabs--content-wrapper',
    tabsContent: 'cov-tabs--content',
    tabsContentNoPadding: 'cov-tabs--content_no-padding',
};
let LayerListLegend = class LayerListLegend extends Widget {
    constructor() {
        super(...arguments);
        this.layerListProperties = {};
        this.legendProperties = {};
        this._activeTab = 'data-tab-0';
    }
    render() {
        return (tsx("div", { class: CSS.base },
            tsx("ul", { class: CSS.tabs, role: "tablist" },
                tsx("li", { id: `tab_${this.id}_tab_0`, "aria-selected": this._activeTab === 'data-tab-0' ? 'true' : 'false', bind: this, onclick: () => {
                        this._activeTab = 'data-tab-0';
                    } }, "Layers"),
                tsx("li", { id: `tab_${this.id}_tab_1`, "aria-selected": this._activeTab === 'data-tab-1' ? 'true' : 'false', bind: this, onclick: () => {
                        this._activeTab = 'data-tab-1';
                    } }, "Legend")),
            tsx("main", { class: CSS.tabsContentWrapper },
                tsx("section", { class: this.classes(CSS.tabsContent, CSS.tabsContentNoPadding), "aria-labelledby": `tab_${this.id}_tab_0`, role: "tabcontent", style: `display:${this._activeTab === 'data-tab-0' ? 'block' : 'none'}` },
                    tsx("div", { bind: this, afterCreate: (layerListDiv) => {
                            new LayerList({
                                container: layerListDiv,
                                view: this.view,
                                ...this.layerListProperties,
                            });
                        } })),
                tsx("section", { class: this.classes(CSS.tabsContent, CSS.tabsContentNoPadding), "aria-labelledby": `tab_${this.id}_tab_1`, role: "tabcontent", style: `display:${this._activeTab === 'data-tab-1' ? 'block' : 'none'}` },
                    tsx("div", { bind: this, afterCreate: (legendDiv) => {
                            new Legend({
                                container: legendDiv,
                                view: this.view,
                                ...this.legendProperties,
                            });
                        } })))));
    }
};
__decorate([
    property(),
    renderable()
], LayerListLegend.prototype, "view", void 0);
__decorate([
    property()
], LayerListLegend.prototype, "layerListProperties", void 0);
__decorate([
    property()
], LayerListLegend.prototype, "legendProperties", void 0);
__decorate([
    property(),
    renderable()
], LayerListLegend.prototype, "_activeTab", void 0);
LayerListLegend = __decorate([
    subclass('cov.widgets.LayerListLegend')
], LayerListLegend);
export default LayerListLegend;
