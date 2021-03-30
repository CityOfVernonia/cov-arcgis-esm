"use strict";
/**
 * A widget share an app via facebook and twitter.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const CSS = {
    base: 'cov-share',
};
let Share = class Share extends Widget_1.default {
    postInitialize() {
        const id = 'facebook-jssdk';
        const fjs = document.getElementsByTagName('script')[0];
        const js = document.createElement('script');
        if (document.getElementById(id))
            return;
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0';
        fjs.parentNode?.insertBefore(js, fjs);
    }
    render() {
        return (widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("div", { id: "fb-root" }),
            widget_1.tsx("div", { class: "fb-share-button", "data-href": window.location.href, "data-layout": "button_count" }),
            widget_1.tsx("a", { href: "https://twitter.com/share", class: "twitter-share-button" }, "Tweet"),
            widget_1.tsx("script", { async: true, src: "//platform.twitter.com/widgets.js", charset: "utf-8" })));
    }
};
Share = tslib_1.__decorate([
    decorators_1.subclass('cov.widgets.Share')
], Share);
exports.default = Share;
