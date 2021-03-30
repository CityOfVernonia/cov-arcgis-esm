"use strict";
/**
 * A widget to display a disclaimer with a `Don't show me this again` option.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const js_cookie_1 = tslib_1.__importDefault(require("js-cookie"));
const CSS = {
    base: 'cov-disclaimer',
    button: 'esri-button',
};
const COOKIE_NAME = 'cov_disclaimer_widget_accepted';
const COOKIE_VALUE = 'accepted';
let Disclaimer = class Disclaimer extends Widget_1.default {
    constructor() {
        super(...arguments);
        this.title = 'Disclaimer';
        this.disclaimer = `There are no warranties, expressed or implied, including the warranty of merchantability or fitness for a particular purpose, accompanying this application.`;
    }
    static isAccepted() {
        const cookie = js_cookie_1.default.get(COOKIE_NAME);
        return cookie && cookie === COOKIE_VALUE ? true : false;
    }
    render() {
        return (widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("main", null,
                widget_1.tsx("h3", null, this.title),
                widget_1.tsx("p", null, this.disclaimer),
                widget_1.tsx("form", { bind: this, onsubmit: this._accept },
                    widget_1.tsx("label", null,
                        widget_1.tsx("input", { type: "checkbox", name: "NOSHOW" }),
                        "Don't show me this again"),
                    widget_1.tsx("button", { class: CSS.button }, "Accept")))));
    }
    _accept(evt) {
        evt.preventDefault();
        if (evt.target.NOSHOW.checked) {
            js_cookie_1.default.set(COOKIE_NAME, COOKIE_VALUE, { expires: 60 });
        }
        this.emit('accepted');
        this.destroy();
    }
};
tslib_1.__decorate([
    decorators_1.property()
], Disclaimer.prototype, "title", void 0);
tslib_1.__decorate([
    decorators_1.property()
], Disclaimer.prototype, "disclaimer", void 0);
Disclaimer = tslib_1.__decorate([
    decorators_1.subclass('cov.widgets.Disclaimer')
], Disclaimer);
exports.default = Disclaimer;
