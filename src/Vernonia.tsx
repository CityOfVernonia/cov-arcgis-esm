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
import { renderable, tsx } from '@arcgis/core/widgets/support/widget';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import Collection from '@arcgis/core/core/Collection';
import { whenOnce } from '@arcgis/core/core/watchUtils';
// import interact from 'interactjs';

/**
 * Widget view model.
 */
import VernoniaViewModel from './Vernonia/VernoniaViewModel';

/**
 * Vernonia layout support widgets.
 */
import LoadingScreen from './Vernonia/LoadingScreen';
import DisclaimerModal from './Vernonia/DisclaimerModal';
import MapTitle from './Vernonia/MapTitle';
import AccountControl from './Vernonia/AccountControl';

/**
 * Widgets loaded by the layout.
 */
import CalciteNavigation from 'cov/widgets/CalciteNavigation';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';

const CSS = {
  base: 'cov-vernonia',

  // left and right widget panels
  panel: 'cov-vernonia--panel',
  actionBarAvatar: 'cov-vernonia--action-bar--avatar',

  // content
  content: 'cov-vernonia--content',
  contentLeading: 'cov-vernonia--content--leading',
  contentView: 'cov-vernonia--content--view',
  contentViewTitle: 'view--title',
  contentTrailing: 'cov-vernonia--content--trailing',
  contentVisible: 'cov-vernonia--content--visible',
};

let KEY = 0;

const DISCLAIMER_OPTIONS: cov.VernoniaDisclaimerOptions = {
  include: true,
  title: 'Disclaimer',
  message:
    'There are no warranties, expressed or implied, including the warranty of merchantability or fitness for a particular purpose, accompanying this application.',
};

@subclass('cov.Vernonia')
export default class Vernonia extends Widget {
  /**
   * View model.
   */
  @property({
    type: VernoniaViewModel,
  })
  viewModel = new VernoniaViewModel();

  /**
   * Constructor properties.
   */
  @property({
    aliasOf: 'viewModel.view',
  })
  view!: esri.MapView;

  @property()
  title = 'Vernonia';

  @property()
  viewTitle = false;

  @property()
  disclaimerOptions = DISCLAIMER_OPTIONS;

  @property()
  navigationOptions!: cov.CalciteNavigationProperties;

  @property()
  searchViewModel!: esri.SearchViewModel;

  @property()
  oAuthViewModel!: cov.OAuthViewModel;

  @property()
  widgets: (cov.VernoniaPanelWidgetProperties | cov.VernoniaViewWidgetProperties)[] = [];

  @property()
  navigation!: CalciteNavigation;

  /**
   * Menu and operational panels.
   */
  @property()
  @renderable()
  menuPanelState: cov.VernoniaPanelState = {
    collapsed: true,
    activeWidgetId: null,
    actions: new Collection() as Collection<tsx.JSX.Element>,
    widgets: new Collection() as Collection<tsx.JSX.Element>,
    loaded: false,
  };

  @property()
  @renderable()
  operationalPanelState: cov.VernoniaPanelState = {
    collapsed: true,
    activeWidgetId: null,
    actions: new Collection() as Collection<tsx.JSX.Element>,
    widgets: new Collection() as Collection<tsx.JSX.Element>,
    loaded: false,
  };

  /**
   * Loading screen widget.
   */
  @property()
  private _loadingScreen!: LoadingScreen;

  @property()
  @renderable()
  private _leadingVisible = false;

  @property()
  @renderable()
  private _trailingVisible = false;

  constructor(properties: cov.VernoniaProperties) {
    super(properties);

    this._loadingScreen = new LoadingScreen({
      title: properties.title || this.title,
    });

    // `view` is a required property but using `whenOnce()` here with an `async` callback allows
    // all the initialization logic to be performed before the widget does any other initializing
    whenOnce(this, 'view', this._initView.bind(this));
  }

  // postInitialize(): void { }

