"use strict";
/**
 * A view model for handling OAuth and signing in and out of applications.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Accessor_1 = tslib_1.__importDefault(require("@arcgis/core/core/Accessor"));
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const IdentityManager_1 = tslib_1.__importDefault(require("@arcgis/core/identity/IdentityManager"));
const Portal_1 = tslib_1.__importDefault(require("@arcgis/core/portal/Portal"));
const Error_1 = tslib_1.__importDefault(require("@arcgis/core/core/Error"));
const LS_CRED = 'jsapiauthcred';
let OAuthViewModel = class OAuthViewModel extends Accessor_1.default {
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
        IdentityManager_1.default.registerOAuthInfos([oAuthInfo]);
        // set `oAuthViewModel` on esriId to access auth, user, etc
        // via `esriId` in other modules and widgets
        // @ts-ignore
        IdentityManager_1.default['oAuthViewModel'] = this;
        return new Promise((resolve, reject) => {
            if (portal.loaded) {
                // check for sign in
                IdentityManager_1.default
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
                            IdentityManager_1.default.registerToken(cred);
                            // check for sign in
                            IdentityManager_1.default
                                .checkSignInStatus(portal.url)
                                .then(async (credential) => {
                                // replace portal instance
                                this.portal = new Portal_1.default();
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
                reject(new Error_1.default('OAuthViewModelLoadError', 'Portal instance must be loaded before loading OAuthViewModel instance.'));
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
        IdentityManager_1.default
            // @ts-ignore
            .oAuthSignIn(url, IdentityManager_1.default.findServerInfo(url), this.oAuthInfo, {
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
        IdentityManager_1.default.destroyCredentials();
        localStorage.removeItem(LS_CRED);
        window.location.reload();
    }
};
tslib_1.__decorate([
    decorators_1.property()
], OAuthViewModel.prototype, "portal", void 0);
tslib_1.__decorate([
    decorators_1.property()
], OAuthViewModel.prototype, "oAuthInfo", void 0);
tslib_1.__decorate([
    decorators_1.property()
], OAuthViewModel.prototype, "signInUrl", void 0);
tslib_1.__decorate([
    decorators_1.property()
], OAuthViewModel.prototype, "credential", void 0);
tslib_1.__decorate([
    decorators_1.property({ aliasOf: 'portal.user' })
], OAuthViewModel.prototype, "user", void 0);
tslib_1.__decorate([
    decorators_1.property({ aliasOf: 'user.fullName' })
], OAuthViewModel.prototype, "name", void 0);
tslib_1.__decorate([
    decorators_1.property({ aliasOf: 'user.username' })
], OAuthViewModel.prototype, "username", void 0);
tslib_1.__decorate([
    decorators_1.property()
], OAuthViewModel.prototype, "signedIn", void 0);
OAuthViewModel = tslib_1.__decorate([
    decorators_1.subclass('cov.viewModels.OAuthViewModel')
], OAuthViewModel);
exports.default = OAuthViewModel;
