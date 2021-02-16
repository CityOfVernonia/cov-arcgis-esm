import Widget from '@arcgis/core/widgets/Widget';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Cookies from 'js-cookie';

interface DisclaimerModalProperties extends esri.WidgetProperties {
  title?: string;
  message?: string;
}

const COOKIE_NAME = encodeURIComponent(location.origin + location.pathname);
const COOKIE_VALUE = 'accepted';

@subclass('cov.Vernonia.DisclaimerModal')
export default class DisclaimerModal extends Widget {
  @property()
  title = 'Disclaimer';

  @property()
  message =
    'There are no warranties, expressed or implied, including the warranty of merchantability or fitness for a particular purpose, accompanying this application.';

  @property()
  private _active = true;

  constructor(properties?: DisclaimerModalProperties) {
    super(properties);
    // add directly to <body>
    this.container = document.createElement('div');
    document.body.append(this.container);
  }

  static isAccepted(): boolean {
    const cookie = Cookies.get(COOKIE_NAME);
    return cookie && cookie === COOKIE_VALUE ? true : false;
  }

  private _clickEvent() {
    Cookies.set(COOKIE_NAME, COOKIE_VALUE, { expires: 60 });
    this._active = false;
    setTimeout(() => {
      this.destroy();
    }, 2000);
  }

  render(): tsx.JSX.Element {
    const { id, _active, title, message } = this;
    return (
      <div>
        <calcite-modal
          width="s"
          aria-labelledby={`modal_${id}`}
          active={_active}
          disable-close-button=""
          disable-escape=""
        >
          <h3 slot="header" id={`modal_${id}`}>
            {title}
          </h3>
          <div slot="content">{message}</div>
          <calcite-button slot="primary" onclick={this._clickEvent.bind(this)}>
            I agree
          </calcite-button>
        </calcite-modal>
      </div>
    );
  }
}