  /**
   * Intialize the view and layout.
   * @param view esri.MapView
   */
  private async _initView(view: esri.MapView): Promise<void> {
    const { disclaimerOptions, oAuthViewModel, widgets, menuPanelState, operationalPanelState, _loadingScreen } = this;

    const viewWidgets = widgets.filter(
      (widgetProperties: cov.VernoniaPanelWidgetProperties | cov.VernoniaViewWidgetProperties) => {
        return widgetProperties.placement === 'view';
      },
    );

    const menuWidgets = widgets.filter(
      (widgetProperties: cov.VernoniaPanelWidgetProperties | cov.VernoniaViewWidgetProperties) => {
        return widgetProperties.placement === 'menu';
      },
    ) as cov.VernoniaPanelWidgetProperties[];

    const operationalWidgets = widgets.filter(
      (widgetProperties: cov.VernoniaPanelWidgetProperties | cov.VernoniaViewWidgetProperties) => {
        return widgetProperties.placement === 'operational';
      },
    ) as cov.VernoniaPanelWidgetProperties[];

    let _disclaimerOptions: cov.VernoniaDisclaimerOptions;

    // mixin disclaimer options
    this.disclaimerOptions = _disclaimerOptions = {
      ...DISCLAIMER_OPTIONS,
      ...disclaimerOptions,
    };

    // add ui components
    await this._initUI(view, viewWidgets as cov.VernoniaViewWidgetProperties[]);

    // add account control to primary panel
    if (oAuthViewModel) await this._initAccountControl(oAuthViewModel, menuPanelState);

    // set view container
    // race condition showed in 4.16 methinks
    setTimeout(() => {
      view.container = document.querySelector(`div.${CSS.contentView}`) as HTMLDivElement;
    });
    await view.when();

    // init menu panel widget
    menuWidgets.forEach(await this._initPanelWidget.bind(this, menuPanelState));
    menuPanelState.loaded = menuPanelState.actions.length ? true : false;

    // init operational panel widget
    operationalWidgets.forEach(await this._initPanelWidget.bind(this, operationalPanelState));
    operationalPanelState.loaded = operationalPanelState.actions.length ? true : false;

    // await this._initResizable();

    // lastly display disclaimer if required and end the loading screen
    if (_disclaimerOptions.include && !oAuthViewModel?.signedIn && !DisclaimerModal.isAccepted()) {
      new DisclaimerModal({
        title: _disclaimerOptions.title,
        message: _disclaimerOptions.message,
      });
    }
    _loadingScreen.end();
  }

  /**
   * Add UI components.
   * @param view esri.MapView
   * @param viewWidgets cov.VernoniaViewWidgetProperties[]
   */
  private async _initUI(view: esri.MapView, viewWidgets: cov.VernoniaViewWidgetProperties[]): Promise<void> {
    const { title, viewTitle, navigationOptions } = this;
    const { ui } = view;

    this.navigation = new CalciteNavigation({
      ...(navigationOptions || {}),
      ...{
        view,
        fullscreenElement: this.container as HTMLDivElement,
      },
    });

    ui.empty('top-left');

    if (viewTitle) {
      ui.add(new MapTitle({ title }), 'top-left');
      view.when().then(() => {
        (document.querySelector('div.esri-ui-top-left.esri-ui-corner') as HTMLDivElement).style.top = '-10px';
      });
    }

    ui.add(this.navigation, 'top-left');

    ui.add(
      new ScaleBar({
        view,
        style: 'ruler',
      }),
      'bottom-left',
    );

    viewWidgets.forEach((viewWidget: cov.VernoniaViewWidgetProperties) => {
      const { widget, position } = viewWidget;
      ui.add(widget, position);
    });
  }

  /**
   * Add panel actions and widgets.
   * @param panelState cov.VernoniaPanelState
   * @param properties cov.VernoniaPanelWidgetProperties
   */
  private async _initPanelWidget(
    panelState: cov.VernoniaPanelState,
    properties: cov.VernoniaPanelWidgetProperties,
  ): Promise<void> {
    const { actions, widgets } = panelState;
    const { widget, title, icon } = properties;

    // add action
    actions.add(
      <calcite-action
        key={KEY++}
        data-widget-id={widget.id}
        title={title}
        text={title}
        icon={icon}
        onclick={this._panelActionClickEvent.bind(this, panelState)}
      ></calcite-action>,
    );

    // add widget
    widgets.add(
      <div
        key={KEY++}
        data-widget-id={widget.id}
        hidden=""
        afterCreate={(div: HTMLDivElement) => {
          widget.container = div;
        }}
      ></div>,
    );
  }

  /**
   * Adds calcite-avatar and AccountControl widget to menu panel if signed in, or if not, adds action-item to sign in.
   * @param oAuthViewModel cov.OAuthViewModel
   * @param panelState cov.VernoniaPanelState
   */
  private async _initAccountControl(
    oAuthViewModel: cov.OAuthViewModel,
    panelState: cov.VernoniaPanelState,
  ): Promise<void> {
    const { actions, widgets } = panelState;
    const accountControl = new AccountControl({ oAuthViewModel });

    if (oAuthViewModel.signedIn) {
      // OAuthViewModel may still be transacting auth and alaising `user`
      // so wait until there is a servicable user
      await whenOnce(oAuthViewModel, 'user');
      // add avatar
      actions.add(
        <div key={KEY++} class={CSS.actionBarAvatar} title={oAuthViewModel.user.fullName}>
          <calcite-avatar
            data-widget-id={accountControl.id}
            onclick={this._panelActionClickEvent.bind(this, panelState)}
            full-name={oAuthViewModel.user.fullName}
            username={oAuthViewModel.user.username}
            thumbnail={oAuthViewModel.user.thumbnailUrl}
          ></calcite-avatar>
        </div>,
        0,
      );
      // add account control widget
      widgets.add(
        <div
          key={KEY++}
          data-widget-id={accountControl.id}
          hidden=""
          afterCreate={(div: HTMLDivElement) => {
            accountControl.container = div;
          }}
        ></div>,
      );
    } else {
      // add sign in action
      actions.add(
        <calcite-action
          key={KEY++}
          data-widget-id={accountControl.id}
          title="Sign in"
          text="Sign in"
          icon="sign-in"
          onclick={oAuthViewModel.signIn.bind(oAuthViewModel)}
        ></calcite-action>,
        0,
      );
    }
  }

