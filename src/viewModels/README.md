## View Models

Resubale logic modules. See [interfaces.d.ts](./../interfaces.d.ts) for properties and methods.

### `cov/viewModels/OAuthViewModel`

A view model for handling OAuth and signing in and out of applications.

```typescript
import OAuthViewModel from 'cov/viewModels/OAuthViewModel';
import Portal from '@arcgis/core/portal/Portal';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';

const portal = new Portal();

const oAuthViewModel = new OAuthViewModel({
  portal,
  oAuthInfo: new OAuthInfo({
    appId: 'abcde12345',
    popup: true,
  });
});

// portal must be loaded
portal.load()
  then(() => {
    oAuthViewModel.load()
      .then((signedIn: boolen) => {
        console.log(signedIn ? `${oAuthViewModel.name} is signed in` : 'not signed in')
      });
  });
```
