import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';
interface DisclaimerModalProperties extends esri.WidgetProperties {
    title?: string;
    message?: string;
}
export default class DisclaimerModal extends Widget {
    title: string;
    message: string;
    private _active;
    constructor(properties?: DisclaimerModalProperties);
    static isAccepted(): boolean;
    private _clickEvent;
    render(): tsx.JSX.Element;
}
export {};
