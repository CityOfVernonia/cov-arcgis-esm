"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const CSS = {
    base: 'cov-sign-in-required',
};
let SignInRequired = class SignInRequired extends Widget_1.default {
    _signIn() {
        this.oAuthViewModel.signIn();
    }
    render() {
        return (widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("calcite-panel", null,
                widget_1.tsx("h3", { slot: "header-content" }, "Sign In Required"),
                widget_1.tsx("calcite-button", { appearance: "solid", color: "blue", scale: "s", "icon-start": "sign-in", alignment: "center", width: "auto", onclick: this._signIn.bind(this) }, "Sign In"))));
    }
};
tslib_1.__decorate([
    decorators_1.property()
], SignInRequired.prototype, "oAuthViewModel", void 0);
SignInRequired = tslib_1.__decorate([
    decorators_1.subclass('cov.widgets.SignInRequired')
], SignInRequired);
exports.default = SignInRequired;
