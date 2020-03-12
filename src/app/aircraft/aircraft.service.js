import Aircraft from './aircraft.model'
import { buildErrObject } from '~/middleware/utils'
import { log } from '~/core/logger'

const getAllAircrafts = async (args, context) => {
  if (args) {
    log.info(args)
  }
  if (context) {
    log.info(context)
  }

  return new Promise((resolve, reject) => {
    try {
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
          const totalCount = Aircraft.countDocuments()
          resolve({ totalCount, data: items })
        }
      )
    } catch (err) {
      reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
    }
  })
}

const getAircraft = async (args, context) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(context.loaders)
      resolve(context.loaders.aircraft.load(args.id))
    } catch (err) {
      console.log(err)
      reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
    }
  })
}

const addAircraft = async args => {
  return new Promise((resolve, reject) => {
    try {
      console.log(args)
      resolve({ registration: 'stuff' })
    } catch (err) {
      reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
    }
  })
}

const updateAircraft = async args => {
  return new Promise((resolve, reject) => {
    try {
      console.log(args)
      resolve({ registration: 'stuff' })
    } catch (err) {
      reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
    }
  })
}

const deleteAircraft = async args => {
  return new Promise((resolve, reject) => {
    try {
      console.log(args)
      resolve({ registration: 'stuff' })
    } catch (err) {
      reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
    }
  })
}

const test = async args => {
  return new Promise((resolve, reject) => {
    try {
      console.log(args)
      resolve({ ok: true, message: 'Yup, seems good 🙌🏻' })
    } catch (err) {
      reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
    }
  })
}

export {
  test,
  getAllAircrafts,
  getAircraft,
  addAircraft,
  updateAircraft,
  deleteAircraft
}
