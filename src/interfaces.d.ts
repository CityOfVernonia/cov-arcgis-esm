import esri = __esri;

type HashMap<T> = Record<string, T>;

declare namespace __cov {
  ////////////////////////////////////////////////////
  // View models.
  ////////////////////////////////////////////////////

  // cov/viewModels/MeasureViewModel
  export interface MeasureState {
    action:
      | 'ready'
      | 'measuringLength'
      | 'measuringArea'
      | 'length'
      | 'area'
      | 'queryingLocation'
      | 'location'
      | 'queryingElevation'
      | 'elevation';
    length: number;
    area: number;
    x: number | string;
    y: number | string;
    z: number;
  }

  export interface MeasureViewModelProperties extends Object {
    /**
     * Map view.
     */
    view?: esri.MapView;
    /**
     * Show text graphic in view.
     * @default true
     */
    showText?: boolean;
    /**
     * Color for markers, lines, and text.
     * Any color the API recognizes https://developers.arcgis.com/javascript/latest/api-reference/esri-Color.html.
     * @default [230, 82, 64]
     */
    color?: any;
    /**
     * Color for fills.
     * Any color the API recognizes https://developers.arcgis.com/javascript/latest/api-reference/esri-Color.html.
     * @default [230, 82, 64, 0.15]
     */
    fillColor?: any;
  }

  export class MeasureViewModel extends esri.Accessor {
    constructor(properties?: MeasureViewModelProperties);
    view: esri.MapView;
    showText: boolean;
    color: any;
    fillColor: any;
    protected hasGround: boolean;
    protected state: MeasureState;
    protected units: UnitsViewModel;
    protected draw: esri.Draw;
    protected ground: esri.Ground;
    protected layer: GraphicsLayer;
    clear: () => void;
    length: () => void;
    area: () => void;
    location: () => void;
    elevation: () => void;
  }

  // cov/viewModels/OAuthViewModel
  export interface OAuthViewModelProperties extends Object {
    /**
     * esri.portal.Portal instance to sign into.
     */
    portal: esri.Portal;
    /**
     * esri.identity.OAuthInfo instance to perform authentication against.
     */
    oAuthInfo: esri.OAuthInfo;
    /**
     * Alternate sign in url.
     *
     * Overrides default `${portal.url}/sharing/rest`.
     */
    signInUrl?: string;
  }

  export class OAuthViewModel extends esri.Accessor {
    constructor(properties: OAuthViewModelProperties);
    portal: esri.Portal;
    oAuthInfo: esri.OAuthInfo;
    signInUrl: string;
    credential: esri.Credential;
    user: esri.PortalUser;
    name: string;
    username: string;
    signedIn: boolean;
    load(): Promise<boolean>;
    signIn(): void;
    signOut(): void;
  }

  // cov/viewModels/UnitsViewModel
  export interface UnitsViewModelProperties extends Object {
    /**
     * CSS class string for <select>s.
     *
     * @default 'esri-select'
     */
    selectClass?: string;
    /**
     * Current location unit.
     */
    locationUnit?: string;
    /**
     * Available location unit and display text key/value pairs.
     */
    locationUnits?: HashMap<string>;
    /**
     * Current length unit.
     */
    lengthUnit?: esri.LinearUnits;
    /**
     * Available length unit and display text key/value pairs.
     */
    lengthUnits?: HashMap<string>;
    /**
     * Current area unit.
     */
    areaUnit?: esri.ArealUnits;
    /**
     * Available area unit and display text key/value pairs.
     */
    areaUnits?: HashMap<string>;
    /**
     * Current elevation unit.
     */
    elevationUnit?: string;
    /**
     * Available elevation unit and display text key/value pairs.
     */
    elevationUnits?: HashMap<string>;
  }

