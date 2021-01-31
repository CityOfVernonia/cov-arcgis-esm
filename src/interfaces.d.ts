import esri = __esri;

type HashMap<T> = Record<string, T>;

declare namespace __cov {
  /**
   * View models.
   */

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

  /**
   * Layouts.
   */

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

  /**
   * Widgets.
   */

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
}
