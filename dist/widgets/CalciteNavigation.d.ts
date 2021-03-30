/**
 * Map navigation widget in Calcite.
 */
import cov = __cov;
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';
import '@esri/calcite-components';
import ZoomViewModel from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import HomeViewModel from '@arcgis/core/widgets/Home/HomeViewModel';
import LocateViewModel from '@arcgis/core/widgets/Locate/LocateViewModel';
import FullscreenViewModel from '@arcgis/core/widgets/Fullscreen/FullscreenViewModel';
export default class CalciteNavigation extends Widget {
    view: esri.MapView;
    include: {
        home: boolean;
        compass: boolean;
        locate: boolean;
        fullscreen: boolean;
    };
    protected zoom: ZoomViewModel;
    protected home: HomeViewModel;
    protected locate: LocateViewModel;
    protected fullscreen: FullscreenViewModel;
    fullscreenElement?: HTMLElement;
    actions: cov.CalciteNavigationCustomActions[];
    theme: string;
    scale: string;
    private _hasRotation;
    private _actions;
    /**
     * Properties to watch/rerender.
     * Should not be nessessary at 4.19.
     */
    private _r;
    postInitialize(): void;
    render(): tsx.JSX.Element;
    private _compassAction;
    private _createCustomActions;
}