  export class UnitsViewModel extends esri.Accessor {
    constructor(properties?: UnitsViewModelProperties);
    selectClass: string;
    locationUnit: string;
    locationUnits: HashMap<string>;
    lengthUnit: esri.LinearUnits;
    lengthUnits: HashMap<string>;
    areaUnit: esri.ArealUnits;
    areaUnits: HashMap<string>;
    elevationUnit: string;
    elevationUnits: HashMap<string>;
    locationSelect(name?: null | string, title?: null | string): tsx.JSX.Element;
    lengthSelect(name?: null | string, title?: null | string): tsx.JSX.Element;
    areaSelect(name?: null | string, title?: null | string): tsx.JSX.Element;
    elevationSelect(name?: null | string, title?: null | string): tsx.JSX.Element;
  }

  ////////////////////////////////////////////////////
  // Layouts.
  ////////////////////////////////////////////////////

  // cov/layouts/FullView
  export interface FullViewProperties extends esri.WidgetProperties {
    /**
     * Map or scene view.
     */
    view: esri.MapView | esri.SceneView;
    /**
     * Title in upper left corner.
     */
    title?: string;
  }

  export class FullView extends esri.Widget {
    constructor(properties: FullViewProperties);
    view: esri.MapView | esri.SceneView;
    title: string;
  }

  // cov/layouts/MapWidgetTable
  export interface MapWidgetTableProperties extends esri.WidgetProperties {
    /**
     * Map view instance.
     */
    view: esri.MapView;
    /**
     * Feature table instance.
     */
    featureTable: esri.FeatureTable;
    /**
     * Any widget class extending esri.Widget.
     */
    widget: esri.Widget;
  }

  export class MapWidgetTable extends esri.Widget {
    constructor(properties: MapWidgetTableProperties);
    view: esri.MapView;
    featureTable: esri.FeatureTable;
    widget: esri.Widget;
  }

  // cov/layouts/Vernonia
  export interface VernoniaExpandWidgetProperties extends Object {
    widget: esri.Widget;
    expand: esri.ExpandProperties;
  }

  export interface VernoniaProperties extends esri.WidgetProperties {
    /**
     * Map or scene view.
     */
    view: esri.MapView | esri.SceneView;
    /**
     * Application title.
     */
    title?: string;
    /**
     * Make it with love and coffee in tuff town.
     * @default true
     */
    madeWith?: boolean;
    /**
     * OAuth view model. Adds user control to header when provided.
     */
    oAuthViewModel?: cov.OAuthViewModel;
    /**
     * Include header search.
     * @default true
     */
    headerSearch?: boolean;
    /**
     * Search view model to run header search.
     * NOTE: will not override `headerSearch: false`.
     */
    searchViewModel?: esri.SearchViewModel;
    /**
     * Next basemap instance. Adds BasemapToggle to bottom right when provided.
     */
    nextBasemap?: esri.Basemap;
    /**
     * Widgets to add.
     */
    widgets?: VernoniaExpandWidgetProperties[];
  }

  export class Vernonia extends esri.Widget {
    constructor(properties: VernoniaProperties);
    view: esri.MapView | esri.SceneView;
    title: string;
    madeWith: boolean;
    oAuthViewModel: cov.OAuthViewModel;
    headerSearch: boolean;
    searchViewModel: esri.SearchViewModel;
    nextBasemap: esri.Basemap;
    widgets: VernoniaExpandWidgetProperties[];
  }

  ////////////////////////////////////////////////////
  // Widgets.
  ////////////////////////////////////////////////////

  // cov/widgets/CalcitePrint
  export interface CalciteMeasureProperties extends esri.WidgetProperties {
    view?: esri.MapView;
    /**
     * Widget theme.
     * @default 'light'
     */
    theme?: 'light' | 'dark';
    /**
     * Widget width.
     * @default 'm'
     */
    widthScale?: 's' | 'm' | 'l';
    /**
     * Component scale.
     * @default 's'
     */
    scale?: 's' | 'm' | 'l';
    /**
     * Show text with geometry in map when measuring.
     * @default false
     */
    showText?: boolean;
    /**
     * Color for markers, lines, and text.
     * Any color the API recognizes https://developers.arcgis.com/javascript/latest/api-reference/esri-Color.html.
     * @default [230, 82, 64]
     */
    color?: any;
    /**
     * Color for fills.
     * Any color the API recognizes https://developers.arcgis.com/javascript/latest/api-reference/esri-Color.html.
     * @default [230, 82, 64, 0.15]
     */
    fillColor?: any;
  }

