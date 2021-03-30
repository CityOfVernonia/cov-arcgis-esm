/**
 * A map navigation widget to replace the default zoom control, including optional compass, home, locate and fullscreen controls.
 */
import { __decorate } from "tslib";
import { aliasOf, property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { whenOnce } from '@arcgis/core/core/watchUtils';
import { renderable, tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import ZoomViewModel from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import HomeViewModel from '@arcgis/core/widgets/Home/HomeViewModel';
import LocateViewModel from '@arcgis/core/widgets/Locate/LocateViewModel';
import FullscreenViewModel from '@arcgis/core/widgets/Fullscreen/FullscreenViewModel';
const CSS = {
    base: 'cov-map-navigation',
    button: 'cov-map-navigation--button',
    buttonDisabled: 'cov-map-navigation--button disabled',
    compass: 'cov-map-navigation--compass',
    icon: 'esri-icon',
    fallback: 'esri-icon-font-fallback-text',
};
let MapNavigation = class MapNavigation extends Widget {
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
        this.zoomViewModel = new ZoomViewModel();
        this.homeViewModel = new HomeViewModel();
        this.locateViewModel = new LocateViewModel();
        this.fullscreenViewModel = new FullscreenViewModel();
    }
    postInitialize() {
        whenOnce(this, 'view', () => {
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
        return (tsx("div", { class: CSS.base },
            tsx("div", { class: this.zoomViewModel.canZoomIn ? CSS.button : CSS.buttonDisabled, role: "button", title: "Zoom In", bind: this, onclick: () => this.zoomViewModel.zoomIn() },
                tsx("span", { class: this.classes(CSS.icon, 'esri-icon-plus'), "aria-hidden": "true" }),
                tsx("span", { class: CSS.fallback }, "Zoom In")),
            tsx("div", { class: this.zoomViewModel.canZoomOut ? CSS.button : CSS.buttonDisabled, role: "button", title: "Zoom Out", bind: this, onclick: () => this.zoomViewModel.zoomOut() },
                tsx("span", { class: this.classes(CSS.icon, 'esri-icon-minus'), "aria-hidden": "true" }),
                tsx("span", { class: CSS.fallback }, "Zoom Out")),
            this.compass &&
                this.view.type === '2d' &&
                this.view.constraints.rotationEnabled ? (tsx("div", { class: CSS.button, role: "button", title: "Reset Orientation", bind: this, onclick: () => {
                    this.view.rotation = 0;
                } },
                tsx("span", { class: CSS.compass },
                    tsx("span", { class: this.classes(CSS.icon, 'esri-icon-compass'), style: `transform: rotate(${this._viewRotation}deg)`, "aria-hidden": "true" })),
                tsx("span", { class: CSS.fallback }, "Reset Orientation"))) : null,
            this.home ? (tsx("div", { class: CSS.button, role: "button", title: "Default Extent", bind: this, onclick: this.homeViewModel.go },
                tsx("span", { class: this.classes(CSS.icon, 'esri-icon-home'), "aria-hidden": "true" }),
                tsx("span", { class: CSS.fallback }, "Default Extent"))) : null,
            this.locate ? (tsx("div", { class: CSS.button, role: "button", title: "Zoom To Location", bind: this, onclick: this.locateViewModel.locate },
                tsx("span", { class: this.classes(CSS.icon, 'esri-icon-locate'), "aria-hidden": "true" }),
                tsx("span", { class: CSS.fallback }, "Zoom To Location"))) : null,
            this.fullscreen && this._fullscreenState !== 'feature-unsupported' && this._fullscreenState !== 'disabled' ? (tsx("div", { class: CSS.button, role: "button", title: this._fullscreenState === 'ready' ? 'Enter Fullscreen' : 'Exit Fullscreen', bind: this, onclick: () => this.fullscreenViewModel.toggle() },
                tsx("span", { class: this.classes(CSS.icon, this._fullscreenState === 'ready' ? 'esri-icon-zoom-out-fixed' : 'esri-icon-zoom-in-fixed'), "aria-hidden": "true" }),
                tsx("span", { class: CSS.fallback }, this._fullscreenState === 'ready' ? 'Enter Fullscreen' : 'Exit Fullscreen'))) : null,
            this.viewSwitcher ? (tsx("div", { class: CSS.button, role: "button", title: this.view.type === '2d' ? 'Go 3D' : 'Go 2D', bind: this, onclick: () => {
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
                tsx("span", { class: this.classes(CSS.icon, this.view.type === '2d' ? 'esri-icon-globe' : 'esri-icon-maps'), "aria-hidden": "true" }),
                tsx("span", { class: CSS.fallback }, this.view.type === '2d' ? 'Go 3D' : 'Go 2D'))) : null));
    }
};
__decorate([
    property()
], MapNavigation.prototype, "view", void 0);
__decorate([
    property()
], MapNavigation.prototype, "compass", void 0);
__decorate([
    property()
], MapNavigation.prototype, "home", void 0);
__decorate([
    property()
], MapNavigation.prototype, "locate", void 0);
__decorate([
    property()
], MapNavigation.prototype, "fullscreen", void 0);
__decorate([
    property()
], MapNavigation.prototype, "fullscreenElement", void 0);
__decorate([
    property()
], MapNavigation.prototype, "zoomViewModel", void 0);
__decorate([
    property()
], MapNavigation.prototype, "homeViewModel", void 0);
__decorate([
    property()
], MapNavigation.prototype, "locateViewModel", void 0);
__decorate([
    property()
], MapNavigation.prototype, "fullscreenViewModel", void 0);
__decorate([
    aliasOf('view.rotation'),
    renderable()
], MapNavigation.prototype, "_viewRotation", void 0);
__decorate([
    aliasOf('fullscreenViewModel.state'),
    renderable()
], MapNavigation.prototype, "_fullscreenState", void 0);
MapNavigation = __decorate([
    subclass('cov.widgets.MapNavigation')
], MapNavigation);
export default MapNavigation;
