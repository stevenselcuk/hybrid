import express from 'express'
import passport from 'passport'
import trimRequest from 'trim-request'
import {
  getUsers,
  getUser,
  createNewUser,
  verifyUser,
  deleteUser,
  getDeletedUsers,
  restoreUser,
  updateUser,
  addUserPhoto
} from './user.controller'
import {
   checkVerify,
   checkNewUser,
   checkUpdateUser,
   checkGetUser,
   checkDeleteUser,
   checkRestoreUser,
 } from './user.validate'

import { onlyCanUse } from '../auth/auth.controller'
// import uploader from '~/core/multer'

const router = express.Router()
require('~/core/passport')

const secureIt = passport.authenticate('jwt', {
  session: true
})

/*
 * Users routes
 */

/*
 * Get users route
 */
router.get(
  '/',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  getUsers
)

/*
 * Create new item route
 */
router.post(
  '/',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  checkNewUser,
  createNewUser
)

/*
 * Create new item route
 */
router.post(
  '/photo',
  secureIt,
  onlyCanUse(['admin']),
 // uploader.single('image'),
//  checkUserPhoto,
  addUserPhoto
)



/*
 * Verify route
 */
router.post('/verify', trimRequest.all, checkVerify, verifyUser)

/*
 * Get deleted users
 */
router.get(
  '/deleted',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
//  checkDeleteUser,
 getDeletedUsers
)

/*
 * Get item route
 */
router.get(
  '/:id',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  checkGetUser,
  getUser
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  checkUpdateUser,
  updateUser
)

/*
 * Delete item route
 */
router.post(
  '/delete',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  checkDeleteUser,
  deleteUser
)



/*
 * Restore User (route)
 */
router.post(
  '/restore',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  checkRestoreUser,
  restoreUser
)

export default router