  export class CalciteMeasure extends esri.Widget {
    constructor(properties?: CalciteMeasureProperties);
    view: esri.MapView;
    theme: 'light' | 'dark';
    widthScale: 's' | 'm' | 'l';
    scale: 's' | 'm' | 'l';
    showText: boolean;
    color: any;
    fillColor: any;
    viewModel: MeasureViewModel;
    protected state: MeasureState;
    protected units: UnitsViewModel;
    protected hasGround: boolean;
    clear(): void;
    length(): void;
    area(): void;
    location(): void;
    elevation(): void;
  }

  // cov/widgets/CalcitePrint
  // not production ready
  export interface CalcitePrintProperties extends esri.WidgetProperties {
    view: esri.MapView | esri.SceneView;
    printServiceUrl: string;
    printTitle?: string;
  }

  export class CalcitePrint extends esri.Widget {
    view: esri.MapView | esri.SceneView;
    printServiceUrl: string;
    printTitle: string;
  }

  // cov/widgets/Disclaimer
  export interface DisclaimerProperties extends esri.WidgetProperties {
    /**
     * Disclaimer title (usually the application title).
     *
     * @default 'Disclaimer'
     */
    title?: string;
    /**
     * Disclaimer text.
     *
     * @default 'There are no warranties, expressed or implied, including the warranty of merchantability or fitness for a particular purpose, accompanying this application.'
     */
    disclaimer?: string;
  }

  export class Disclaimer extends esri.Widget {
    constructor(properties?: DisclaimerProperties);
    title: string;
    disclaimer: string;
    static isAccepted(): boolean;
    on(type: 'accepted', listener: () => void): IHandle;
  }

  // cov/widgets/LayerListLegend
  export interface LayerListLegendProperties extends esri.WidgetProperties {
    /**
     * Map or scene view.
     */
    view?: esri.MapView | esri.SceneView;
    /**
     * Any and all LayerList widget properties.
     */
    layerListProperties?: esri.LayerListProperties;
    /**
     * Any and all Legend widget properties.
     */
    legendProperties?: esri.LegendProperties;
  }

  export class LayerListLegend extends esri.Widget {
    constructor(properties?: LayerListLegendProperties);
    view: esri.MapView | esri.SceneView;
    layerListProperties: esri.LayerListProperties;
    legendProperties: esri.LegendProperties;
  }

  // cov/widgets/MadeWith
  export interface MadeWithProperties extends esri.WidgetProperties {
    /**
     * Any valid CSS color...hex, rgb, rgba.
     */
    color?: string;
    /**
     * Any valid CSS size...px, rem, etc.
     */
    size?: string;
  }

  export class MadeWith extends esri.Widget {
    constructor(properties?: MadeWithProperties);
    color: string;
    size: string;
  }

  // cov/widgets/MapNavigation
  export interface MapNavigationProperties extends esri.WidgetProperties {
    /**
     * Map view.
     */
    view?: esri.MapView | esri.SceneView;
    /**
     * Include compass.
     *
     * @default true
     */
    compass?: boolean;
    /**
     * Include home.
     *
     * @default true
     */
    home?: boolean;
    /**
     * Include locate.
     *
     * @default true
     */
    locate?: boolean;
    /**
     * Include fullscreen.
     *
     * @default true
     */
    fullscreen?: boolean;
    /**
     * Fullscreen HTML element.
     * An element or a querySelector string.
     */
    fullscreenElement?: string | HTMLElement;
    /**
     * Include button to switch between 2D/3D.
     *
     * @default false
     */
    viewSwitcher?: boolean;
    /**
     * Function to go 2D.
     */
    go2D?: () => void;
    /**
     * Function to go 23D.
     */
    go3D?: () => void;
  }

