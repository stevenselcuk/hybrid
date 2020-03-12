// import { matchedData } from 'express-validator'
import Aircraft from './aircraft.model'
import {
  handleError,
  buildErrObject,
  buildSuccObject,
  itemAlreadyExists,
  isIDGood
} from '~/middleware/utils'
import {
  updateItem,
  restoreItem,
  deleteItem,
  createItem,
  getAllItems,
  getItems,
  getDeletedItems,
  getItem,
  checkQueryString
} from '~/middleware/db'

/**
 * Checks if a city already exists in database
 * @param {string} name - name of item
 */
const aircraftExists = async registration => {
  return new Promise((resolve, reject) => {
    Aircraft.findOne(
      {
        registration
      },
      (err, item) => {
        itemAlreadyExists(err, item, reject, 'AIRCRAFT_ALREADY_EXISTS')
        resolve(false)
      }
    )
  })
}

/**
 * Gets all items from database
 */
export const getAllAircrafts = async (req, res) => {
  return new Promise((resolve, reject) => {
    Aircraft.find(
      {},
      '-updatedAt -createdAt',
      {
        sort: {
          totalFlightCycle: -1
        }
      },
      (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        res.status(200).json(buildSuccObject(items))
      }
    )
  })
}

export const queryAircrafts = async (req, res) => {
  try {
    const query = await checkQueryString(req.query)
    res
      .status(200)
      .json(buildSuccObject(await getAllItems(req, Aircraft, query)))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getAircrafts = async (req, res) => {
  try {
    res
      .status(200)
      .json(buildSuccObject(await getItems(req, Aircraft, req.query)))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getAircraft = async (req, res) => {
  try {
    const id = await isIDGood(req.body.id)
    res.status(200).json(buildSuccObject(await getItem(id, Aircraft)))
  } catch (error) {
    handleError(res, error)
  }
}

export const getDeletedAircrafts = async (req, res) => {
  try {
    res.status(200).json(buildSuccObject(await getDeletedItems(Aircraft)))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const updateAircraft = async (req, res) => {
  try {
    const id = await isIDGood(req.body.id)
    res
      .status(200)
      .json(buildSuccObject(await updateItem(id, Aircraft, req.body)))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const createAircraft = async (req, res) => {
  try {
    const doesAircraftExists = await aircraftExists(req.body.registration)
    if (!doesAircraftExists) {
      res.status(201).json(buildSuccObject(await createItem(req, Aircraft)))
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
export const deleteAircraft = async (req, res) => {
  try {
    const ItemId = await isIDGood(req.body.id)
    const DeleterId = await isIDGood(req.user._id)
    res
      .status(200)
      .json(buildSuccObject(await deleteItem(ItemId, DeleterId, Aircraft)))
  } catch (error) {
    handleError(res, error)
  }
}

export const restoreAircraft = async (req, res) => {
  try {
    const ItemId = await isIDGood(req.body.id)
    res.status(200).json(buildSuccObject(await restoreItem(ItemId, Aircraft)))
  } catch (error) {
    handleError(res, error)
  }
}
