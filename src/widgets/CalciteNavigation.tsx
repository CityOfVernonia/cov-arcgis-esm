/**
 * Map navigation widget in Calcite.
 */
import cov = __cov;
import { whenOnce } from '@arcgis/core/core/watchUtils';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import Widget from '@arcgis/core/widgets/Widget';
import { renderable, tsx } from '@arcgis/core/widgets/support/widget';
import '@esri/calcite-components';
import ZoomViewModel from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import HomeViewModel from '@arcgis/core/widgets/Home/HomeViewModel';
import LocateViewModel from '@arcgis/core/widgets/Locate/LocateViewModel';
import FullscreenViewModel from '@arcgis/core/widgets/Fullscreen/FullscreenViewModel';

const CSS = {
  base: 'cov-calcite-navigation',
  compass: 'compass-action',
};

const INCLUDE = {
  home: true,
  compass: true,
  locate: true,
  fullscreen: true,
};

@subclass('cov.widgets.CalciteNavigation')
export default class CalciteNavigation extends Widget {
  @property()
  view!: esri.MapView;

  @property()
  include = {
    home: true,
    compass: true,
    locate: true,
    fullscreen: true,
  };

  @property()
  @renderable()
  protected zoom = new ZoomViewModel();

  @property()
  @renderable()
  protected home = new HomeViewModel();

  @property()
  @renderable()
  protected locate = new LocateViewModel();

  @property()
  @renderable()
  protected fullscreen = new FullscreenViewModel();

  @property()
  fullscreenElement?: HTMLElement;

  @property()
  actions!: cov.CalciteNavigationCustomActions[];

  @property()
  theme = 'light';

  @property()
  scale = 's';

  @property()
  @renderable()
  private _hasRotation = false;

  @property()
  private _actions: tsx.JSX.Element | null = null;

  /**
   * Properties to watch/rerender.
   * Should not be nessessary at 4.19.
   */
  @property({
    aliasOf: 'view.rotation',
  })
  @renderable()
  private _r!: number;

  postInitialize(): void {
    this.include = {
      ...INCLUDE,
      ...this.include,
    };

    whenOnce(this, 'view', (view: esri.MapView) => {
      const { zoom, home, locate, fullscreen, fullscreenElement, actions } = this;

      // set view
      zoom.view = view;
      home.view = view;
      locate.view = view;
      fullscreen.view = view;
      if (fullscreenElement) fullscreen.element = fullscreenElement;

      // is map view and can rotate?
      this._hasRotation = (view.type === '2d' &&
        (view.constraints as esri.MapViewConstraints).rotationEnabled) as boolean;

      // custom actions
      if (actions && actions.length) this._createCustomActions();
    });
  }

  render(): tsx.JSX.Element {
    const { view, include, zoom, home, _hasRotation, locate, fullscreen, theme, scale } = this;

    const locateIcon =
      locate.state === 'ready'
        ? 'gps-on'
        : locate.state === 'locating'
        ? 'gps-on-f'
        : locate.state === 'disabled'
        ? 'gps-off'
        : '';

    const fullscreenActive = fullscreen.state === 'active';

    return (
      <div class={CSS.base}>
        <calcite-action-bar theme={theme} expandDisabled={true}>
          <calcite-action-group>
            <calcite-action
              title="Zoom in"
              text="Zoom in"
              disabled={!zoom.canZoomIn}
              scale={scale}
              icon="plus"
              onclick={zoom.zoomIn.bind(zoom)}
            ></calcite-action>
            {include.home ? (
              <calcite-action
                title="Default map extent"
                text="Default map extent"
                scale={scale}
                icon="home"
                onclick={home.go.bind(home)}
              ></calcite-action>
            ) : null}
            <calcite-action
              title="Zoom out"
              text="Zoom out"
              disabled={!zoom.canZoomOut}
              scale={scale}
              icon="minus"
              onclick={zoom.zoomOut.bind(zoom)}
            ></calcite-action>
          </calcite-action-group>
          {include.compass || include.locate || include.fullscreen ? (
            <calcite-action-group>
              {_hasRotation && include.compass ? (
                <calcite-action
                  title="Rotate map to north"
                  text="Rotate map to north"
                  class={CSS.compass}
                  style={`transform: rotate(${view.rotation}deg); border-radius: 50%;`}
                  scale={scale}
                  icon="compass-needle"
                  onclick={() => ((view as esri.MapView).rotation = 0)}
                  afterCreate={this._compassAction.bind(this)}
                ></calcite-action>
              ) : null}
              {include.locate ? (
                <calcite-action
                  title="Find location"
                  text="Find location"
                  disabled={locate.state === 'disabled'}
                  scale={scale}
                  icon={locateIcon}
                  onclick={locate.locate.bind(locate)}
                ></calcite-action>
              ) : null}
              {fullscreen.state !== 'feature-unsupported' && include.fullscreen ? (
                <calcite-action
                  title={fullscreenActive ? 'Exit fullscreen' : 'Enter fullscreen'}
                  text={fullscreenActive ? 'Exit fullscreen' : 'Enter fullscreen'}
                  disabled={fullscreen.state === 'disabled'}
                  scale={scale}
                  icon={fullscreenActive ? 'full-screen-exit' : 'extent'}
                  onclick={fullscreen.toggle.bind(fullscreen)}
                ></calcite-action>
              ) : null}
            </calcite-action-group>
          ) : null}
          {this._actions}
        </calcite-action-bar>
      </div>
    );
  }

  // very hacky
  // continue to look for css solution
  private _compassAction(action: HTMLCalciteActionElement) {
    let button: HTMLButtonElement;
    if (action.shadowRoot) {
      button = action.shadowRoot.querySelector('.button') as HTMLButtonElement;
      if (button) {
        button.style.borderRadius = '50%';
      } else {
        setTimeout(() => {
          this._compassAction(action);
        }, 100);
      }
    } else {
      setTimeout(() => {
        this._compassAction(action);
      }, 100);
    }
  }

  private _createCustomActions() {
    const { actions, scale } = this;
    this._actions = (
      <div>
        <calcite-action-group>
          {actions.map((action: cov.CalciteNavigationCustomActions) => {
            const { title, icon } = action;
            return (
              <calcite-action
                scale={scale}
                title={title}
                text={title}
                icon={icon}
                onclick={(evt: Event) => {
                  action.onclick(evt.target as HTMLCalciteActionElement);
                }}
              ></calcite-action>
            );
          })}
        </calcite-action-group>
      </div>
    );
  }
}
