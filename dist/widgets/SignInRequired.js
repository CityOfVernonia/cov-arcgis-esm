import { __decorate } from "tslib";
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
const CSS = {
    base: 'cov-sign-in-required',
};
let SignInRequired = class SignInRequired extends Widget {
    _signIn() {
        this.oAuthViewModel.signIn();
    }
    render() {
        return (tsx("div", { class: CSS.base },
            tsx("calcite-panel", null,
                tsx("h3", { slot: "header-content" }, "Sign In Required"),
                tsx("calcite-button", { appearance: "solid", color: "blue", scale: "s", "icon-start": "sign-in", alignment: "center", width: "auto", onclick: this._signIn.bind(this) }, "Sign In"))));
    }
};
__decorate([
    property()
], SignInRequired.prototype, "oAuthViewModel", void 0);
SignInRequired = __decorate([
    subclass('cov.widgets.SignInRequired')
], SignInRequired);
export default SignInRequired;
