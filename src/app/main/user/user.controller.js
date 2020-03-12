import User from './user.model'
import {
  buildErrObject,
  handleError,
  isIDGood,
  buildSuccObject,
  itemNotFound,
  generateToken,
  verifyTheToken
} from '~/middleware/utils'
import {
  updateItem,
  deleteItem,
  getItems,
  getDeletedItems,
  getItem,
  checkQueryString,
  restoreItem
} from '~/middleware/db'
import { emailExistsExcludingMyself, emailExists } from '~/middleware/emailer'
import { log } from '~/core/logger'

const cryptoRandomString = require('crypto-random-string')

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createUser = async req => {
  return new Promise((resolve, reject) => {
    User.create(
      {
        name: req.name,
        email: req.email,
        password: req.password,
        verification: cryptoRandomString({ length: 32, type: 'base64' })
      },
      (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        if (item) {
          const removeProperties = ({
            // eslint-disable-next-line no-unused-vars
            password,
            // eslint-disable-next-line no-unused-vars
            blockExpires,
            // eslint-disable-next-line no-unused-vars
            loginAttempts,
            ...rest
          }) => rest
          resolve(removeProperties(item.toObject()))
        } else {
          reject(buildErrObject(422, 'UNKNOWN USER CREATION ERROR'))
        }
      }
    )
  })
}

const addOrUpdatePhoto = async req => {
  const { id } = req.body
  const { filename, path } = req.file

  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(
      id,
      {
        photo: {
          id: filename,
          url: path
        }
      },
      {
        new: true,
        runValidators: true,
        context: 'query'
      },
      (err, item) => {
        itemNotFound(err, item, reject, 'NOT_FOUND')
        resolve(item)
        log.info(`Photo for ${id} has successfully updated.`)
      }
    )
  })
}

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
const returnRegisterToken = item => {
  const data = {
    id: item._id,
    name: item.name,
    email: item.email,
    verified: item.verified,
    token: generateToken(item.verification)
  }
  return data
}

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const verify = async user => {
  return new Promise((resolve, reject) => {
    user.verified = true // eslint-disable-line
    user.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve({
        email: item.email,
        verified: item.verified
      })
    })
  })
}

/**
 * Checks if verification id exists for user
 * @param {string} id - verification id
 */
const verificationExists = async verification => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        verification
      },
      (err, user) => {
        if (err) {
          itemNotFound(err, user, reject, 'NOT_FOUND_OR_ALREADY_VERIFIED')
        }
        resolve(user)
      }
    )
  })
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getUsers = async (req, res) => {
  try {
    const query = await checkQueryString(req.query)
    res.status(200).json(buildSuccObject(await getItems(req, User, query)))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getUser = async (req, res) => {
  try {
    const id = await isIDGood(req.id)
    res.status(200).json(buildSuccObject(await getItem(id, User)))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const updateUser = async (req, res) => {
  try {
    const id = await isIDGood(req.id)
    const doesEmailExists = await emailExistsExcludingMyself(id, req.email)
    if (!doesEmailExists) {
      res.status(200).json(await updateItem(id, User, req))
    }
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const createNewUser = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const doesEmailExists = await emailExists(req.body.email)
    if (!doesEmailExists) {
      const item = await createUser(req.body)
      const response = returnRegisterToken(item)
      res.status(201).json(buildSuccObject(response))
    }
  } catch (error) {
    handleError(res, error)
  }
}

export const addUserPhoto = async (req, res) => {
  try {
    res.status(201).json(buildSuccObject(await addOrUpdatePhoto(req)))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 * TODO : Not works when it deployed on Heroku id:55
             - <https://github.com/stevenselcuk/Coeus/issues/49>
             Steven J. Selcuk
             stevenjselcuk@gmail.com
 */
export const verifyUser = async (req, res) => {
  try {
    const verifiedToken = await verifyTheToken(req.body.token)
    const user = await verificationExists(verifiedToken)

    if (verifiedToken && user.verification === verifiedToken) {
      const verifiedUser = await verify(user)
      res.status(200).json(verifiedUser)
    }
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const deleteUser = async (req, res) => {
  try {
    const ItemId = await isIDGood(req.body.id)
    const DeleterId = await isIDGood(req.user._id)
    res
      .status(200)
      .json(buildSuccObject(await deleteItem(ItemId, DeleterId, User)))
  } catch (error) {
    handleError(res, error)
  }
}

export const getDeletedUsers = async (req, res) => {
  try {
    res.status(200).json(buildSuccObject(await getDeletedItems(User)))
  } catch (error) {
    handleError(res, error)
  }
}

export const restoreUser = async (req, res) => {
  try {
    const ItemId = await isIDGood(req.body.id)
    res.status(200).json(buildSuccObject(await restoreItem(ItemId, User)))
  } catch (error) {
    handleError(res, error)
  }
}
