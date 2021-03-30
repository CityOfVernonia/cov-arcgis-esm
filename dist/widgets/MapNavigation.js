"use strict";
/**
 * A map navigation widget to replace the default zoom control, including optional compass, home, locate and fullscreen controls.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const watchUtils_1 = require("@arcgis/core/core/watchUtils");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const ZoomViewModel_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Zoom/ZoomViewModel"));
const HomeViewModel_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Home/HomeViewModel"));
const LocateViewModel_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Locate/LocateViewModel"));
const FullscreenViewModel_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Fullscreen/FullscreenViewModel"));
const CSS = {
    base: 'cov-map-navigation',
    button: 'cov-map-navigation--button',
    buttonDisabled: 'cov-map-navigation--button disabled',
    compass: 'cov-map-navigation--compass',
    icon: 'esri-icon',
    fallback: 'esri-icon-font-fallback-text',
};
let MapNavigation = class MapNavigation extends Widget_1.default {
    constructor() {
        super(...arguments);
        /**
         * Include compass.
         *
         * @default true
         */
        this.compass = true;
        /**
         * Include home.
         *
         * @default true
         */
        this.home = true;
        /**
         * Include locate.
         *
         * @default true
         */
        this.locate = true;
        /**
         * Include fullscreen.
         *
         * @default true
         */
        this.fullscreen = true;
        /**
         * Include button to switch between 2D/3D.
         *
         * @default false
         */
        this.viewSwitcher = false;
        this.zoomViewModel = new ZoomViewModel_1.default();
        this.homeViewModel = new HomeViewModel_1.default();
        this.locateViewModel = new LocateViewModel_1.default();
        this.fullscreenViewModel = new FullscreenViewModel_1.default();
    }
    postInitialize() {
        watchUtils_1.whenOnce(this, 'view', () => {
            const view = this.view;
            this.zoomViewModel.view = view;
            this.homeViewModel.view = view;
            this.locateViewModel.view = view;
            this.fullscreenViewModel.view = view;
            if (this.fullscreenElement) {
                this.fullscreenViewModel.element =
                    typeof this.fullscreenElement === 'string'
                        ? document.querySelector(this.fullscreenElement)
                        : this.fullscreenElement;
            }
        });
    }
    render() {
        return (widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("div", { class: this.zoomViewModel.canZoomIn ? CSS.button : CSS.buttonDisabled, role: "button", title: "Zoom In", bind: this, onclick: () => this.zoomViewModel.zoomIn() },
                widget_1.tsx("span", { class: this.classes(CSS.icon, 'esri-icon-plus'), "aria-hidden": "true" }),
                widget_1.tsx("span", { class: CSS.fallback }, "Zoom In")),
            widget_1.tsx("div", { class: this.zoomViewModel.canZoomOut ? CSS.button : CSS.buttonDisabled, role: "button", title: "Zoom Out", bind: this, onclick: () => this.zoomViewModel.zoomOut() },
                widget_1.tsx("span", { class: this.classes(CSS.icon, 'esri-icon-minus'), "aria-hidden": "true" }),
                widget_1.tsx("span", { class: CSS.fallback }, "Zoom Out")),
            this.compass &&
                this.view.type === '2d' &&
                this.view.constraints.rotationEnabled ? (widget_1.tsx("div", { class: CSS.button, role: "button", title: "Reset Orientation", bind: this, onclick: () => {
                    this.view.rotation = 0;
                } },
                widget_1.tsx("span", { class: CSS.compass },
                    widget_1.tsx("span", { class: this.classes(CSS.icon, 'esri-icon-compass'), style: `transform: rotate(${this._viewRotation}deg)`, "aria-hidden": "true" })),
                widget_1.tsx("span", { class: CSS.fallback }, "Reset Orientation"))) : null,
            this.home ? (widget_1.tsx("div", { class: CSS.button, role: "button", title: "Default Extent", bind: this, onclick: this.homeViewModel.go },
                widget_1.tsx("span", { class: this.classes(CSS.icon, 'esri-icon-home'), "aria-hidden": "true" }),
                widget_1.tsx("span", { class: CSS.fallback }, "Default Extent"))) : null,
            this.locate ? (widget_1.tsx("div", { class: CSS.button, role: "button", title: "Zoom To Location", bind: this, onclick: this.locateViewModel.locate },
                widget_1.tsx("span", { class: this.classes(CSS.icon, 'esri-icon-locate'), "aria-hidden": "true" }),
                widget_1.tsx("span", { class: CSS.fallback }, "Zoom To Location"))) : null,
            this.fullscreen && this._fullscreenState !== 'feature-unsupported' && this._fullscreenState !== 'disabled' ? (widget_1.tsx("div", { class: CSS.button, role: "button", title: this._fullscreenState === 'ready' ? 'Enter Fullscreen' : 'Exit Fullscreen', bind: this, onclick: () => this.fullscreenViewModel.toggle() },
                widget_1.tsx("span", { class: this.classes(CSS.icon, this._fullscreenState === 'ready' ? 'esri-icon-zoom-out-fixed' : 'esri-icon-zoom-in-fixed'), "aria-hidden": "true" }),
                widget_1.tsx("span", { class: CSS.fallback }, this._fullscreenState === 'ready' ? 'Enter Fullscreen' : 'Exit Fullscreen'))) : null,
            this.viewSwitcher ? (widget_1.tsx("div", { class: CSS.button, role: "button", title: this.view.type === '2d' ? 'Go 3D' : 'Go 2D', bind: this, onclick: () => {
                    this.emit('view-switch', this.view.type === '2d' ? '3d' : '2d');
                    switch (this.view.type) {
                        case '2d':
                            if (this.go3D && typeof this.go3D === 'function') {
                                this.go3D();
                            }
                            break;
                        case '3d':
                            if (this.go2D && typeof this.go2D === 'function') {
                                this.go2D();
                            }
                            break;
                        default:
                            break;
                    }
                } },
                widget_1.tsx("span", { class: this.classes(CSS.icon, this.view.type === '2d' ? 'esri-icon-globe' : 'esri-icon-maps'), "aria-hidden": "true" }),
                widget_1.tsx("span", { class: CSS.fallback }, this.view.type === '2d' ? 'Go 3D' : 'Go 2D'))) : null));
    }
};
tslib_1.__decorate([
    decorators_1.property()
], MapNavigation.prototype, "view", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapNavigation.prototype, "compass", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapNavigation.prototype, "home", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapNavigation.prototype, "locate", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapNavigation.prototype, "fullscreen", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapNavigation.prototype, "fullscreenElement", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapNavigation.prototype, "zoomViewModel", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapNavigation.prototype, "homeViewModel", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapNavigation.prototype, "locateViewModel", void 0);
tslib_1.__decorate([
    decorators_1.property()
], MapNavigation.prototype, "fullscreenViewModel", void 0);
tslib_1.__decorate([
    decorators_1.aliasOf('view.rotation'),
    widget_1.renderable()
], MapNavigation.prototype, "_viewRotation", void 0);
tslib_1.__decorate([
    decorators_1.aliasOf('fullscreenViewModel.state'),
    widget_1.renderable()
], MapNavigation.prototype, "_fullscreenState", void 0);
MapNavigation = tslib_1.__decorate([
    decorators_1.subclass('cov.widgets.MapNavigation')
], MapNavigation);
exports.default = MapNavigation;
