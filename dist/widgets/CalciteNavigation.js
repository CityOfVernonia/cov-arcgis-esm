"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const watchUtils_1 = require("@arcgis/core/core/watchUtils");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const widget_1 = require("@arcgis/core/widgets/support/widget");
require("@esri/calcite-components");
const ZoomViewModel_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Zoom/ZoomViewModel"));
const HomeViewModel_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Home/HomeViewModel"));
const LocateViewModel_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Locate/LocateViewModel"));
const FullscreenViewModel_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Fullscreen/FullscreenViewModel"));
const CSS = {
    base: 'cov-calcite-navigation',
    compass: 'compass-action',
};
const INCLUDE = {
    home: true,
    compass: true,
    locate: true,
    fullscreen: true,
};
let CalciteNavigation = class CalciteNavigation extends Widget_1.default {
    constructor() {
        super(...arguments);
        this.include = {
            home: true,
            compass: true,
            locate: true,
            fullscreen: true,
        };
        this.zoom = new ZoomViewModel_1.default();
        this.home = new HomeViewModel_1.default();
        this.locate = new LocateViewModel_1.default();
        this.fullscreen = new FullscreenViewModel_1.default();
        this.theme = 'light';
        this.scale = 's';
        this._hasRotation = false;
        this._actions = null;
    }
    postInitialize() {
        this.include = {
            ...INCLUDE,
            ...this.include,
        };
        watchUtils_1.whenOnce(this, 'view', (view) => {
            const { zoom, home, locate, fullscreen, fullscreenElement, actions } = this;
            // set view
            zoom.view = view;
            home.view = view;
            locate.view = view;
            fullscreen.view = view;
            if (fullscreenElement)
                fullscreen.element = fullscreenElement;
            // is map view and can rotate?
            this._hasRotation = (view.type === '2d' &&
                view.constraints.rotationEnabled);
            // custom actions
            if (actions && actions.length)
                this._createCustomActions();
        });
    }
    render() {
        const { view, include, zoom, home, _hasRotation, locate, fullscreen, theme, scale } = this;
        const locateIcon = locate.state === 'ready'
            ? 'gps-on'
            : locate.state === 'locating'
                ? 'gps-on-f'
                : locate.state === 'disabled'
                    ? 'gps-off'
                    : '';
        const fullscreenActive = fullscreen.state === 'active';
        return (widget_1.tsx("div", { class: CSS.base },
            widget_1.tsx("calcite-action-bar", { theme: theme, expandDisabled: true },
                widget_1.tsx("calcite-action-group", null,
                    widget_1.tsx("calcite-action", { title: "Zoom in", text: "Zoom in", disabled: !zoom.canZoomIn, scale: scale, icon: "plus", onclick: zoom.zoomIn.bind(zoom) }),
                    include.home ? (widget_1.tsx("calcite-action", { title: "Default map extent", text: "Default map extent", scale: scale, icon: "home", onclick: home.go.bind(home) })) : null,
                    widget_1.tsx("calcite-action", { title: "Zoom out", text: "Zoom out", disabled: !zoom.canZoomOut, scale: scale, icon: "minus", onclick: zoom.zoomOut.bind(zoom) })),
                include.compass || include.locate || include.fullscreen ? (widget_1.tsx("calcite-action-group", null,
                    _hasRotation && include.compass ? (widget_1.tsx("calcite-action", { title: "Rotate map to north", text: "Rotate map to north", class: CSS.compass, style: `transform: rotate(${view.rotation}deg); border-radius: 50%;`, scale: scale, icon: "compass-needle", onclick: () => (view.rotation = 0), afterCreate: this._compassAction.bind(this) })) : null,
                    include.locate ? (widget_1.tsx("calcite-action", { title: "Find location", text: "Find location", disabled: locate.state === 'disabled', scale: scale, icon: locateIcon, onclick: locate.locate.bind(locate) })) : null,
                    fullscreen.state !== 'feature-unsupported' && include.fullscreen ? (widget_1.tsx("calcite-action", { title: fullscreenActive ? 'Exit fullscreen' : 'Enter fullscreen', text: fullscreenActive ? 'Exit fullscreen' : 'Enter fullscreen', disabled: fullscreen.state === 'disabled', scale: scale, icon: fullscreenActive ? 'full-screen-exit' : 'extent', onclick: fullscreen.toggle.bind(fullscreen) })) : null)) : null,
                this._actions)));
    }
    // very hacky
    // continue to look for css solution
    _compassAction(action) {
        let button;
        if (action.shadowRoot) {
            button = action.shadowRoot.querySelector('.button');
            if (button) {
                button.style.borderRadius = '50%';
            }
            else {
                setTimeout(() => {
                    this._compassAction(action);
                }, 100);
            }
        }
        else {
            setTimeout(() => {
                this._compassAction(action);
            }, 100);
        }
    }
    _createCustomActions() {
        const { actions, scale } = this;
        this._actions = (widget_1.tsx("div", null,
            widget_1.tsx("calcite-action-group", null, actions.map((action) => {
                const { title, icon } = action;
                return (widget_1.tsx("calcite-action", { scale: scale, title: title, text: title, icon: icon, onclick: (evt) => {
                        action.onclick(evt.target);
                    } }));
            }))));
    }
};
tslib_1.__decorate([
    decorators_1.property()
], CalciteNavigation.prototype, "view", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalciteNavigation.prototype, "include", void 0);
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], CalciteNavigation.prototype, "zoom", void 0);
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], CalciteNavigation.prototype, "home", void 0);
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], CalciteNavigation.prototype, "locate", void 0);
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], CalciteNavigation.prototype, "fullscreen", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalciteNavigation.prototype, "fullscreenElement", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalciteNavigation.prototype, "actions", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalciteNavigation.prototype, "theme", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalciteNavigation.prototype, "scale", void 0);
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], CalciteNavigation.prototype, "_hasRotation", void 0);
tslib_1.__decorate([
    decorators_1.property()
], CalciteNavigation.prototype, "_actions", void 0);
tslib_1.__decorate([
    decorators_1.property({
        aliasOf: 'view.rotation',
    }),
    widget_1.renderable()
], CalciteNavigation.prototype, "_r", void 0);
CalciteNavigation = tslib_1.__decorate([
    decorators_1.subclass('cov.widgets.CalciteNavigation')
], CalciteNavigation);
exports.default = CalciteNavigation;
