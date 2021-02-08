/**
 * Classic Vernonia measure in Calcite.
 */
import cov = __cov;

import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';

import { accessibleHandler, renderable, tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import '@esri/calcite-components';

import MeasureViewModel from './../viewModels/MeasureViewModel';

const CSS = {
  base: 'cov-calcite-measure',
  tabs: 'tabs',
  tabNav: 'tab-nav',
  tab: 'tab',
  switch: 'cov-calcite-measure--switch',
  content: 'cov-calcite-measure--content',
  row: 'cov-calcite-measure--row',
  rowItem: 'cov-calcite-measure--row-item',
  result: 'cov-calcite-measure--result',
  resultLabel: 'cov-calcite-measure--result-label',
  clear: 'cov-calcite-measure--clear',
  clearVisible: 'visible',
};

let KEY = 0;

@subclass('cov.widgets.CalciteMeasure')
export default class CalciteMeasure extends Widget {
  /**
   * Constructor properties.
   */
  @property({
    aliasOf: 'viewModel.view',
  })
  view!: esri.MapView;

  @property()
  theme = 'light';

  @property()
  widthScale = 'm';

  @property()
  scale = 's';

  @property({
    aliasOf: 'viewModel.showText',
  })
  @renderable()
  showText!: boolean;

  @property({
    aliasOf: 'viewModel.color',
  })
  @renderable()
  color!: any;

  @property({
    aliasOf: 'viewModel.fillColor',
  })
  @renderable()
  fillColor!: any;

  /**
   * Public widget properties.
   */
  @property({
    type: MeasureViewModel,
  })
  viewModel = new MeasureViewModel();

  @property({
    aliasOf: 'viewModel.state',
  })
  @renderable()
  protected state!: cov.MeasureState;

  @property({
    aliasOf: 'viewModel.units',
  })
  protected units!: cov.UnitsViewModel;

  @property({
    aliasOf: 'viewModel.hasGround',
  })
  @renderable()
  protected hasGround!: boolean;

  /**
   * View model methods called by the widget.
   */
  @accessibleHandler()
  clear(): void {
    this.viewModel.clear();
  }

  @accessibleHandler()
  length(): void {
    this.viewModel.length();
  }

  @accessibleHandler()
  area(): void {
    this.viewModel.area();
  }

  @accessibleHandler()
  elevation(): void {
    this.viewModel.elevation();
  }

  @accessibleHandler()
  location(): void {
    this.viewModel.location();
  }

  /**
   * Wire swich change to showText.
   * @param _switch
   */
  private _showTextHandle(_switch: HTMLCalciteSwitchElement): void {
    _switch.addEventListener('calciteSwitchChange', (evt: any) => {
      this.showText = evt.detail.switched;
    });
  }

  /**
   * Wire units change to units<unit>.
   * @param type
   * @param select
   */
  private _unitChangeHandle(
    type: 'length' | 'area' | 'location' | 'elevation',
    select: HTMLCalciteSelectElement,
  ): void {
    select.addEventListener('calciteSelectChange', (evt: any) => {
      const value = evt.target.selectedOption.value;
      switch (type) {
        case 'length':
          this.units.lengthUnit = value;
          break;
        case 'area':
          this.units.areaUnit = value;
          break;
        case 'location':
          this.units.locationUnit = value;
          break;
        case 'elevation':
          this.units.elevationUnit = value;
          break;
        default:
          break;
      }
    });
  }

  render(): tsx.JSX.Element {
    const {
      state,
      hasGround,
      theme,
      widthScale,
      scale,
      showText,
      units: {
        lengthUnits,
        lengthUnit,
        areaUnits,
        areaUnit,
        locationUnits,
        locationUnit,
        elevationUnits,
        elevationUnit,
      },
    } = this;

    const measureClear = {
      [CSS.clearVisible]:
        state.action === 'measuringLength' ||
        state.action === 'length' ||
        state.action === 'measuringArea' ||
        state.action === 'area',
    };
    const locationClear = {
      [CSS.clearVisible]: state.action === 'queryingElevation' || state.action === 'location',
    };
    const elevationClear = {
      [CSS.clearVisible]: state.action === 'queryingElevation' || state.action === 'elevation',
    };

    return (
      <calcite-shell class={CSS.base}>
        <calcite-shell-panel theme={theme} width-scale={widthScale}>
          <calcite-tabs class={CSS.tabs} layout="center">
            <calcite-tab-nav class={CSS.tabNav} slot="tab-nav">
              <calcite-tab-title active>Measure</calcite-tab-title>
              <calcite-tab-title>Location</calcite-tab-title>
              {hasGround ? <calcite-tab-title>Elevation</calcite-tab-title> : null}
            </calcite-tab-nav>

            {/* measure content */}
            <calcite-tab class={CSS.tab} active>
              <div class={CSS.content}>
                <div class={CSS.row}>
                  <calcite-button
                    class={CSS.rowItem}
                    title="Measure length"
                    scale={scale}
                    bind={this}
                    onclick={this.length.bind(this)}
                  >
                    Length
                  </calcite-button>
                  <calcite-select
                    class={CSS.rowItem}
                    title="Select length unit"
                    scale={scale}
                    bind={this}
                    afterCreate={this._unitChangeHandle.bind(this, 'length')}
                  >
                    {this._createUnitOptions(lengthUnits, lengthUnit)}
                  </calcite-select>
                </div>
                <div class={CSS.row}>
                  <calcite-button
                    class={CSS.rowItem}
                    title="Measure area"
                    scale={scale}
                    bind={this}
                    onclick={this.area.bind(this)}
                  >
                    Area
                  </calcite-button>
                  <calcite-select
                    class={CSS.rowItem}
                    title="Select area unit"
                    scale={scale}
                    bind={this}
                    afterCreate={this._unitChangeHandle.bind(this, 'area')}
                  >
                    {this._createUnitOptions(areaUnits, areaUnit)}
                  </calcite-select>
                </div>
                <div class={CSS.row}>
                  <label class={CSS.switch}>
                    <calcite-switch
                      title="Show text while measuring"
                      switched={showText}
                      scale={scale}
                      bind={this}
                      afterCreate={this._showTextHandle.bind(this)}
                    ></calcite-switch>
                    Show text
                  </label>
                </div>
                {this._createMeasureResut()}
                <div class={this.classes(CSS.clear, measureClear)}>
                  <calcite-button title="Clear" width="auto" scale={scale} bind={this} onclick={this.clear.bind(this)}>
                    Clear
                  </calcite-button>
                </div>
              </div>
            </calcite-tab>

            {/* location content */}
            <calcite-tab class={CSS.tab}>
              <div class={CSS.content}>
                <div class={CSS.row}>
                  <calcite-button
                    title="Identify location"
                    class={CSS.rowItem}
                    scale={scale}
                    bind={this}
                    onclick={this.location.bind(this)}
                  >
                    Location
                  </calcite-button>
                  <calcite-select
                    title="Select location unit"
                    class={CSS.rowItem}
                    scale={scale}
                    bind={this}
                    afterCreate={this._unitChangeHandle.bind(this, 'location')}
                  >
                    {this._createUnitOptions(locationUnits, locationUnit)}
                  </calcite-select>
                </div>
                <div class={CSS.row}>
                  <label class={CSS.switch}>
                    <calcite-switch
                      title="Show text while measuring"
                      switched={showText}
                      scale={scale}
                      bind={this}
                      afterCreate={this._showTextHandle.bind(this)}
                    ></calcite-switch>
                    Show text
                  </label>
                </div>
                <div class={CSS.result}>
                  <div>
                    <span class={CSS.resultLabel}>Latitude:</span> {state.y}
                  </div>
                  <div>
                    <span class={CSS.resultLabel}>Longitude:</span> {state.x}
                  </div>
                </div>
                <div class={this.classes(CSS.clear, locationClear)}>
                  <calcite-button title="Clear" width="auto" scale={scale} bind={this} onclick={this.clear.bind(this)}>
                    Clear
                  </calcite-button>
                </div>
              </div>
            </calcite-tab>

            {/* elevation content */}
            {hasGround ? (
              <calcite-tab class={CSS.tab}>
                <div class={CSS.content}>
                  <div class={CSS.row}>
                    <calcite-button
                      title="Identify elevation"
                      class={CSS.rowItem}
                      scale={scale}
                      bind={this}
                      onclick={this.elevation.bind(this)}
                    >
                      Elevation
                    </calcite-button>
                    <calcite-select
                      title="Select elevation unit"
                      class={CSS.rowItem}
                      scale={scale}
                      bind={this}
                      afterCreate={this._unitChangeHandle.bind(this, 'elevation')}
                    >
                      {this._createUnitOptions(elevationUnits, elevationUnit)}
                    </calcite-select>
                  </div>
                  <div class={CSS.row}>
                    <label class={CSS.switch}>
                      <calcite-switch
                        title="Show text while measuring"
                        switched={showText}
                        scale={scale}
                        bind={this}
                        afterCreate={this._showTextHandle.bind(this)}
                      ></calcite-switch>
                      Show text
                    </label>
                  </div>
                  <div class={CSS.result}>
                    <span class={CSS.resultLabel}>Elevation:</span> {state.z} {elevationUnit}
                  </div>
                  <div class={this.classes(CSS.clear, elevationClear)}>
                    <calcite-button
                      title="clear"
                      width="auto"
                      scale={scale}
                      bind={this}
                      onclick={this.clear.bind(this)}
                    >
                      Clear
                    </calcite-button>
                  </div>
                </div>
              </calcite-tab>
            ) : null}
          </calcite-tabs>
        </calcite-shell-panel>
      </calcite-shell>
    );
  }

  /**
   * tsx helpers.
   */
  private _createUnitOptions(units: Record<string, string>, defaultUnit: string): tsx.JSX.Element[] {
    const options: tsx.JSX.Element[] = [];
    for (const unit in units) {
      options.push(
        <calcite-option key={KEY++} value={unit} selected={unit === defaultUnit}>
          {units[unit]}
        </calcite-option>,
      );
    }
    return options;
  }

  private _createMeasureResut(): tsx.JSX.Element {
    const {
      state,
      units: { lengthUnit, areaUnit },
    } = this;
    switch (state.action) {
      case 'length':
      case 'measuringLength':
        return (
          <div key={KEY++} class={CSS.result}>
            <span class={CSS.resultLabel}>Length:</span> {state.length.toLocaleString()} {lengthUnit}
          </div>
        );
      case 'area':
      case 'measuringArea':
        return (
          <div key={KEY++} class={CSS.result}>
            <div>
              <span class={CSS.resultLabel}>Area:</span> {state.area.toLocaleString()} {areaUnit}
            </div>
            <div>
              <span class={CSS.resultLabel}>Perimeter:</span> {state.length.toLocaleString()} {lengthUnit}
            </div>
          </div>
        );
      default:
        return (
          <div key={KEY++} class={CSS.result}>
            Select a measure tool
          </div>
        );
    }
  }
}
