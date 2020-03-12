import conf from '~/core/config'
import { buildErrObject } from './utils'

const crypto = require('crypto')

const algorithm = 'aes-256-cbc'
// Must be 256 bits (32 characters)

const secret = crypto
  .createHash('sha256')
  .update(String(conf.get('JWT_SECRET')))
  .digest('base64')
  .substr(0, 32)
const iv = crypto.randomBytes(16) // Initialization vector.

/**
 * Checks is password matches
 * @param {string} password - password
 * @param {Object} user - user object
 * @returns {boolean}
 */
const checkPassword = async (password, user) => {
  return new Promise((resolve, reject) => {
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      if (!isMatch) {
        resolve(false)
      }
      resolve(true)
    })
  })
}

/**
 * Encrypts text
 * @param {string} text - text to encrypt
 */
const encrypt = text => {
  const cipher = crypto.createCipheriv(algorithm, secret, iv)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

/**
 * Decrypts text
 * @param {string} text - text to decrypt
 */
const decrypt = text => {
  const decipher = crypto.createDecipheriv(algorithm, secret, iv)
  try {
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  } catch (err) {
    return err
  }
}

export { checkPassword, encrypt, decrypt }
