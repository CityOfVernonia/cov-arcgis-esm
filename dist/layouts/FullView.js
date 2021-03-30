/**
 * A a full view layout widget with a title in the upper left corner.
 */
import { __decorate } from "tslib";
import { whenOnce } from '@arcgis/core/core/watchUtils';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
const CSS = {
    base: 'cov-full-view',
    title: 'cov-full-view--title',
    view: 'cov-full-view--view',
};
let FullView = class FullView extends Widget {
    constructor(properties) {
        super(properties);
        this.title = 'City of Vernonia';
        whenOnce(this, 'view', this._init.bind(this));
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
        return (tsx("div", { class: CSS.base },
            tsx("div", { class: CSS.view, "data-full-view-layout-view": "" })));
    }
};
__decorate([
    property()
], FullView.prototype, "view", void 0);
__decorate([
    property()
], FullView.prototype, "title", void 0);
FullView = __decorate([
    subclass('cov.layouts.FullView')
], FullView);
export default FullView;
