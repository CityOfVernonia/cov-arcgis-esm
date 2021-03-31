/**
 * The primary layout for City of Vernonia web mapping applications.
 */
import { __decorate } from "tslib";
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
import CalciteNavigation from './widgets/CalciteNavigation';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
const CSS = {
    base: 'cov-vernonia',
    // left and right widget panels
    panel: 'cov-vernonia--panel',
    panelWidget: 'cov-vernonia--panel--widget',
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
const DISCLAIMER_OPTIONS = {
    include: true,
    title: 'Disclaimer',
    message: 'There are no warranties, expressed or implied, including the warranty of merchantability or fitness for a particular purpose, accompanying this application.',
};
let Vernonia = class Vernonia extends Widget {
    constructor(properties) {
        super(properties);
        /**
         * View model.
         */
        this.viewModel = new VernoniaViewModel();
        this.title = 'Vernonia';
        this.viewTitle = false;
        this.disclaimerOptions = DISCLAIMER_OPTIONS;
        this.widgets = [];
        /**
         * Menu and operational panels.
         */
        this.menuPanelState = {
            collapsed: true,
            activeWidgetId: null,
            actions: new Collection(),
            widgets: new Collection(),
            loaded: false,
        };
        this.operationalPanelState = {
            collapsed: true,
            activeWidgetId: null,
            actions: new Collection(),
            widgets: new Collection(),
            loaded: false,
        };
        this._leadingVisible = false;
        this._trailingVisible = false;
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
    async _initView(view) {
        const { disclaimerOptions, oAuthViewModel, widgets, menuPanelState, operationalPanelState, _loadingScreen } = this;
        const viewWidgets = widgets.filter((widgetProperties) => {
            return widgetProperties.placement === 'view';
        });
        const menuWidgets = widgets.filter((widgetProperties) => {
            return widgetProperties.placement === 'menu';
        });
        const operationalWidgets = widgets.filter((widgetProperties) => {
            return widgetProperties.placement === 'operational';
        });
        let _disclaimerOptions;
        // mixin disclaimer options
        this.disclaimerOptions = _disclaimerOptions = {
            ...DISCLAIMER_OPTIONS,
            ...disclaimerOptions,
        };
        // add ui components
        await this._initUI(view, viewWidgets);
        // add account control to primary panel
        if (oAuthViewModel)
            await this._initAccountControl(oAuthViewModel, menuPanelState);
        // set view container
        // race condition showed in 4.16 methinks
        setTimeout(() => {
            view.container = document.querySelector(`div.${CSS.contentView}`);
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
    async _initUI(view, viewWidgets) {
        const { title, viewTitle, navigationOptions } = this;
        const { ui } = view;
        this.navigation = new CalciteNavigation({
            ...(navigationOptions || {}),
            ...{
                view,
                fullscreenElement: this.container,
            },
        });
        ui.empty('top-left');
        if (viewTitle) {
            ui.add(new MapTitle({ title }), 'top-left');
            view.when().then(() => {
                document.querySelector('div.esri-ui-top-left.esri-ui-corner').style.top = '-10px';
            });
        }
        ui.add(this.navigation, 'top-left');
        ui.add(new ScaleBar({
            view,
            style: 'ruler',
        }), 'bottom-left');
        viewWidgets.forEach((viewWidget) => {
            const { widget, position } = viewWidget;
            ui.add(widget, position);
        });
    }
    /**
     * Add panel actions and widgets.
     * @param panelState cov.VernoniaPanelState
     * @param properties cov.VernoniaPanelWidgetProperties
     */
    async _initPanelWidget(panelState, properties) {
        const { actions, widgets } = panelState;
        const { widget, title, icon } = properties;
        // add action
        actions.add(tsx("calcite-action", { key: KEY++, "data-widget-id": widget.id, title: title, text: title, icon: icon, onclick: this._panelActionClickEvent.bind(this, panelState) }));
        // add widget
        widgets.add(tsx("div", { key: KEY++, class: CSS.panelWidget, "data-widget-id": widget.id, hidden: "", afterCreate: (div) => {
                widget.container = div;
            } }));
    }
    /**
     * Adds calcite-avatar and AccountControl widget to menu panel if signed in, or if not, adds action-item to sign in.
     * @param oAuthViewModel cov.OAuthViewModel
     * @param panelState cov.VernoniaPanelState
     */
    async _initAccountControl(oAuthViewModel, panelState) {
        const { actions, widgets } = panelState;
        const accountControl = new AccountControl({ oAuthViewModel });
        if (oAuthViewModel.signedIn) {
            // OAuthViewModel may still be transacting auth and alaising `user`
            // so wait until there is a servicable user
            await whenOnce(oAuthViewModel, 'user');
            // add avatar
            actions.add(tsx("div", { key: KEY++, class: CSS.actionBarAvatar, title: oAuthViewModel.user.fullName },
                tsx("calcite-avatar", { "data-widget-id": accountControl.id, onclick: this._panelActionClickEvent.bind(this, panelState), "full-name": oAuthViewModel.user.fullName, username: oAuthViewModel.user.username, thumbnail: oAuthViewModel.user.thumbnailUrl })), 0);
            // add account control widget
            widgets.add(tsx("div", { key: KEY++, "data-widget-id": accountControl.id, hidden: "", afterCreate: (div) => {
                    accountControl.container = div;
                } }));
        }
        else {
            // add sign in action
            actions.add(tsx("calcite-action", { key: KEY++, "data-widget-id": accountControl.id, title: "Sign in", text: "Sign in", icon: "sign-in", onclick: oAuthViewModel.signIn.bind(oAuthViewModel) }), 0);
        }
    }
    /**
     * Panel calcite-action click event.
     * @param panelState cov.VernoniaPanelState
     * @param clickEvent Event
     */
    _panelActionClickEvent(panelState, clickEvent) {
        const { widgets } = panelState;
        const action = clickEvent.target;
        const activeWidgetId = action.getAttribute('data-widget-id');
        // determine if panel is collapsed and which widget to make active
        if (panelState.collapsed) {
            panelState.collapsed = false;
            panelState.activeWidgetId = activeWidgetId;
        }
        else if (!panelState.collapsed && panelState.activeWidgetId === activeWidgetId) {
            panelState.collapsed = true;
            panelState.activeWidgetId = null;
        }
        else {
            panelState.collapsed = false;
            panelState.activeWidgetId = activeWidgetId;
        }
        // there's certainly a better way...
        // make the active widget visible
        widgets.forEach((element) => {
            // @ts-ignore
            const node = element.domNode;
            const widgetId = node.getAttribute('data-widget-id');
            node.setAttribute('hidden', '');
            if (widgetId === activeWidgetId)
                node.removeAttribute('hidden');
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
    render() {
        const { menuPanelState, operationalPanelState, _leadingVisible, _trailingVisible } = this;
        const leadingStyles = {
            [CSS.contentLeading]: true,
            [CSS.contentVisible]: _leadingVisible,
        };
        const trailingStyles = {
            [CSS.contentTrailing]: true,
            [CSS.contentVisible]: _trailingVisible,
        };
        return (tsx("calcite-shell", { class: CSS.base },
            tsx("calcite-shell-panel", { class: CSS.panel, hidden: !menuPanelState.loaded, slot: "primary-panel", position: "start", theme: "dark", collapsed: menuPanelState.collapsed },
                tsx("calcite-action-bar", { slot: "action-bar" }, menuPanelState.loaded ? menuPanelState.actions.toArray() : null),
                menuPanelState.loaded ? menuPanelState.widgets.toArray() : null),
            tsx("div", { class: CSS.content },
                tsx("div", { class: this.classes(leadingStyles) }),
                tsx("div", { class: CSS.contentView }),
                tsx("div", { class: this.classes(trailingStyles) })),
            tsx("calcite-shell-panel", { class: CSS.panel, hidden: !operationalPanelState.loaded, slot: "primary-panel", position: "end", collapsed: operationalPanelState.collapsed },
                tsx("calcite-action-bar", { slot: "action-bar" }, operationalPanelState.loaded ? operationalPanelState.actions.toArray() : null),
                operationalPanelState.loaded ? operationalPanelState.widgets.toArray() : null)));
    }
};
__decorate([
    property({
        type: VernoniaViewModel,
    })
], Vernonia.prototype, "viewModel", void 0);
__decorate([
    property({
        aliasOf: 'viewModel.view',
    })
], Vernonia.prototype, "view", void 0);
__decorate([
    property()
], Vernonia.prototype, "title", void 0);
__decorate([
    property()
], Vernonia.prototype, "viewTitle", void 0);
__decorate([
    property()
], Vernonia.prototype, "disclaimerOptions", void 0);
__decorate([
    property()
], Vernonia.prototype, "navigationOptions", void 0);
__decorate([
    property()
], Vernonia.prototype, "searchViewModel", void 0);
__decorate([
    property()
], Vernonia.prototype, "oAuthViewModel", void 0);
__decorate([
    property()
], Vernonia.prototype, "widgets", void 0);
__decorate([
    property()
], Vernonia.prototype, "navigation", void 0);
__decorate([
    property(),
    renderable()
], Vernonia.prototype, "menuPanelState", void 0);
__decorate([
    property(),
    renderable()
], Vernonia.prototype, "operationalPanelState", void 0);
__decorate([
    property()
], Vernonia.prototype, "_loadingScreen", void 0);
__decorate([
    property(),
    renderable()
], Vernonia.prototype, "_leadingVisible", void 0);
__decorate([
    property(),
    renderable()
], Vernonia.prototype, "_trailingVisible", void 0);
Vernonia = __decorate([
    subclass('cov.Vernonia')
], Vernonia);
export default Vernonia;
