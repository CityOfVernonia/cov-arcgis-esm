/**
 * Widget to display when auth is required to access an app.
 */
import cov = __cov;
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
export default class SignInRequired extends Widget {
    oAuthViewModel: cov.OAuthViewModel;
    private _signIn;
    render(): tsx.JSX.Element;
}
