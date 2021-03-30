import { __decorate } from "tslib";
import Widget from '@arcgis/core/widgets/Widget';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
import * as Cookies from 'js-cookie';
const COOKIE_NAME = encodeURIComponent(location.origin + location.pathname);
const COOKIE_VALUE = 'accepted';
let DisclaimerModal = class DisclaimerModal extends Widget {
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
        return (tsx("div", null,
            tsx("calcite-modal", { width: "s", "aria-labelledby": `modal_${id}`, active: _active, "disable-close-button": "", "disable-escape": "" },
                tsx("h3", { slot: "header", id: `modal_${id}` }, title),
                tsx("div", { slot: "content" }, message),
                tsx("calcite-button", { slot: "primary", onclick: this._clickEvent.bind(this) }, "I agree"))));
    }
};
__decorate([
    property()
], DisclaimerModal.prototype, "title", void 0);
__decorate([
    property()
], DisclaimerModal.prototype, "message", void 0);
__decorate([
    property()
], DisclaimerModal.prototype, "_active", void 0);
DisclaimerModal = __decorate([
    subclass('cov.Vernonia.DisclaimerModal')
], DisclaimerModal);
export default DisclaimerModal;
