import auth0 from "auth0-js";

const AUTH0_DOMAIN = 'yazid.eu.auth0.com'
const AUTH0_CLIENT_ID = 'gSTYGe7sbn55HEXgCzVbCacmBaqf2Wgd'

let idToken = null;
let profile = null;
let expiresAt = null;

const auth0Client = new auth0.WebAuth({
  // the following three lines MUST be updated
  domain: AUTH0_DOMAIN,
  audience: `https://${AUTH0_DOMAIN}/userinfo`,
  clientID: AUTH0_CLIENT_ID,
  redirectUri: "http://localhost:3000/callback",
  responseType: "id_token",
  scope: "openid profile"
});

/**
 * This is the method that the app will call right after the user is redirected from Auth0.
 * This method simply reads the hash segment of the URL to fetch the user details and the id token.
 */
export const handleAuthentication = async () => {
  return new Promise((resolve, reject) => {
    auth0Client.parseHash((err, authResult) => {
      if (err){ return reject(err);}
      if(!authResult || !authResult.idToken){ return reject(new Error('user was not registered'))}
      setSession(authResult)
      resolve(profile);
    });
  });
}

/**
 * Extracts the main items out of the result of an Auth0 authentication
 * and saves them in memory
 * @param {Object} authResult the Object returned by Auth0 
 */
export const setSession = (authResult) => {
  idToken = authResult.idToken;
  profile = authResult.idTokenPayload;
  // set the time that the id token will expire at
  expiresAt = authResult.idTokenPayload.exp * 1000;
}

/**
 * This method signs a user out by setting the profile, id_token, and expiresAt to null.
 */
export const signOut = ()  => {
  idToken = null;
  profile = null;
  expiresAt = null;
  auth0Client.logout({
    returnTo: 'http://localhost:3000',
    clientID: AUTH0_CLIENT_ID,
  });
}
/**
 * This method returns the profile of the authenticated user, if any
 */
export const getProfile = () => profile;

/**
 * This method returns the `idToken` generated by Auth0 for the current user. 
 * This is what you will use while issuing requests to your POST endpoints.
 */
export const getIdToken = () => idToken;

/**
 * This method returns whether there is an authenticated user or not.
 */
export const isAuthenticated = () => new Date().getTime() < expiresAt;

/**
 * This method initializes the authentication process.
 * In other words, this method sends your users to the Auth0 login page.
 */
export const signIn = () => auth0Client.authorize();

/**
 * Checks if the current user had a valid sessions before
 * browser refresh.
 * If yes, silently logins the user
 */
export const silentAuth = () => {
  return new Promise((resolve, reject) => {
    auth0Client.checkSession({}, (err, authResult) => {
      if (err){
        return reject(err);
      }
      setSession(authResult);
      resolve(profile);
    });
  });
}
