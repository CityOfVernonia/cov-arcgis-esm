import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';
interface MapTitleProperties extends esri.WidgetProperties {
    title?: string;
}
export default class MapTitle extends Widget {
    title: string;
    constructor(properties?: MapTitleProperties);
    render(): tsx.JSX.Element;
}
export {};
