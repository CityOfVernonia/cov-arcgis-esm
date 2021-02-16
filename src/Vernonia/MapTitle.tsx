import Widget from '@arcgis/core/widgets/Widget';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';

interface MapTitleProperties extends esri.WidgetProperties {
  title?: string;
}

const CSS = {
  base: 'cov-vernonia--map-title',
};

@subclass('cov.Vernonia.MapTitle')
export default class MapTitle extends Widget {
  @property()
  title = 'Vernonia';

  constructor(properties?: MapTitleProperties) {
    super(properties);
  }

  render(): tsx.JSX.Element {
    const { title } = this;
    return <div class={CSS.base}>{title}</div>;
  }
}
