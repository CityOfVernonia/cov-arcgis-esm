/**
 * A widget share an app via facebook and twitter.
 */
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
export default class Share extends Widget {
    postInitialize(): void;
    render(): tsx.JSX.Element;
}
