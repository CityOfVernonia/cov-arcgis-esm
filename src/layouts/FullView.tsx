/**
 * A a full view layout widget with a title in the upper left corner.
 */

import cov = __cov;

import { whenOnce } from '@arcgis/core/core/watchUtils';

import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';

import { tsx } from '@arcgis/core/widgets/support/widget';

import Widget from '@arcgis/core/widgets/Widget';

const CSS = {
  base: 'cov-full-view',
  title: 'cov-full-view--title',
  view: 'cov-full-view--view',
};

@subclass('cov/layouts/FullView')
export default class FullView extends Widget {
  @property()
  view!: esri.MapView | esri.SceneView;

  @property()
  title = 'City of Vernonia';

  constructor(properties: cov.FullViewProperties) {
    super(properties);
    whenOnce(this, 'view', this._init.bind(this));
  }

  private _init(): void {
    const { view, title } = this;

    const titleText = document.createElement('div');
    titleText.innerHTML = title;
    titleText.classList.add(CSS.title);

    view.ui.add(titleText, {
      position: 'top-left',
      index: 0,
    });

    setTimeout((): void => {
      view.container = document.querySelector('div[data-full-view-layout-view]') as HTMLDivElement;
    }, 0);
  }

  render(): tsx.JSX.Element {
    return (
      <div class={CSS.base}>
        <div class={CSS.view} data-full-view-layout-view=""></div>
      </div>
    );
  }
}
