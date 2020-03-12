import { check } from 'express-validator'
import { theValidationResult } from '~/middleware/utils'

const Joi = require('@hapi/joi')

/**
 * Validates create new item request
 */
export const checkCreateAircraft = [
  check('registration')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  (req, res, next) => {
    theValidationResult(req, res, next)
  }
]

/**
 * Validates update item request
 */
export const checkAircraftUpdate = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    theValidationResult(req, res, next)
  }
]

/**
 * Validates get item request
 */
export const checkGetAircraft = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    theValidationResult(req, res, next)
  }
]

/**
 * Validates delete item request
 */
export const checkDeleteAircraft = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    theValidationResult(req, res, next)
  }
]

export const checkRestoreAircraft = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    theValidationResult(req, res, next)
  }
]

const addAircraftSchema = Joi.object().keys({
  registration: Joi.string()
    .min(1)
    .max(60)
    .required()
});
const updateAircraftSchema = Joi.object().keys({
  id: Joi.string().required()
});

export const addAircraftValidator = req => {
  const reqBody = req.body || req
  return new Promise((resolve, reject) =>
    Joi.validate(reqBody, addAircraftSchema, err => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  )
}
export const updateAircraftValidator = req => {
  const reqBody = req.body || req
  return new Promise((resolve, reject) =>
    Joi.validate(reqBody, updateAircraftSchema, err => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  )
}
