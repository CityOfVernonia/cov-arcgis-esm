import OAuthViewModel from './OAuthViewModel';

import Portal from '@arcgis/core/portal/Portal';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';

describe('cov/viewModels/OAuthViewModel', () => {
  let oAuthViewModel: OAuthViewModel;

  beforeEach(() => {
    oAuthViewModel = new OAuthViewModel({
      portal: new Portal(),
      oAuthInfo: new OAuthInfo(),
    });
  });

  it('should not be signed in', () => {
    expect(oAuthViewModel.signedIn).toBeFalsy();
  });
});
