/**
 * The primary layout widget for City of Vernonia functional web mapping apps.
 */

import cov = __cov;

import { whenOnce } from '@arcgis/core/core/watchUtils';

import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import Expand from '@arcgis/core/widgets/Expand';

import Search from '@arcgis/core/widgets/Search';
import MapNavigation from 'cov/widgets/MapNavigation';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import MadeWith from 'cov/widgets/MadeWith';

const CSS = {
  base: 'cov-vernonia',
  header: 'cov-vernonia--header',
  headerTitle: 'cov-vernonia--header-title',
  headerSearch: 'cov-vernonia--header-search',
  headerUser: 'cov-vernonia--header-user',
  view: 'cov-vernonia--view',
};

@subclass('cov.layout.Vernonia')
export default class Vernonia extends Widget {
  @property()
  view!: esri.MapView | esri.SceneView;

  @property()
  title = 'Vernonia';

  @property()
  madeWith = true;

  @property()
  oAuthViewModel!: cov.OAuthViewModel;

  @property()
  headerSearch = true;

  @property()
  searchViewModel!: esri.SearchViewModel;

  @property()
  nextBasemap!: esri.Basemap;

  @property()
  widgets: cov.VernoniaExpandWidgetProperties[] = [];

  constructor(properties: cov.VernoniaProperties) {
    super(properties);
    whenOnce(this, 'view', this._init.bind(this));
  }

  private async _init(view: esri.MapView | esri.SceneView): Promise<void> {
    const { madeWith, headerSearch, searchViewModel, widgets } = this;
    let search;

    // add map navigation and other ui components before view loads
    view.ui.empty('top-left');
    view.ui.add(
      new MapNavigation({
        view,
        fullscreenElement: document.querySelector('div[data-vernonia-root') as HTMLDivElement,
      }),
      'top-left',
    );

    view.ui.add(new ScaleBar({ view, style: 'ruler' }), 'bottom-left');

    if (madeWith) {
      view.ui.add(new MadeWith({ color: '#323232', size: '12px' }), 'bottom-left');
    }

    widgets.forEach((widget: cov.VernoniaExpandWidgetProperties) => {
      const { expand } = widget;

      // expand.group = 'top-right-expand-group';
      expand.content = widget.widget;

      view.ui.add(
        new Expand({
          group: 'top-right-expand-group',
          ...expand,
        }),
        'top-right',
      );
    });

    // race condition appeared in 4.16 ????
    setTimeout((): void => {
      view.container = document.querySelector('div[data-vernonia-view]') as HTMLDivElement;
    }, 0);

    // wait for a serviceable view
    await view.when();

    // header search
    if (headerSearch) {
      search = new Search({ view });
      if (searchViewModel) {
        search.viewModel = searchViewModel;
        // need to set view again
        search.view = view;
      }
      search.container = document.querySelector('div[data-vernonia-header-search]') as HTMLDivElement;
    }
  }

  render(): tsx.JSX.Element {
    const { title } = this;
    return (
      <div class={CSS.base} data-vernonia-root="">
        {/* header */}
        <div class={CSS.header}>
          <div class={CSS.headerTitle}>{title}</div>
          <div class={CSS.headerSearch} data-vernonia-header-search=""></div>
          <div class={CSS.headerUser} data-vernonia-header-user=""></div>
        </div>

        {/* view */}
        <div class={CSS.view} data-vernonia-view=""></div>
      </div>
    );
  }
}
