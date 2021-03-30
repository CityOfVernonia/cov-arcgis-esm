/**
 * The primary layout for City of Vernonia web mapping applications.
 */
/**
 * `cov` namespace and calcite component definitions.
 */
import cov = __cov;
import '@esri/calcite-components';
/**
 * Base class and support modules.
 */
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';
/**
 * Widget view model.
 */
import VernoniaViewModel from './Vernonia/VernoniaViewModel';
/**
 * Widgets loaded by the layout.
 */
import CalciteNavigation from './widgets/CalciteNavigation';
export default class Vernonia extends Widget {
    /**
     * View model.
     */
    viewModel: VernoniaViewModel;
    /**
     * Constructor properties.
     */
    view: esri.MapView;
    title: string;
    viewTitle: boolean;
    disclaimerOptions: cov.VernoniaDisclaimerOptions;
    navigationOptions: cov.CalciteNavigationProperties;
    searchViewModel: esri.SearchViewModel;
    oAuthViewModel: cov.OAuthViewModel;
    widgets: (cov.VernoniaPanelWidgetProperties | cov.VernoniaViewWidgetProperties)[];
    navigation: CalciteNavigation;
    /**
     * Menu and operational panels.
     */
    menuPanelState: cov.VernoniaPanelState;
    operationalPanelState: cov.VernoniaPanelState;
    /**
     * Loading screen widget.
     */
    private _loadingScreen;
    private _leadingVisible;
    private _trailingVisible;
    constructor(properties: cov.VernoniaProperties);
    /**
     * Intialize the view and layout.
     * @param view esri.MapView
     */
    private _initView;
    /**
     * Add UI components.
     * @param view esri.MapView
     * @param viewWidgets cov.VernoniaViewWidgetProperties[]
     */
    private _initUI;
    /**
     * Add panel actions and widgets.
     * @param panelState cov.VernoniaPanelState
     * @param properties cov.VernoniaPanelWidgetProperties
     */
    private _initPanelWidget;
    /**
     * Adds calcite-avatar and AccountControl widget to menu panel if signed in, or if not, adds action-item to sign in.
     * @param oAuthViewModel cov.OAuthViewModel
     * @param panelState cov.VernoniaPanelState
     */
    private _initAccountControl;
    /**
     * Panel calcite-action click event.
     * @param panelState cov.VernoniaPanelState
     * @param clickEvent Event
     */
    private _panelActionClickEvent;
    render(): tsx.JSX.Element;
}
