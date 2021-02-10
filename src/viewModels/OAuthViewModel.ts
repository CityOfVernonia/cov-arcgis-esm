/**
 * A view model for handling OAuth and signing in and out of applications.
 */

import Accessor from '@arcgis/core/core/Accessor';

import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';

import esriId from '@arcgis/core/identity/IdentityManager';

import Portal from '@arcgis/core/portal/Portal';

import Error from '@arcgis/core/core/Error';

const LS_CRED = 'jsapiauthcred';

@subclass('cov.viewModels.OAuthViewModel')
export default class OAuthViewModel extends Accessor {
  /**
   * esri.portal.Portal instance to sign into.
   */
  @property()
  portal!: esri.Portal;

  /**
   * esri.identity.OAuthInfo instance to perform authentication against.
   */
  @property()
  oAuthInfo!: esri.OAuthInfo;

  /**
   * Alternate sign in url.
   *
   * Overrides default `${portal.url}/sharing/rest`.
   */
  @property()
  signInUrl!: string;

  /**
   * esri.identity.Credential returned by `checkSignInStatus()`.
   */
  @property()
  credential!: esri.Credential;

  /**
   * esri.portal.PortalUser instance of signed in user.
   */
  @property({ aliasOf: 'portal.user' })
  user!: esri.PortalUser;

  /**
   * User name.
   */
  @property({ aliasOf: 'user.fullName' })
  name!: string;

  /**
   * User username.
   */
  @property({ aliasOf: 'user.username' })
  username!: string;

  /**
   * `true` or `false` a user is signed in.
   */
  @property()
  signedIn = false;

  /**
   * Load the view model.
   *
   * @returns Promise<true | false> user signed in.
   */
  load(): Promise<boolean> {
    const { portal, oAuthInfo } = this;

    esriId.registerOAuthInfos([oAuthInfo]);

    // set `oAuthViewModel` on esriId to access auth, user, etc
    // via `esriId` in other modules and widgets
    // @ts-ignore
    esriId['oAuthViewModel'] = this;

    return new Promise((resolve, reject) => {
      if (portal.loaded) {
        // check for sign in
        esriId
          .checkSignInStatus(portal.url)
          .then((credential: esri.Credential) => {
            // complete successful sign in
            this._completeSignIn(credential, resolve as (value?: boolean | PromiseLike<boolean>) => void);
          })
          .catch((checkSignInError: esri.Error): void => {
            if (checkSignInError.message === 'User is not signed in.') {
              // check local storage
              const localStorageAuth = localStorage.getItem(LS_CRED);
              if (localStorageAuth) {
                const cred = JSON.parse(localStorageAuth);
                // check for stored credentials with null values
                if (!cred.token) {
                  localStorage.removeItem(LS_CRED);
                  resolve(false);
                  return;
                }
                // register token
                esriId.registerToken(cred);
                // check for sign in
                esriId
                  .checkSignInStatus(portal.url)
                  .then(async (credential: esri.Credential) => {
                    // replace portal instance
                    this.portal = new Portal();
                    await this.portal.load();
                    // complete successful sign in
                    this._completeSignIn(credential, resolve as (value?: boolean | PromiseLike<boolean>) => void);
                  })
                  .catch(() => {
                    // neither signed into portal or with valid local storage
                    resolve(false);
                  });
              } else {
                resolve(false);
              }
            } else {
              reject(checkSignInError);
            }
          });
      } else {
        // reject if portal is not loaded
        reject(
          new Error(
            'OAuthViewModelLoadError',
            'Portal instance must be loaded before loading OAuthViewModel instance.',
          ),
        );
      }
    });
  }

  /**
   * Complete successful sign in.
   * @param credential
   * @param resolve
   */
  private _completeSignIn(
    credential: esri.Credential,
    resolve: (value?: boolean | PromiseLike<boolean>) => void,
  ): void {
    // set local storage
    // @ts-ignore
    localStorage.setItem(LS_CRED, JSON.stringify(credential.toJSON()));
    // set class properties
    this.credential = credential;
    // this.user = this.portal.user;
    this.signedIn = true;
    // resolve signed in
    resolve(true);
    // reset local storage when token is changed
    // seems legit...but unsure if it will cause any issues at this point
    credential.on('token-change', (): void => {
      // @ts-ignore
      localStorage.setItem(LS_CRED, JSON.stringify(this.credential.toJSON()));
    });
  }

  /**
   * Sign into the application.
   */
  signIn(): void {
    const url = this.signInUrl || `${this.portal.url}/sharing/rest`;
    esriId
      // @ts-ignore
      .oAuthSignIn(url, esriId.findServerInfo(url), this.oAuthInfo, {
        oAuthPopupConfirmation: false,
        signal: new AbortController().signal,
      })
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        // do nothing...user aborted sign in
      });
  }

  /**
   * Sign out of the application.
   */
  signOut(): void {
    esriId.destroyCredentials();
    localStorage.removeItem(LS_CRED);
    window.location.reload();
  }
}
