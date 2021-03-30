"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const CSS = {
    base: 'cov-vernonia--map-title',
};
let MapTitle = class MapTitle extends Widget_1.default {
    constructor(properties) {
        super(properties);
        this.title = 'Vernonia';
    }
    render() {
        const { title } = this;
        return widget_1.tsx("div", { class: CSS.base }, title);
    }
};
tslib_1.__decorate([
    decorators_1.property()
], MapTitle.prototype, "title", void 0);
MapTitle = tslib_1.__decorate([
    decorators_1.subclass('cov.Vernonia.MapTitle')
], MapTitle);
exports.default = MapTitle;
