import express from 'express'
import passport from 'passport'
import trimRequest from 'trim-request'
import {
  login,
  qrLogin,
  forgotPassword,
  resetPassword,
  getRefreshToken,
  onlyCanUse
} from './auth.controller'

import {
  CheckLogin,
  CheckQRLogin,
  CheckForgotPassword,
  CheckResetPassword
} from './auth.validate'

const router = express.Router()
require('~/core/passport')

const secureIt = passport.authenticate('jwt', {
  session: true
})

/**
 * @swagger
 * definitions:
 *   Login:
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       path:
 *         type: string
 * components:
 *   schemas:
 *     User Login Credentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *       example:
 *          email: steven@onion.com
 *          password: "12345"
 *     User Login Response:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Is action Successfully performed?
 *         data:
 *           type: object
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and Authorization Module
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Login to the Coeus for further actions. It gives you back JWT token and user object.
 *     tags: [Auth]
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User Login Credentials'
 *     responses:
 *       200:
 *         description: Successfully logged
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/User Login Response'
 *       401:
 *         description: Wrong credentials
 *       402:
 *         description: Wrong Data
 */

router.post('/login', trimRequest.all, CheckLogin, login)

// TODO: At this time we have any checking method maybe later id:68
router.post('/qr-login', trimRequest.all, qrLogin)

/*
 * Forgot password route
 */
router.post('/forgot', trimRequest.all, CheckForgotPassword, forgotPassword)

/*
 * Reset password route
 */
router.post('/reset', trimRequest.all, CheckResetPassword, resetPassword)

/*
 * Get new refresh token
 */
router.get(
  '/token',
  secureIt,
  onlyCanUse(['user', 'admin']),
  trimRequest.all,
  getRefreshToken
)

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     description: Logout to the Coeus
 *     tags: [Auth]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Login'
 */
router.get(
  '/logout',
  secureIt,
  onlyCanUse(['user', 'admin']),
  trimRequest.all,
  (req, res) => {
    console.log(res)
  }
)

export default router
