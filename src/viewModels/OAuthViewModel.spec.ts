import OAuthViewModel from './OAuthViewModel';

import Portal from '@arcgis/core/portal/Portal';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';

jest.mock('./OAuthViewModel', () => {
  return function () {
    return {
      portal: new Portal(),
      oAuthInfo: new OAuthInfo(),
    };
  };
});

describe('cov.viewModels.OAuthViewModel', () => {
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

  // need to mock properties on instance
  it('should have Portal instance', () => {
    expect(oAuthViewModel.portal).toBeInstanceOf(Portal);
  });

  it('should have OAuthInfo instance', () => {
    expect(oAuthViewModel.oAuthInfo).toBeInstanceOf(OAuthInfo);
  });
});
