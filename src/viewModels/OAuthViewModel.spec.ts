import OAuthViewModel from './OAuthViewModel';

jest.mock('./OAuthViewModel');

import Portal from '@arcgis/core/portal/Portal';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';

jest.mock('@arcgis/core/core/Accessor');
jest.mock('@arcgis/core/core/accessorSupport/decorators');
jest.mock('@arcgis/core/identity/IdentityManager');
jest.mock('@arcgis/core/core/Error');

describe('cov.viewModels.OAuthViewModel', () => {
  let oAuthViewModel: OAuthViewModel;

  beforeEach(() => {
    oAuthViewModel = new OAuthViewModel({
      portal: new Portal(),
      oAuthInfo: new OAuthInfo(),
    });
  });

  // look into mocking constructor via seperate mock file
  /*
  it('should have Portal property', () => {
    expect(oAuthViewModel.portal).toBeInstanceOf(Portal);
  });

  it('should have OAuthInfo property', () => {
    expect(oAuthViewModel.oAuthInfo).toBeInstanceOf(OAuthInfo);
  });
  */

  it('should not be signed in', () => {
    expect(oAuthViewModel.signedIn).toBeFalsy();
  });
});
