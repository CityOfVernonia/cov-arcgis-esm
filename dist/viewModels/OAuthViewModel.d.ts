/**
 * A view model for handling OAuth and signing in and out of applications.
 */
import Accessor from '@arcgis/core/core/Accessor';
export default class OAuthViewModel extends Accessor {
    /**
     * esri.portal.Portal instance to sign into.
     */
    portal: esri.Portal;
    /**
     * esri.identity.OAuthInfo instance to perform authentication against.
     */
    oAuthInfo: esri.OAuthInfo;
    /**
     * Alternate sign in url.
     *
     * Overrides default `${portal.url}/sharing/rest`.
     */
    signInUrl: string;
    /**
     * esri.identity.Credential returned by `checkSignInStatus()`.
     */
    credential: esri.Credential;
    /**
     * esri.portal.PortalUser instance of signed in user.
     */
    user: esri.PortalUser;
    /**
     * User name.
     */
    name: string;
    /**
     * User username.
     */
    username: string;
    /**
     * `true` or `false` a user is signed in.
     */
    signedIn: boolean;
    /**
     * Load the view model.
     *
     * @returns Promise<true | false> user signed in.
     */
    load(): Promise<boolean>;
    /**
     * Complete successful sign in.
     * @param credential
     * @param resolve
     */
    private _completeSignIn;
    /**
     * Sign into the application.
     */
    signIn(): void;
    /**
     * Sign out of the application.
     */
    signOut(): void;
}
