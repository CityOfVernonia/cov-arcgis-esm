"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Cookies = tslib_1.__importStar(require("js-cookie"));
const COOKIE_NAME = encodeURIComponent(location.origin + location.pathname);
const COOKIE_VALUE = 'accepted';
let DisclaimerModal = class DisclaimerModal extends Widget_1.default {
    constructor(properties) {
        super(properties);
        this.title = 'Disclaimer';
        this.message = 'There are no warranties, expressed or implied, including the warranty of merchantability or fitness for a particular purpose, accompanying this application.';
        this._active = true;
        // add directly to <body>
        this.container = document.createElement('div');
        document.body.append(this.container);
    }
    static isAccepted() {
        const cookie = Cookies.get(COOKIE_NAME);
        return cookie && cookie === COOKIE_VALUE ? true : false;
    }
    _clickEvent() {
        Cookies.set(COOKIE_NAME, COOKIE_VALUE, { expires: 60 });
        this._active = false;
        setTimeout(() => {
            this.destroy();
        }, 2000);
    }
    render() {
        const { id, _active, title, message } = this;
        return (widget_1.tsx("div", null,
            widget_1.tsx("calcite-modal", { width: "s", "aria-labelledby": `modal_${id}`, active: _active, "disable-close-button": "", "disable-escape": "" },
                widget_1.tsx("h3", { slot: "header", id: `modal_${id}` }, title),
                widget_1.tsx("div", { slot: "content" }, message),
                widget_1.tsx("calcite-button", { slot: "primary", onclick: this._clickEvent.bind(this) }, "I agree"))));
    }
};
tslib_1.__decorate([
    decorators_1.property()
], DisclaimerModal.prototype, "title", void 0);
tslib_1.__decorate([
    decorators_1.property()
], DisclaimerModal.prototype, "message", void 0);
tslib_1.__decorate([
    decorators_1.property()
], DisclaimerModal.prototype, "_active", void 0);
DisclaimerModal = tslib_1.__decorate([
    decorators_1.subclass('cov.Vernonia.DisclaimerModal')
], DisclaimerModal);
exports.default = DisclaimerModal;
