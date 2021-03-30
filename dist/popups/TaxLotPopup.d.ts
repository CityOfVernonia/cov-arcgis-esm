import esri = __esri;
import PopupTemplate from '@arcgis/core/PopupTemplate';
export default class TaxLotPopup extends PopupTemplate {
    title: string;
    outFields: string[];
    customContent: esri.CustomContent;
    content: esri.CustomContent[];
}
