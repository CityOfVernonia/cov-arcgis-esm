import { __decorate } from "tslib";
/**
 * A widget to explain with what this is made with.
 */
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
const CSS = {
    base: 'cov-made-with',
};
let MadeWith = class MadeWith extends Widget {
    constructor() {
        super(...arguments);
        this.size = '14px';
        this.color = '#000000';
        this.backgroundColor = '#FFFFFF';
        this.opacity = 0.6;
    }
    render() {
        const { color, backgroundColor, opacity, size } = this;
        return (tsx("div", { class: CSS.base, style: `opacity:${opacity};color:${color};background-color:${backgroundColor};font-size:${size};` },
            tsx("span", null, "Made with"),
            tsx("svg", { style: `width:${size};height:${size};`, "aria-hidden": "true", focusable: "false", class: "fa-heart", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
                tsx("path", { fill: "currentColor", d: "M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" })),
            tsx("span", null, "and"),
            tsx("svg", { style: `width:${size};height:${size};`, "aria-hidden": "true", focusable: "false", class: "fa-coffee", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 640 512" },
                tsx("path", { fill: "currentColor", d: "M192 384h192c53 0 96-43 96-96h32c70.6 0 128-57.4 128-128S582.6 32 512 32H120c-13.3 0-24 10.7-24 24v232c0 53 43 96 96 96zM512 96c35.3 0 64 28.7 64 64s-28.7 64-64 64h-32V96h32zm47.7 384H48.3c-47.6 0-61-64-36-64h583.3c25 0 11.8 64-35.9 64z" })),
            tsx("span", null, "in Vernonia, Oregon")));
    }
};
__decorate([
    property()
], MadeWith.prototype, "size", void 0);
__decorate([
    property()
], MadeWith.prototype, "color", void 0);
__decorate([
    property()
], MadeWith.prototype, "backgroundColor", void 0);
__decorate([
    property()
], MadeWith.prototype, "opacity", void 0);
MadeWith = __decorate([
    subclass('cov.widgets.MadeWith')
], MadeWith);
export default MadeWith;
