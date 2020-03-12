import express from 'express'
import passport from 'passport'
import trimRequest from 'trim-request'
import {
  queryAircrafts,
  getAllAircrafts,
  getAircrafts,
  createAircraft,
  getAircraft,
  updateAircraft,
  deleteAircraft
} from './aircraft.controller'
import { onlyCanUse } from '../main/auth/auth.controller'
import {
  checkCreateAircraft,
  checkAircraftUpdate,
  checkGetAircraft,
  checkDeleteAircraft,
  checkRestoreAircraft
} from './aircraft.validate'

require('~/core/passport')

const secureIt = passport.authenticate('jwt', {
  session: true
})

export const router = express.Router()

/*
 * Aircraft routes
 */

/*
 * Get all aircrafts with pagination
 */
router.get('/all', getAllAircrafts)

/*
 * Aircraft/s data with query
 */
router.get(
  '/find',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  queryAircrafts
)

/*
 * Aircraft/s data with query
 */
router.get('/', secureIt, onlyCanUse(['admin']), trimRequest.all, getAircrafts)

/**
 * @api {post} /__/aircraft Create a Aircraft
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Aircraft
 * @apiPermission authenticated user
 *
 * @apiParam (Request body) {String} name The task name
 *
 * @apiExample {js} Example usage:
 * const data = {
 *   "name": "Do the dishes"
 * }
 *
 * $http.defaults.headers.common["Authorization"] = token;
 * $http.post(url, data)
 *   .success((res, status) => doSomethingHere())
 *   .error((err, status) => doSomethingHere());
 *
 * @apiSuccess (Success 201) {String} message Task saved successfully!
 * @apiSuccess (Success 201) {String} id The campaign id
 *
 * @apiSuccessExample {json} Success response:
 *     HTTPS 201 OK
 *     {
 *      "message": "Task saved successfully!",
 *      "id": "57e903941ca43a5f0805ba5a"
 *    }
 *
 * @apiUse UnauthorizedError
 */
router.post(
  '/',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  checkCreateAircraft,
  createAircraft
)

/*
 * Get an single aircraft data
 */
router.get(
  '/get',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  checkGetAircraft,
  getAircraft
)

/*
 * Update aircraft (route)
 */
router.patch(
  '/',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  checkAircraftUpdate,
  updateAircraft
)

/*
 * Delete aircraft (route)
 */
router.delete(
  '/delete',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  checkDeleteAircraft,
  deleteAircraft
)

/*
 * Restore aircraft (route)
 */
router.delete(
  '/restore',
  secureIt,
  onlyCanUse(['admin']),
  trimRequest.all,
  checkRestoreAircraft,
  deleteAircraft
)

export default router
