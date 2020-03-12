/**
 * db actions and functions.
 * @module middleware/db
 */

import { buildErrObject, itemNotFound, parser } from './utils'
import { log } from '~/core/logger'
/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = {}
  sortBy[sort] = order
  return sortBy
}

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
const cleanPaginationID = result => {
  result.docs.map(element => delete element.id) // eslint-disable-line
  return result
}

/**
 * Builds initial options for query
 * @param {Object} query - query object
 * @TODO For now need "populate" option but we have not...
 * @SEE for more option passing https://github.com/WebGangster/mongoose-paginate-v2#readme
 */
const listInitOptions = async req => {
  return new Promise(resolve => {
    const select = req.query.select || ''
    const order = req.query.order || -1
    const sort = req.query.sort || 'createdAt'
    const sortBy = buildSort(sort, order)
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 5
    const options = {
      select,
      sort: sortBy,
      lean: true,
      page,
      limit
    }
    resolve(options)
  })
}

const checkItemIsExist = async (model, _id) => {
  return new Promise((resolve, reject) => {
    model.findOne({ _id }, (err, result) => {
      if (result) {
        resolve(true)
      } else reject(buildErrObject(422, 'NOTHIN FOUND'))
    })
  })
}
/**
 * Checks the query string for filtering records
 * query.filter should be the text to search (string)
 * query.fields should be the fields to search into (array)
 * @param {Object} query - query object
 */
const checkQueryString = async query => {
  // eslint-disable-line
  return new Promise((resolve, reject) => {
    try {
      if (
        typeof query.filter !== 'undefined' &&
        typeof query.fields !== 'undefined'
      ) {
        const data = {
          $or: []
        }
        const array = []
        // Takes fields param and builds an array by splitting with ','
        const arrayFields = query.fields.split(',')
        // Adds SQL Like %word% with regex
        arrayFields.map(item => {
          return array.push({
            [item]: {
              $regex: new RegExp(query.filter, 'i')
            }
          })
        })
        // Puts array result in data
        data.$or = array
        resolve(data)
      } else {
        resolve({})
      }
    } catch (err) {
      reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
    }
  })
}

/**
 * Gets items from database
 * @param {Object} req - request object
 * @param {Object} query - query object
 */
const getAllItems = async (req, model, query) => {
  const options = await listInitOptions(req)
  return new Promise((resolve, reject) => {
    model.paginate(query, options, (err, items) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(cleanPaginationID(items))
    })
  })
}

/**
 * Gets items from database
 * @param {Object} req - request object
 * @param {Object} query - query object
 * Now supports find and select
 * @TODO We also need population, limit etc.
 * @SEE https://github.com/leodinas-hao/mongoose-query-parser#readme
 */
const getItems = async (req, model, query) => {
  const { filter, select } = parser.parse(query)
  return new Promise((resolve, reject) => {
    model
      .find(filter)
      .select(select)
      .exec((err, result) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(result)
      })
  })
}

const getDeletedItems = async model => {
  return new Promise((resolve, reject) => {
    model.findDeleted((err, result) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(result)
    })
  })
}

/**
 * Gets item from database by id
 * @param {string} id - item id
 */
const getItem = async (id, model) => {
  return new Promise((resolve, reject) => {
    model.findById(id)
    .exec((err, result) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(result)
    })
  })
}

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async (req, model) => {
  return new Promise((resolve, reject) => {
    model.create(req.body, (err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(item)
      log.info(`Item ${item.id} has successfully created.`)
    })
  })
}

/**
 * [deleteItem Soft deletes with given ObjectID and records who did this, when did this...]
 *
 * @method deleteItem
 *
 * It's good. huh? We need soft deletes.
 * @see for details : https://github.com/dsanel/mongoose-delete
 *
 * @param  {string}   itemID The item that we want to (soft) delete.
 * @param  {string}   deleterID Who wants to delete
 * @param  {object}   model In which mongodb model
 *
 * @return {Promise} If successfully returns deleted: true
 */
const deleteItem = async (itemID, deleterID, model) => {
  return new Promise((resolve, reject) => {
    model.findById(itemID, (err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      if (item) {
        item.delete(deleterID, () => {
          resolve({ deleted: true })
          log.info(`Item ${itemID} has successfully deleted.`)
        })
      } else {
        reject(buildErrObject(422, 'ITEM HAS ALREADY DELETED.'))
      }
    })
  })
}

const restoreItem = async (itemID, model) => {
  return new Promise((resolve, reject) => {
    model.findById(itemID, (err, item) => {
      itemNotFound(err, item, reject, 'NOT_FOUND')
      item.restore(() => {
        log.info(`Item ${itemID} has successfully restored.`)
        resolve({ restored: true })
      })
    })
  })
}

/**
 * Updates an item in database by id
 * @param {string} id - item id
 * @param {Object} req - request object
 */
const updateItem = async (id, model, req) => {
  return new Promise((resolve, reject) => {
    model.findByIdAndUpdate(
      id,
      req,
      {
        new: true,
        runValidators: true,
        context: 'query'
      },
      (err, item) => {
        itemNotFound(err, item, reject, 'NOT_FOUND')
        resolve(item)
        log.info(`Item ${id} has successfully updated.`)
      }
    )
  })
}

export {
  updateItem,
  restoreItem,
  deleteItem,
  createItem,
  getAllItems,
  getItems,
  checkItemIsExist,
  getDeletedItems,
  getItem,
  checkQueryString
}
