/**
 * The primary layout widget for City of Vernonia functional web mapping apps.
 */

import cov = __cov;

import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';

import { tsx } from '@arcgis/core/widgets/support/widget';

import Widget from '@arcgis/core/widgets/Widget';

const CSS = {
  base: 'cov-vernonia',
};

@subclass('cov.layout.Vernonia')
export default class MadeWith extends Widget {
  @property()
  view!: esri.MapView | esri.SceneView;

  @property()
  oAuthViewModel!: cov.OAuthViewModel;

  @property()
  headerSearch = true;

  @property()
  searchViewModel!: esri.SearchViewModel;

  @property()
  nextBasemap!: esri.Basemap;

  render(): tsx.JSX.Element {
    return <div class={CSS.base}></div>;
  }
}