  export class MapNavigation extends esri.Widget {
    constructor(properties: MapNavigationProperties);
    view: esri.MapView | esri.SceneView;
    compass: boolean;
    home: boolean;
    locate: boolean;
    fullscreen: boolean;
    fullscreenElement: string | HTMLElement;
    viewSwitcher: boolean;
    go2D: () => void;
    go3D: () => void;
    on(type: 'view-switch', listener: (viewSwitch: '2d' | '3d') => void): IHandle;
    protected zoomViewModel: esri.ZoomViewModel;
    protected homeViewModel: esri.HomeViewModel;
    protected locateViewModel: esri.LocateViewModel;
    protected fullscreenViewModel: esri.FullscreenViewModel;
  }

  // cov/widgets/Measure
  export interface MeasureProperties extends esri.WidgetProperties {
    /**
     * Map view.
     */
    view?: esri.MapView;
    /**
     * An elevation layer instance or elevation service URL.
     */
    elevationLayer: ElevationLayer | string;
  }

  export class Measure extends esri.Widget {
    constructor(properties: MeasureProperties);
    view: esri.MapView;
    elevationLayer: ElevationLayer | string;
  }

  // cov/widgets/Share
  export interface ShareProperties extends esri.WidgetProperties {}

  export class Share extends esri.Widget {
    constructor(properties?: ShareProperties);
  }

  /**
   * Popups.
   */

  export class TaxLotPopup extends esri.PopupTemplate {}

  /**
   * Helpers.
   */

  // code some helpers
}

/**
 * Modules.
 */

////////////////////////////////////////////////////
// View models.
////////////////////////////////////////////////////

declare module 'cov/viewModels/MeasureViewModel' {
  import MeasureViewModel = __cov.MeasureViewModel;
  export = MeasureViewModel;
}

declare module 'cov/viewModels/OAuthViewModel' {
  import OAuthViewModel = __cov.OAuthViewModel;
  export = OAuthViewModel;
}

declare module 'cov/viewModels/UnitsViewModel' {
  import UnitsViewModel = __cov.UnitsViewModel;
  export = UnitsViewModel;
}

////////////////////////////////////////////////////
// Layouts.
////////////////////////////////////////////////////

declare module 'cov/layouts/FullView' {
  import FullView = __cov.FullView;
  export = FullView;
}

declare module 'cov/layouts/MapWidgetTable' {
  import MapWidgetTable = __cov.MapWidgetTable;
  export = MapWidgetTable;
}

declare module 'cov/layouts/Vernonia' {
  import Vernonia = __cov.Vernonia;
  export = Vernonia;
}

////////////////////////////////////////////////////
// Widgets.
////////////////////////////////////////////////////

declare module 'cov/widgets/CalciteMeasure' {
  import CalciteMeasure = __cov.CalciteMeasure;
  export = CalciteMeasure;
}

declare module 'cov/widgets/CalcitePrint' {
  import CalcitePrint = __cov.CalcitePrint;
  export = CalcitePrint;
}

declare module 'cov/widgets/Disclaimer' {
  import Disclaimer = __cov.Disclaimer;
  export = Disclaimer;
}

declare module 'cov/widgets/LayerListLegend' {
  import LayerListLegend = __cov.LayerListLegend;
  export = LayerListLegend;
}

declare module 'cov/widgets/MadeWith' {
  import MadeWith = __cov.MadeWith;
  export = MadeWith;
}

declare module 'cov/widgets/MapNavigation' {
  import MapNavigation = __cov.MapNavigation;
  export = MapNavigation;
}

declare module 'cov/widgets/Measure' {
  import Measure = __cov.Measure;
  export = Measure;
}

declare module 'cov/widgets/Share' {
  import Share = __cov.Share;
  export = Share;
}

////////////////////////////////////////////////////
// Popups.
////////////////////////////////////////////////////

declare module 'cov/popups/TaxLotPopup' {
  import TaxLotPopup = __cov.TaxLotPopup;
  export = TaxLotPopup;
}
