"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const watchUtils_1 = require("@arcgis/core/core/watchUtils");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = tslib_1.__importDefault(require("@arcgis/core/widgets/Widget"));
const PopupTemplate_1 = tslib_1.__importDefault(require("@arcgis/core/PopupTemplate"));
const CustomContent_1 = tslib_1.__importDefault(require("@arcgis/core/popup/content/CustomContent"));
let KEY = 0;
const CSS = {
    table: 'esri-widget__table',
    th: 'esri-feature__field-header',
    td: 'esri-feature__field-data',
};
let Content = class Content extends Widget_1.default {
    constructor(properties) {
        super(properties);
        this.accessorValues = [];
    }
    postInitialize() {
        watchUtils_1.whenOnce(this, 'graphic', this.getAccessorValues.bind(this));
    }
    getAccessorValues() {
        const { graphic, accessorValues } = this;
        const { layer, attributes } = graphic;
        const objectId = attributes[layer.objectIdField];
        layer
            .queryRelatedFeatures({
            outFields: ['*'],
            relationshipId: 0,
            objectIds: [objectId],
        })
            .then((result) => {
            const features = result[objectId].features;
            if (features.length) {
                features.forEach((feature) => {
                    const { attributes } = feature;
                    accessorValues.push(widget_1.tsx("tr", { key: KEY++ },
                        widget_1.tsx("td", { class: CSS.td },
                            widget_1.tsx("strong", null,
                                "Tax Account ",
                                attributes.ACCOUNT_ID)),
                        widget_1.tsx("td", null, "Land / Improvement Values")));
                    accessorValues.push(widget_1.tsx("tr", { key: KEY++ },
                        widget_1.tsx("th", { class: CSS.th }, "Assessed Value"),
                        widget_1.tsx("td", { class: CSS.td },
                            "$",
                            attributes.AV_LAND.toLocaleString('en'),
                            " / $",
                            attributes.AV_IMPR.toLocaleString('en'))));
                    accessorValues.push(widget_1.tsx("tr", { key: KEY++ },
                        widget_1.tsx("th", { class: CSS.th }, "Real Market Value"),
                        widget_1.tsx("td", { class: CSS.td },
                            "$",
                            attributes.RMV_LAND.toLocaleString('en'),
                            " / $",
                            attributes.RMV_IMPR.toLocaleString('en'))));
                });
            }
        })
            .catch((error) => {
            console.log(error);
        });
    }
    render() {
        const attributes = this.graphic.attributes;
        if (attributes.BNDY_CLIPPED) {
            return (widget_1.tsx("p", null,
                "Note: This tax lot is clipped to the City of Vernonia area spatial extent. No tax lot data is provided here. Please visit the",
                ' ',
                widget_1.tsx("a", { href: "https://www.columbiacountyor.gov/departments/Assessor", target: "_blank", rel: "noopener" }, "Columbia County Assessor's"),
                ' ',
                "web site for tax lot information."));
        }
        return (widget_1.tsx("table", { class: CSS.table },
            widget_1.tsx("tr", null,
                widget_1.tsx("th", { class: CSS.th }, "Tax Lot"),
                attributes.VERNONIA === 1 ? (widget_1.tsx("td", { class: CSS.td },
                    widget_1.tsx("a", { href: `https://www.vernonia-or.gov/tax-lot/${attributes.TAXLOT_ID}/`, target: "_blank" }, attributes.TAXLOT_ID))) : (widget_1.tsx("td", { class: CSS.td }, attributes.TAXLOT_ID))),
            widget_1.tsx("tr", null,
                widget_1.tsx("th", { class: CSS.th }, "Tax Map"),
                widget_1.tsx("td", { class: CSS.td },
                    widget_1.tsx("a", { href: `http://65.122.151.216/geomoose2/taxlots_map_images/${attributes.TAXMAP}`, target: "_blank", rel: "noopener" }, `${attributes.TOWN}${attributes.TOWN_DIR}${attributes.RANGE}${attributes.RANGE_DIR} ${attributes.SECTION} ${attributes.QTR}${attributes.QTR_QTR}`))),
            widget_1.tsx("tr", null,
                widget_1.tsx("th", { class: CSS.th }, "Owner"),
                widget_1.tsx("td", { class: CSS.td }, attributes.OWNER)),
            attributes.ADDRESS ? (widget_1.tsx("tr", null,
                widget_1.tsx("th", { class: CSS.th }, "Address (Primary Situs)"),
                widget_1.tsx("td", { class: CSS.td },
                    widget_1.tsx("a", { href: `https://www.google.com/maps/place/${attributes.ADDRESS.split(' ').join('+')}+${attributes.CITY}=${attributes.STATE}+${attributes.ZIP}/data=!3m1!1e3`, target: "_blank", rel: "noopener" }, attributes.ADDRESS)))) : null,
            widget_1.tsx("tr", null,
                widget_1.tsx("th", { class: CSS.th }, "Area"),
                widget_1.tsx("td", { class: CSS.td },
                    widget_1.tsx("span", { style: "margin-right:0.75rem;" }, `${attributes.ACRES} acres`),
                    widget_1.tsx("span", null, `${attributes.SQ_FEET.toLocaleString()} sq ft`))),
            widget_1.tsx("tr", null,
                widget_1.tsx("th", { class: CSS.th }, "Tax Account(s)"),
                widget_1.tsx("td", { class: CSS.td }, attributes.ACCOUNT_IDS.split(',').map((accountId) => {
                    return (widget_1.tsx("a", { style: "margin-right:0.75rem;", href: `http://www.helioncentral.com/columbiaat/MainQueryDetails.aspx?AccountID=${accountId}&QueryYear=2021&Roll=R`, target: "_blank", rel: "noopener" }, accountId));
                }))),
            this.accessorValues));
    }
};
tslib_1.__decorate([
    decorators_1.property()
], Content.prototype, "graphic", void 0);
tslib_1.__decorate([
    decorators_1.property(),
    widget_1.renderable()
], Content.prototype, "accessorValues", void 0);
Content = tslib_1.__decorate([
    decorators_1.subclass('cov.popups.TaxLotPopup.Content')
], Content);
let TaxLotPopup = class TaxLotPopup extends PopupTemplate_1.default {
    constructor() {
        super(...arguments);
        this.title = `{TAXLOT_ID}`;
        this.outFields = ['*'];
        this.customContent = new CustomContent_1.default({
            outFields: ['*'],
            creator: (evt) => {
                return new Content({
                    graphic: evt.graphic,
                });
            },
        });
        this.content = [this.customContent];
    }
};
tslib_1.__decorate([
    decorators_1.property()
], TaxLotPopup.prototype, "title", void 0);
tslib_1.__decorate([
    decorators_1.property()
], TaxLotPopup.prototype, "outFields", void 0);
tslib_1.__decorate([
    decorators_1.property()
], TaxLotPopup.prototype, "customContent", void 0);
tslib_1.__decorate([
    decorators_1.property()
], TaxLotPopup.prototype, "content", void 0);
TaxLotPopup = tslib_1.__decorate([
    decorators_1.subclass('cov.popups.TaxLotPopup')
], TaxLotPopup);
exports.default = TaxLotPopup;
