import { __decorate } from "tslib";
import Widget from '@arcgis/core/widgets/Widget';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
const CSS = {
    base: 'cov-vernonia--map-title',
};
let MapTitle = class MapTitle extends Widget {
    constructor(properties) {
        super(properties);
        this.title = 'Vernonia';
    }
    render() {
        const { title } = this;
        return tsx("div", { class: CSS.base }, title);
    }
};
__decorate([
    property()
], MapTitle.prototype, "title", void 0);
MapTitle = __decorate([
    subclass('cov.Vernonia.MapTitle')
], MapTitle);
export default MapTitle;
