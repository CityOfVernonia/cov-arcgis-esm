/**
 * Widget to display when auth is required to access an app.
 */
import cov = __cov;

import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';

const CSS = {
  base: 'cov-sign-in-required',
};

@subclass('cov.widgets.SignInRequired')
export default class SignInRequired extends Widget {
  @property()
  oAuthViewModel!: cov.OAuthViewModel;

  private _signIn() {
    this.oAuthViewModel.signIn();
  }

  render(): tsx.JSX.Element {
    return (
      <div class={CSS.base}>
        <calcite-panel>
          <h3 slot="header-content">Sign In Required</h3>
          <calcite-button
            appearance="solid"
            color="blue"
            scale="s"
            icon-start="sign-in"
            alignment="center"
            width="auto"
            onclick={this._signIn.bind(this)}
          >
            Sign In
          </calcite-button>
        </calcite-panel>
      </div>
    );
  }
}
