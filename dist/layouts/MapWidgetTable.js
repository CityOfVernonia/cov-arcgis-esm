import { __decorate } from "tslib";
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { whenOnce } from '@arcgis/core/core/watchUtils';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import interact from 'interactjs';
const CSS = {
    base: 'cov-map-table-widget',
    topLeft: 'cov-map-table-widget--top-left',
    topRight: 'cov-map-table-widget--top-right',
    bottom: 'cov-map-table-widget--bottom',
    view: 'cov-map-table-widget--view',
    widget: 'cov-map-table-widget--widget',
    table: 'cov-map-table-widget--table',
};
let MapWidgetTable = class MapWidgetTable extends Widget {
    constructor(properties) {
        super(properties);
        whenOnce(this, 'view', this._init.bind(this));
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
        interact(topLeft).resizable({
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
        interact(bottom).resizable({
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
        return (tsx("div", { class: CSS.base },
            tsx("div", { class: CSS.topLeft },
                tsx("div", { class: CSS.view })),
            tsx("div", { class: CSS.topRight },
                tsx("div", { class: CSS.widget })),
            tsx("div", { class: CSS.bottom },
                tsx("div", { class: CSS.table }))));
    }
};
__decorate([
    property()
], MapWidgetTable.prototype, "view", void 0);
__decorate([
    property()
], MapWidgetTable.prototype, "featureTable", void 0);
__decorate([
    property()
], MapWidgetTable.prototype, "widget", void 0);
MapWidgetTable = __decorate([
    subclass('cov.layouts.MapWidgetTable')
], MapWidgetTable);
export default MapWidgetTable;
