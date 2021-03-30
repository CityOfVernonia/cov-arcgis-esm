import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';
interface VernoniaLoadingProperties extends esri.WidgetProperties {
    title?: string;
    delay?: number;
    fadeDelay?: number;
}
export default class LoadingScreen extends Widget {
    title: string;
    delay: number;
    fadeDelay: number;
    private _heart;
    private _coffee;
    constructor(properties?: VernoniaLoadingProperties);
    end(): void;
    render(): tsx.JSX.Element;
}
export {};
