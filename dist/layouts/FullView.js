"use strict";
/**
 * A a full view layout widget with a title in the upper left corner.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const watchUtils_1 = require("@arcgis/core/core/watchUtils");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const CSS = {
    base: 'cov-full-view',
    title: 'cov-full-view--title',
    view: 'cov-full-view--view',
};
let FullView = class FullView extends Widget_1.default {
    constructor(properties) {
        super(properties);
        this.title = 'City of Vernonia';
        watchUtils_1.whenOnce(this, 'view', this._init.bind(this));
    }
    _init() {
        const { view, title } = this;
        const titleText = document.createElement('div');
        titleText.innerHTML = title;
        titleText.classList.add(CSS.title);
        view.ui.add(titleText, {
            position: 'top-left',
            index: 0,
        });
        setTimeout(() => {
            view.container = document.querySelector('div[data-full-view-layout-view]');
        }, 0);
    }
    render() {
        return (widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("div", { class: CSS.view, "data-full-view-layout-view": "" })));
    }
};
tslib_1.__decorate([
    decorators_1.property()
], FullView.prototype, "view", void 0);
tslib_1.__decorate([
    decorators_1.property()
], FullView.prototype, "title", void 0);
FullView = tslib_1.__decorate([
    decorators_1.subclass('cov.layouts.FullView')
], FullView);
exports.default = FullView;
