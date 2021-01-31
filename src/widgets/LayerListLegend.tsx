/**
 * A widget with tabbed Esri LayerList and Legend widgets.
 */

import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';

import { renderable, tsx } from '@arcgis/core/widgets/support/widget';

import Widget from '@arcgis/core/widgets/Widget';

import LayerList from '@arcgis/core/widgets/LayerList';

import Legend from '@arcgis/core/widgets/Legend';

const CSS = {
  base: 'esri-widget cov-layer-list-legend',
  tabs: 'cov-tabs',
  tabsContentWrapper: 'cov-tabs--content-wrapper',
  tabsContent: 'cov-tabs--content',
  tabsContentNoPadding: 'cov-tabs--content_no-padding',
};

@subclass('cov.widgets.LayerListLegend')
export default class LayerListLegend extends Widget {
  @property()
  @renderable()
  view!: esri.MapView | esri.SceneView;

  @property()
  layerListProperties: esri.LayerListProperties = {};

  @property()
  legendProperties: esri.LegendProperties = {};

  @property()
  @renderable()
  private _activeTab = 'data-tab-0';

  render(): tsx.JSX.Element {
    return (
      <div class={CSS.base}>
        {/* tabs */}
        <ul class={CSS.tabs} role="tablist">
          <li
            id={`tab_${this.id}_tab_0`}
            aria-selected={this._activeTab === 'data-tab-0' ? 'true' : 'false'}
            bind={this}
            onclick={() => {
              this._activeTab = 'data-tab-0';
            }}
          >
            Layers
          </li>
          <li
            id={`tab_${this.id}_tab_1`}
            aria-selected={this._activeTab === 'data-tab-1' ? 'true' : 'false'}
            bind={this}
            onclick={() => {
              this._activeTab = 'data-tab-1';
            }}
          >
            Legend
          </li>
        </ul>
        {/* content */}
        <main class={CSS.tabsContentWrapper}>
          {/* layer list */}
          <section
            class={this.classes(CSS.tabsContent, CSS.tabsContentNoPadding)}
            aria-labelledby={`tab_${this.id}_tab_0`}
            role="tabcontent"
            style={`display:${this._activeTab === 'data-tab-0' ? 'block' : 'none'}`}
          >
            <div
              bind={this}
              afterCreate={(layerListDiv: HTMLDivElement) => {
                new LayerList({
                  container: layerListDiv,
                  view: this.view,
                  ...this.layerListProperties,
                });
              }}
            ></div>
          </section>
          {/* legend */}
          <section
            class={this.classes(CSS.tabsContent, CSS.tabsContentNoPadding)}
            aria-labelledby={`tab_${this.id}_tab_1`}
            role="tabcontent"
            style={`display:${this._activeTab === 'data-tab-1' ? 'block' : 'none'}`}
          >
            <div
              bind={this}
              afterCreate={(legendDiv: HTMLDivElement) => {
                new Legend({
                  container: legendDiv,
                  view: this.view,
                  ...this.legendProperties,
                });
              }}
            ></div>
          </section>
        </main>
      </div>
    );
  }
}
