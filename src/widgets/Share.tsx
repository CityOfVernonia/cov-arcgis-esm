/**
 * A widget share an app via facebook and twitter.
 */

import { subclass } from '@arcgis/core/core/accessorSupport/decorators';

import { tsx } from '@arcgis/core/widgets/support/widget';

import Widget from '@arcgis/core/widgets/Widget';

const CSS = {
  base: 'cov-share',
};

@subclass('cov.widgets.Share')
export default class Share extends Widget {
  postInitialize(): void {
    const id = 'facebook-jssdk';
    const fjs = document.getElementsByTagName('script')[0];
    const js = document.createElement('script');
    if (document.getElementById(id)) return;
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0';
    fjs.parentNode?.insertBefore(js, fjs);
  }

  render(): tsx.JSX.Element {
    return (
      <div class={CSS.base}>
        <div id="fb-root"></div>
        <div class="fb-share-button" data-href={window.location.href} data-layout="button_count"></div>
        <a href="https://twitter.com/share" class="twitter-share-button">
          Tweet
        </a>
        <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
      </div>
    );
  }
}
