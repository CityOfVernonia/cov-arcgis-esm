/**
 * A widget to display a disclaimer with a `Don't show me this again` option.
 */

import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';

import { tsx } from '@arcgis/core/widgets/support/widget';

import Widget from '@arcgis/core/widgets/Widget';

import Cookies from 'js-cookie';

const CSS = {
  base: 'cov-disclaimer',
  button: 'esri-button',
};

const COOKIE_NAME = 'cov_disclaimer_widget_accepted';
const COOKIE_VALUE = 'accepted';

@subclass('cov.widgets.Disclaimer')
export default class Disclaimer extends Widget {
  @property()
  title = 'Disclaimer';

  @property()
  disclaimer = `There are no warranties, expressed or implied, including the warranty of merchantability or fitness for a particular purpose, accompanying this application.`;

  static isAccepted(): boolean {
    const cookie = Cookies.get(COOKIE_NAME);
    return cookie && cookie === COOKIE_VALUE ? true : false;
  }

  render(): tsx.JSX.Element {
    return (
      <div class={CSS.base}>
        <main>
          <h3>{this.title}</h3>
          <p>{this.disclaimer}</p>
          <form bind={this} onsubmit={this._accept}>
            <label>
              <input type="checkbox" name="NOSHOW" />
              Don't show me this again
            </label>
            <button class={CSS.button}>Accept</button>
          </form>
        </main>
      </div>
    );
  }

  private _accept(evt: Event): void {
    evt.preventDefault();
    if ((evt.target as HTMLFormElement).NOSHOW.checked) {
      Cookies.set(COOKIE_NAME, COOKIE_VALUE, { expires: 60 });
    }
    this.emit('accepted');
    this.destroy();
  }
}
