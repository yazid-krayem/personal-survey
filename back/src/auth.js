import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'

const AUTH0_DOMAIN = 'yazid.eu.auth0.com'
const AUTH0_CLIENT_ID = 'gSTYGe7sbn55HEXgCzVbCacmBaqf2Wgd'

export const isLoggedIn = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: AUTH0_CLIENT_ID,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});
