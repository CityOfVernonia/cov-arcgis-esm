/**
 * A map navigation widget to replace the default zoom control, including optional compass, home, locate and fullscreen controls.
 */
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import ZoomViewModel from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import HomeViewModel from '@arcgis/core/widgets/Home/HomeViewModel';
import LocateViewModel from '@arcgis/core/widgets/Locate/LocateViewModel';
import FullscreenViewModel from '@arcgis/core/widgets/Fullscreen/FullscreenViewModel';
export default class MapNavigation extends Widget {
    /**
     * Map view.
     */
    view: esri.MapView | esri.SceneView;
    /**
     * Include compass.
     *
     * @default true
     */
    compass: boolean;
    /**
     * Include home.
     *
     * @default true
     */
    home: boolean;
    /**
     * Include locate.
     *
     * @default true
     */
    locate: boolean;
    /**
     * Include fullscreen.
     *
     * @default true
     */
    fullscreen: boolean;
    /**
     * Fullscreen HTML element.
     * An element or a querySelector string.
     */
    fullscreenElement: string | HTMLElement;
    /**
     * Include button to switch between 2D/3D.
     *
     * @default false
     */
    viewSwitcher: boolean;
    /**
     * Function to go 2D.
     */
    go2D: () => void;
    /**
     * Function to go 23D.
     */
    go3D: () => void;
    protected zoomViewModel: ZoomViewModel;
    protected homeViewModel: HomeViewModel;
    protected locateViewModel: LocateViewModel;
    protected fullscreenViewModel: FullscreenViewModel;
    private _viewRotation;
    private _fullscreenState;
    postInitialize(): void;
    render(): tsx.JSX.Element;
}
