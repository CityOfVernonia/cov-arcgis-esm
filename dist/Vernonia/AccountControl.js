import { __decorate } from "tslib";
import Widget from '@arcgis/core/widgets/Widget';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx, renderable } from '@arcgis/core/widgets/support/widget';
const CSS = {
    base: 'cov-vernonia--account-control',
};
let AccountControl = class AccountControl extends Widget {
    constructor(properties) {
        super(properties);
    }
    render() {
        const { oAuthViewModel, user } = this;
        return user ? (tsx("div", { class: CSS.base },
            tsx("p", null,
                tsx("calcite-avatar", { scale: "l", "full-name": oAuthViewModel.user.fullName, username: oAuthViewModel.user.username, thumbnail: oAuthViewModel.user.thumbnailUrl }),
                tsx("span", null, user.fullName)),
            tsx("p", null, user.username),
            tsx("p", null,
                tsx("calcite-link", { href: `${oAuthViewModel.portal.url}/home/content.html`, target: "_blank" }, "My Content")),
            tsx("p", null,
                tsx("calcite-link", { href: `${oAuthViewModel.portal.url}/home/user.html`, target: "_blank" }, "My Profile")),
            tsx("calcite-button", { scale: "s", width: "full", onclick: oAuthViewModel.signOut.bind(oAuthViewModel) }, "Sign out"))) : (
        // this should never need to be rendered but it's a safe fallback if widget is rendered and not signed in
        tsx("div", { class: CSS.base },
            tsx("calcite-button", { scale: "s", width: "full", onclick: oAuthViewModel.signIn.bind(oAuthViewModel) }, "Sign in")));
    }
};
__decorate([
    property(),
    renderable()
], AccountControl.prototype, "oAuthViewModel", void 0);
__decorate([
    property({
        aliasOf: 'oAuthViewModel.user',
        dependsOn: ['oAuthViewModel'],
    }),
    renderable()
], AccountControl.prototype, "user", void 0);
AccountControl = __decorate([
    subclass('cov.Vernonia.AccountControl')
], AccountControl);
export default AccountControl;
