import { addAircraft, updateAircraft, deleteAircraft } from './aircraft.service'
import { ContextMiddleware } from '~/middleware/utils'
import {
  addAircraftValidator,
  updateAircraftValidator
} from './aircraft.validate'

export default {
  addAircraft: async (root, args, context) => {
    const { user, clerance } = context //eslint-disable-line
    try {
      await ContextMiddleware(
        context,
        ['canEditAircrafts'],
        addAircraftValidator(args.input)
      )
      await addAircraft(args, context)
      return { message: 'Aircraft has been succesfully added', ok: true }
    } catch (err) {
      return { message: err, ok: false }
    }
  },
  updateAircraft: async (root, args, context) => {
    const { next, user } = context
    try {
      await ContextMiddleware(
        context,
        ['canEditAircrafts'],
        updateAircraftValidator({ ...args.input, id: args.id })
      )
      await updateAircraft(user, args.id, args.input)
      return { message: 'Aircraft has been succesfully updated', ok: true }
    } catch (err) {
      return next(err)
    }
  },
  deleteAircraft: async (root, args, context) => {
    const { next, user } = context
    try {
      await ContextMiddleware(context, ['admin'])
      await deleteAircraft(user, args)
      return { ok: true, message: 'Aircraft has been deleted successfully' }
    } catch (err) {
      return next(err)
    }
  }
}
