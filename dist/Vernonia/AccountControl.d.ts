import cov = __cov;
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';
interface AccountControlProperties extends esri.WidgetProperties {
    oAuthViewModel: cov.OAuthViewModel;
}
export default class AccountControl extends Widget {
    oAuthViewModel: cov.OAuthViewModel;
    user: esri.PortalUser;
    constructor(properties: AccountControlProperties);
    render(): tsx.JSX.Element;
}
export {};
