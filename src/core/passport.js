import User from '~/app/main/user/user.model'
import conf from './config'

const passport = require('passport')

const JwtStrategy = require('passport-jwt').Strategy

const auth = require('~/middleware/auth')

/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
export const jwtExtractor = req => {
  let token = null
  // TODO Order of looking for token is something. Do we really really want to use cookies or what? id:60
  // - <https://github.com/stevenselcuk/Coeus/issues/71>
  // Steven J. Selcuk
  // stevenjselcuk@gmail.com
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim()
  } else if (req.signedCookies) {
    token = req.signedCookies.COEUS_JWT
  } else if (req.body.token) {
    token = req.body.token.trim()
  } else if (req.query.token) {
    token = req.query.token.trim()
  }
  if (token) {
    // Decrypts token
    token = auth.decrypt(token)
  }
  return token
}

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: conf.get('JWT_SECRET')
}

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.data._id, (err, user) => {
    if (err) {
      return done(err, false)
    }
    return !user ? done(null, false) : done(null, user)
  })
})

passport.use(jwtLogin)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user)
    })
    .catch(error => {
      console.log(`Error: ${error}`)
    })
})