  /**
   * Panel calcite-action click event.
   * @param panelState cov.VernoniaPanelState
   * @param clickEvent Event
   */
  private _panelActionClickEvent(panelState: cov.VernoniaPanelState, clickEvent: Event): void {
    const { widgets } = panelState;
    const action = clickEvent.target as HTMLCalciteActionElement | HTMLDivElement;
    const activeWidgetId = action.getAttribute('data-widget-id');

    // determine if panel is collapsed and which widget to make active
    if (panelState.collapsed) {
      panelState.collapsed = false;
      panelState.activeWidgetId = activeWidgetId;
    } else if (!panelState.collapsed && panelState.activeWidgetId === activeWidgetId) {
      panelState.collapsed = true;
      panelState.activeWidgetId = null;
    } else {
      panelState.collapsed = false;
      panelState.activeWidgetId = activeWidgetId;
    }

    // there's certainly a better way...
    // make the active widget visible
    widgets.forEach((element: tsx.JSX.Element) => {
      // @ts-ignore
      const node = element.domNode as HTMLDivElement;
      const widgetId = node.getAttribute('data-widget-id');
      node.setAttribute('hidden', '');
      if (widgetId === activeWidgetId) node.removeAttribute('hidden');
    });

    this.scheduleRender();
  }

  /*
  private async _initResizable(): Promise<void> {
    const { _leadingVisible, _trailingVisible } = this;
    const content = document.querySelector(`div.${CSS.content}`) as HTMLDivElement;
    const leading = document.querySelector(`div.${CSS.contentLeading}`) as HTMLDivElement;
    const view = document.querySelector(`div.${CSS.contentView}`) as HTMLDivElement;
    const trailing = document.querySelector(`div.${CSS.contentTrailing}`) as HTMLDivElement;
    interact(trailing).resizable({
      edges: {
        top: true,
        right: false,
        bottom: false,
        left: false,
      },
      listeners: {
        move: (event: any) => {
          const {
            rect: { height },
          } = event;
          view.style.height = `calc(100% - ${height}px)`;
          trailing.style.height = `${height}px`;
        },
      },
    });
  }
  */

  render(): tsx.JSX.Element {
    const { menuPanelState, operationalPanelState, _leadingVisible, _trailingVisible } = this;

    const leadingStyles = {
      [CSS.contentLeading]: true,
      [CSS.contentVisible]: _leadingVisible,
    };

    const trailingStyles = {
      [CSS.contentTrailing]: true,
      [CSS.contentVisible]: _trailingVisible,
    };

    return (
      <calcite-shell class={CSS.base}>
        {/* menu panel */}
        {/* i don't like this pattern but panel flickers if not rendered here */}
        <calcite-shell-panel
          class={CSS.panel}
          hidden={!menuPanelState.loaded}
          slot="primary-panel"
          position="start"
          theme="dark"
          collapsed={menuPanelState.collapsed}
        >
          <calcite-action-bar slot="action-bar">
            {menuPanelState.loaded ? menuPanelState.actions.toArray() : null}
          </calcite-action-bar>
          {menuPanelState.loaded ? menuPanelState.widgets.toArray() : null}
        </calcite-shell-panel>

        <div class={CSS.content}>
          <div class={this.classes(leadingStyles)}></div>
          {/* view container */}
          <div class={CSS.contentView}></div>
          <div class={this.classes(trailingStyles)}></div>
        </div>

        {/* operational panel */}
        {/* i don't like this pattern but panel flickers if not rendered here */}
        <calcite-shell-panel
          class={CSS.panel}
          hidden={!operationalPanelState.loaded}
          slot="primary-panel"
          position="end"
          collapsed={operationalPanelState.collapsed}
        >
          <calcite-action-bar slot="action-bar">
            {operationalPanelState.loaded ? operationalPanelState.actions.toArray() : null}
          </calcite-action-bar>
          {operationalPanelState.loaded ? operationalPanelState.widgets.toArray() : null}
        </calcite-shell-panel>
      </calcite-shell>
    );
  }
}
