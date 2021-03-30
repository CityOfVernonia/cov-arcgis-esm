"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const CSS = {
    base: 'cov-vernonia--account-control',
};
let AccountControl = class AccountControl extends Widget_1.default {
    constructor(properties) {
        super(properties);
    }
    render() {
        const { oAuthViewModel, user } = this;
        return user ? (widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("p", null,
                widget_1.tsx("calcite-avatar", { scale: "l", "full-name": oAuthViewModel.user.fullName, username: oAuthViewModel.user.username, thumbnail: oAuthViewModel.user.thumbnailUrl }),
                widget_1.tsx("span", null, user.fullName)),
            widget_1.tsx("p", null, user.username),
            widget_1.tsx("p", null,
                widget_1.tsx("calcite-link", { href: `${oAuthViewModel.portal.url}/home/content.html`, target: "_blank" }, "My Content")),
            widget_1.tsx("p", null,
                widget_1.tsx("calcite-link", { href: `${oAuthViewModel.portal.url}/home/user.html`, target: "_blank" }, "My Profile")),
            widget_1.tsx("calcite-button", { scale: "s", width: "full", onclick: oAuthViewModel.signOut.bind(oAuthViewModel) }, "Sign out"))) : (
        // this should never need to be rendered but it's a safe fallback if widget is rendered and not signed in
        widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("calcite-button", { scale: "s", width: "full", onclick: oAuthViewModel.signIn.bind(oAuthViewModel) }, "Sign in")));
    }
};
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], AccountControl.prototype, "oAuthViewModel", void 0);
tslib_1.__decorate([
    decorators_1.property({
        aliasOf: 'oAuthViewModel.user',
        dependsOn: ['oAuthViewModel'],
    }),
    widget_1.renderable()
], AccountControl.prototype, "user", void 0);
AccountControl = tslib_1.__decorate([
    decorators_1.subclass('cov.Vernonia.AccountControl')
], AccountControl);
exports.default = AccountControl;
