import { __decorate } from "tslib";
import { whenOnce } from '@arcgis/core/core/watchUtils';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { renderable, tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import CustomContent from '@arcgis/core/popup/content/CustomContent';
let KEY = 0;
const CSS = {
    table: 'esri-widget__table',
    th: 'esri-feature__field-header',
    td: 'esri-feature__field-data',
};
let Content = class Content extends Widget {
    constructor(properties) {
        super(properties);
        this.accessorValues = [];
    }
    postInitialize() {
        whenOnce(this, 'graphic', this.getAccessorValues.bind(this));
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
                    accessorValues.push(tsx("tr", { key: KEY++ },
                        tsx("td", { class: CSS.td },
                            tsx("strong", null,
                                "Tax Account ",
                                attributes.ACCOUNT_ID)),
                        tsx("td", null, "Land / Improvement Values")));
                    accessorValues.push(tsx("tr", { key: KEY++ },
                        tsx("th", { class: CSS.th }, "Assessed Value"),
                        tsx("td", { class: CSS.td },
                            "$",
                            attributes.AV_LAND.toLocaleString('en'),
                            " / $",
                            attributes.AV_IMPR.toLocaleString('en'))));
                    accessorValues.push(tsx("tr", { key: KEY++ },
                        tsx("th", { class: CSS.th }, "Real Market Value"),
                        tsx("td", { class: CSS.td },
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
            return (tsx("p", null,
                "Note: This tax lot is clipped to the City of Vernonia area spatial extent. No tax lot data is provided here. Please visit the",
                ' ',
                tsx("a", { href: "https://www.columbiacountyor.gov/departments/Assessor", target: "_blank", rel: "noopener" }, "Columbia County Assessor's"),
                ' ',
                "web site for tax lot information."));
        }
        return (tsx("table", { class: CSS.table },
            tsx("tr", null,
                tsx("th", { class: CSS.th }, "Tax Lot"),
                attributes.VERNONIA === 1 ? (tsx("td", { class: CSS.td },
                    tsx("a", { href: `https://www.vernonia-or.gov/tax-lot/${attributes.TAXLOT_ID}/`, target: "_blank" }, attributes.TAXLOT_ID))) : (tsx("td", { class: CSS.td }, attributes.TAXLOT_ID))),
            tsx("tr", null,
                tsx("th", { class: CSS.th }, "Tax Map"),
                tsx("td", { class: CSS.td },
                    tsx("a", { href: `http://65.122.151.216/geomoose2/taxlots_map_images/${attributes.TAXMAP}`, target: "_blank", rel: "noopener" }, `${attributes.TOWN}${attributes.TOWN_DIR}${attributes.RANGE}${attributes.RANGE_DIR} ${attributes.SECTION} ${attributes.QTR}${attributes.QTR_QTR}`))),
            tsx("tr", null,
                tsx("th", { class: CSS.th }, "Owner"),
                tsx("td", { class: CSS.td }, attributes.OWNER)),
            attributes.ADDRESS ? (tsx("tr", null,
                tsx("th", { class: CSS.th }, "Address (Primary Situs)"),
                tsx("td", { class: CSS.td },
                    tsx("a", { href: `https://www.google.com/maps/place/${attributes.ADDRESS.split(' ').join('+')}+${attributes.CITY}=${attributes.STATE}+${attributes.ZIP}/data=!3m1!1e3`, target: "_blank", rel: "noopener" }, attributes.ADDRESS)))) : null,
            tsx("tr", null,
                tsx("th", { class: CSS.th }, "Area"),
                tsx("td", { class: CSS.td },
                    tsx("span", { style: "margin-right:0.75rem;" }, `${attributes.ACRES} acres`),
                    tsx("span", null, `${attributes.SQ_FEET.toLocaleString()} sq ft`))),
            tsx("tr", null,
                tsx("th", { class: CSS.th }, "Tax Account(s)"),
                tsx("td", { class: CSS.td }, attributes.ACCOUNT_IDS.split(',').map((accountId) => {
                    return (tsx("a", { style: "margin-right:0.75rem;", href: `http://www.helioncentral.com/columbiaat/MainQueryDetails.aspx?AccountID=${accountId}&QueryYear=2021&Roll=R`, target: "_blank", rel: "noopener" }, accountId));
                }))),
            this.accessorValues));
    }
};
__decorate([
    property()
], Content.prototype, "graphic", void 0);
__decorate([
    property(),
    renderable()
], Content.prototype, "accessorValues", void 0);
Content = __decorate([
    subclass('cov.popups.TaxLotPopup.Content')
], Content);
let TaxLotPopup = class TaxLotPopup extends PopupTemplate {
    constructor() {
        super(...arguments);
        this.title = `{TAXLOT_ID}`;
        this.outFields = ['*'];
        this.customContent = new CustomContent({
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
__decorate([
    property()
], TaxLotPopup.prototype, "title", void 0);
__decorate([
    property()
], TaxLotPopup.prototype, "outFields", void 0);
__decorate([
    property()
], TaxLotPopup.prototype, "customContent", void 0);
__decorate([
    property()
], TaxLotPopup.prototype, "content", void 0);
TaxLotPopup = __decorate([
    subclass('cov.popups.TaxLotPopup')
], TaxLotPopup);
export default TaxLotPopup;
