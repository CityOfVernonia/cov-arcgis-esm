import { __decorate } from "tslib";
import Widget from '@arcgis/core/widgets/Widget';
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
const CSS = {
    loading: 'cov-vernonia--loading-screen',
    loadingInfo: 'cov-vernonia--loading-screen_info',
    loadingHeart: 'cov-vernonia--loading-screen_heart',
    loadingCoffee: 'cov-vernonia--loading-screen_coffee',
    loadingBuiltWith: 'cov-vernonia--loading-screen_built-with',
};
let LoadingScreen = class LoadingScreen extends Widget {
    constructor(properties) {
        super(properties);
        this.title = 'Vernonia';
        this.delay = 4;
        this.fadeDelay = 1;
        this._heart = 'M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z';
        this._coffee = 'M192 384h192c53 0 96-43 96-96h32c70.6 0 128-57.4 128-128S582.6 32 512 32H120c-13.3 0-24 10.7-24 24v232c0 53 43 96 96 96zM512 96c35.3 0 64 28.7 64 64s-28.7 64-64 64h-32V96h32zm47.7 384H48.3c-47.6 0-61-64-36-64h583.3c25 0 11.8 64-35.9 64z';
        // add directly to <body>
        this.container = document.createElement('div');
        document.body.append(this.container);
    }
    end() {
        const { delay, fadeDelay } = this;
        setTimeout(() => {
            this.container.style.opacity = '0';
        }, (delay - fadeDelay) * 1000);
        setTimeout(() => {
            this.destroy();
        }, delay * 1000);
    }
    render() {
        const { title, fadeDelay, _heart, _coffee } = this;
        return (tsx("div", { class: CSS.loading, style: `transition: opacity ${fadeDelay}s;` },
            tsx("div", { class: CSS.loadingInfo },
                tsx("p", null,
                    "Loading ",
                    title),
                tsx("calcite-progress", { type: "indeterminate" }),
                tsx("p", null,
                    "Copyright \u00A9 ",
                    new Date().getFullYear(),
                    " City of Vernonia"),
                tsx("p", null,
                    tsx("span", null, "Made with"),
                    tsx("svg", { class: CSS.loadingHeart, "aria-hidden": "true", focusable: "false", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
                        tsx("path", { fill: "currentColor", d: _heart })),
                    tsx("span", null, "and"),
                    tsx("svg", { class: CSS.loadingCoffee, "aria-hidden": "true", focusable: "false", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 640 512" },
                        tsx("path", { fill: "currentColor", d: _coffee })),
                    tsx("span", null, "in Vernonia, Oregon"))),
            tsx("p", { class: CSS.loadingBuiltWith }, "Built with Esri's JavaScript API and Calcite")));
    }
};
__decorate([
    property()
], LoadingScreen.prototype, "title", void 0);
__decorate([
    property()
], LoadingScreen.prototype, "delay", void 0);
__decorate([
    property()
], LoadingScreen.prototype, "fadeDelay", void 0);
__decorate([
    property()
], LoadingScreen.prototype, "_heart", void 0);
__decorate([
    property()
], LoadingScreen.prototype, "_coffee", void 0);
LoadingScreen = __decorate([
    subclass('cov.Vernonia.LoadingScreen')
], LoadingScreen);
export default LoadingScreen;
