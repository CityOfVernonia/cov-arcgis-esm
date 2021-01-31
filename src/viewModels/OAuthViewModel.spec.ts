import OAuthViewModel from './OAuthViewModel';

import Portal from '@arcgis/core/portal/Portal';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';

jest.mock('@arcgis/core/core/Accessor');
jest.mock('@arcgis/core/core/accessorSupport/decorators');
jest.mock('@arcgis/core/identity/IdentityManager');
jest.mock('@arcgis/core/core/Error');

describe('cov.viewModels.OAuthViewModel', () => {
  const oAuthViewModel = new OAuthViewModel({
    portal: new Portal(),
    oAuthInfo: new OAuthInfo(),
  });

  it('should not be signed in', () => {
    expect(oAuthViewModel.signedIn).toBeFalsy();
  });

  // need to mock properties on instance
  it('should set Portal property', () => {
    expect(oAuthViewModel.portal).toBeUndefined();
    oAuthViewModel.portal = new Portal();
    expect(oAuthViewModel.portal).toBeInstanceOf(Portal);
  });
});
