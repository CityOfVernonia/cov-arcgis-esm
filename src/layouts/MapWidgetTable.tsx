/**
 * Layout with resizable map, widget, and table containers.
 */
import cov = __cov;

import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { whenOnce } from '@arcgis/core/core/watchUtils';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';

import interact from 'interactjs';

const CSS = {
  base: 'cov-map-table-widget',
  topLeft: 'cov-map-table-widget--top-left',
  topRight: 'cov-map-table-widget--top-right',
  bottom: 'cov-map-table-widget--bottom',
  view: 'cov-map-table-widget--view',
  widget: 'cov-map-table-widget--widget',
  table: 'cov-map-table-widget--table',
};

@subclass('cov.layouts.MapWidgetTable')
export default class MapWidgetTable extends Widget {
  @property()
  view!: esri.MapView;

  @property()
  featureTable!: esri.FeatureTable;

  @property()
  widget!: esri.Widget;

  constructor(properties: cov.MapWidgetTableProperties) {
    super(properties);
    whenOnce(this, 'view', this._init.bind(this));
  }

  private async _init(view: esri.MapView): Promise<void> {
    const { widget, featureTable } = this;

    setTimeout((): void => {
      view.container = document.querySelector(`div[class="${CSS.view}"]`) as HTMLDivElement;
      widget.container = document.querySelector(`div[class="${CSS.widget}"]`) as HTMLDivElement;
      featureTable.container = document.querySelector(`div[class="${CSS.table}"]`) as HTMLDivElement;
    }, 0);

    await view.when();

    const base = document.querySelector(`div[class="${CSS.base}"]`) as HTMLDivElement;
    const topLeft = document.querySelector(`div[class="${CSS.topLeft}"]`) as HTMLDivElement;
    const topRight = document.querySelector(`div[class="${CSS.topRight}"]`) as HTMLDivElement;
    const bottom = document.querySelector(`div[class="${CSS.bottom}"]`) as HTMLDivElement;

    interact(topLeft).resizable({
      edges: {
        top: false,
        right: true,
        bottom: false,
        left: false,
      },
      listeners: {
        move: (event: any) => {
          const { offsetWidth } = base;
          const percent = event.rect.width / offsetWidth;
          const inverse = 1 - percent;
          if (percent < 0.25 || inverse < 0.25) return;
          topLeft.style.right = `calc(100% * ${inverse})`;
          topRight.style.left = `calc(100% * ${percent})`;
        },
      },
    });

    interact(bottom).resizable({
      edges: {
        top: true,
        right: false,
        bottom: false,
        left: false,
      },
      listeners: {
        move: (event: any) => {
          const { offsetHeight } = base;
          const percent = event.rect.height / offsetHeight;
          const inverse = 1 - percent;
          if (percent < 0.25 || inverse < 0.25) return;
          bottom.style.height = `calc(100% * ${percent})`;
          topLeft.style.height = `calc(100% * ${inverse})`;
          topRight.style.height = `calc(100% * ${inverse})`;
        },
      },
    });
  }

  render(): tsx.JSX.Element {
    return (
      <div class={CSS.base}>
        <div class={CSS.topLeft}>
          <div class={CSS.view}></div>
        </div>
        <div class={CSS.topRight}>
          <div class={CSS.widget}></div>
        </div>
        <div class={CSS.bottom}>
          <div class={CSS.table}></div>
        </div>
      </div>
    );
  }
}
