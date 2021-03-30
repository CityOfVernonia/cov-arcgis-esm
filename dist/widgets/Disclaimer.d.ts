/**
 * A widget to display a disclaimer with a `Don't show me this again` option.
 */
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
export default class Disclaimer extends Widget {
    title: string;
    disclaimer: string;
    static isAccepted(): boolean;
    render(): tsx.JSX.Element;
    private _accept;
}
