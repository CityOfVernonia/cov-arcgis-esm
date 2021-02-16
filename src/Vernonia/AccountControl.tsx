import cov = __cov;
import Widget from '@arcgis/core/widgets/Widget';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx, renderable } from '@arcgis/core/widgets/support/widget';

interface AccountControlProperties extends esri.WidgetProperties {
  oAuthViewModel: cov.OAuthViewModel;
}

const CSS = {
  base: 'cov-vernonia--account-control',
};

@subclass('cov.Vernonia.AccountControl')
export default class AccountControl extends Widget {
  @property()
  @renderable()
  oAuthViewModel!: cov.OAuthViewModel;

  @property({
    aliasOf: 'oAuthViewModel.user',
    dependsOn: ['oAuthViewModel'],
  })
  @renderable()
  user!: esri.PortalUser;

  constructor(properties: AccountControlProperties) {
    super(properties);
  }

  render(): tsx.JSX.Element {
    const { oAuthViewModel, user } = this;

    return user ? (
      <div class={CSS.base}>
        <p>
          <calcite-avatar
            scale="l"
            full-name={oAuthViewModel.user.fullName}
            username={oAuthViewModel.user.username}
            thumbnail={oAuthViewModel.user.thumbnailUrl}
          ></calcite-avatar>
          <span>{user.fullName}</span>
        </p>
        <p>{user.username}</p>
        <p>
          <calcite-link href={`${oAuthViewModel.portal.url}/home/content.html`} target="_blank">
            My Content
          </calcite-link>
        </p>
        <p>
          <calcite-link href={`${oAuthViewModel.portal.url}/home/user.html`} target="_blank">
            My Profile
          </calcite-link>
        </p>
        <calcite-button scale="s" width="full" onclick={oAuthViewModel.signOut.bind(oAuthViewModel)}>
          Sign out
        </calcite-button>
      </div>
    ) : (
      // this should never need to be rendered but it's a safe fallback if widget is rendered and not signed in
      <div class={CSS.base}>
        <calcite-button scale="s" width="full" onclick={oAuthViewModel.signIn.bind(oAuthViewModel)}>
          Sign in
        </calcite-button>
      </div>
    );
  }
}
