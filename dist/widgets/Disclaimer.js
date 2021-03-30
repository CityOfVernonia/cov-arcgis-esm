/**
 * A widget to display a disclaimer with a `Don't show me this again` option.
 */
import { __decorate } from "tslib";
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import Cookies from 'js-cookie';
const CSS = {
    base: 'cov-disclaimer',
    button: 'esri-button',
};
const COOKIE_NAME = 'cov_disclaimer_widget_accepted';
const COOKIE_VALUE = 'accepted';
let Disclaimer = class Disclaimer extends Widget {
    constructor() {
        super(...arguments);
        this.title = 'Disclaimer';
        this.disclaimer = `There are no warranties, expressed or implied, including the warranty of merchantability or fitness for a particular purpose, accompanying this application.`;
    }
    static isAccepted() {
        const cookie = Cookies.get(COOKIE_NAME);
        return cookie && cookie === COOKIE_VALUE ? true : false;
    }
    render() {
        return (tsx("div", { class: CSS.base },
            tsx("main", null,
                tsx("h3", null, this.title),
                tsx("p", null, this.disclaimer),
                tsx("form", { bind: this, onsubmit: this._accept },
                    tsx("label", null,
                        tsx("input", { type: "checkbox", name: "NOSHOW" }),
                        "Don't show me this again"),
                    tsx("button", { class: CSS.button }, "Accept")))));
    }
    _accept(evt) {
        evt.preventDefault();
        if (evt.target.NOSHOW.checked) {
            Cookies.set(COOKIE_NAME, COOKIE_VALUE, { expires: 60 });
        }
        this.emit('accepted');
        this.destroy();
    }
};
__decorate([
    property()
], Disclaimer.prototype, "title", void 0);
__decorate([
    property()
], Disclaimer.prototype, "disclaimer", void 0);
Disclaimer = __decorate([
    subclass('cov.widgets.Disclaimer')
], Disclaimer);
export default Disclaimer;
