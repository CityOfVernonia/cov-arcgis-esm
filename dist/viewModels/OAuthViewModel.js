/**
 * A view model for handling OAuth and signing in and out of applications.
 */
import { __decorate } from "tslib";
import Accessor from '@arcgis/core/core/Accessor';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import esriId from '@arcgis/core/identity/IdentityManager';
import Portal from '@arcgis/core/portal/Portal';
import Error from '@arcgis/core/core/Error';
const LS_CRED = 'jsapiauthcred';
let OAuthViewModel = class OAuthViewModel extends Accessor {
    constructor() {
        super(...arguments);
        /**
         * `true` or `false` a user is signed in.
         */
        this.signedIn = false;
    }
    /**
     * Load the view model.
     *
     * @returns Promise<true | false> user signed in.
     */
    load() {
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
                    .then((credential) => {
                    // complete successful sign in
                    this._completeSignIn(credential, resolve);
                })
                    .catch((checkSignInError) => {
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
                                .then(async (credential) => {
                                // replace portal instance
                                this.portal = new Portal();
                                await this.portal.load();
                                // complete successful sign in
                                this._completeSignIn(credential, resolve);
                            })
                                .catch(() => {
                                // neither signed into portal or with valid local storage
                                resolve(false);
                            });
                        }
                        else {
                            resolve(false);
                        }
                    }
                    else {
                        reject(checkSignInError);
                    }
                });
            }
            else {
                // reject if portal is not loaded
                reject(new Error('OAuthViewModelLoadError', 'Portal instance must be loaded before loading OAuthViewModel instance.'));
            }
        });
    }
    /**
     * Complete successful sign in.
     * @param credential
     * @param resolve
     */
    _completeSignIn(credential, resolve) {
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
        credential.on('token-change', () => {
            // @ts-ignore
            localStorage.setItem(LS_CRED, JSON.stringify(this.credential.toJSON()));
        });
    }
    /**
     * Sign into the application.
     */
    signIn() {
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
    signOut() {
        esriId.destroyCredentials();
        localStorage.removeItem(LS_CRED);
        window.location.reload();
    }
};
__decorate([
    property()
], OAuthViewModel.prototype, "portal", void 0);
__decorate([
    property()
], OAuthViewModel.prototype, "oAuthInfo", void 0);
__decorate([
    property()
], OAuthViewModel.prototype, "signInUrl", void 0);
__decorate([
    property()
], OAuthViewModel.prototype, "credential", void 0);
__decorate([
    property({ aliasOf: 'portal.user' })
], OAuthViewModel.prototype, "user", void 0);
__decorate([
    property({ aliasOf: 'user.fullName' })
], OAuthViewModel.prototype, "name", void 0);
__decorate([
    property({ aliasOf: 'user.username' })
], OAuthViewModel.prototype, "username", void 0);
__decorate([
    property()
], OAuthViewModel.prototype, "signedIn", void 0);
OAuthViewModel = __decorate([
    subclass('cov.viewModels.OAuthViewModel')
], OAuthViewModel);
export default OAuthViewModel;
