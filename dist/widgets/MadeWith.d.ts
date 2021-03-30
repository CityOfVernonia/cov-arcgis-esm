import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
export default class MadeWith extends Widget {
    size: string;
    color: string;
    backgroundColor: string;
    opacity: number;
    render(): tsx.JSX.Element;
}
