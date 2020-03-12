import { ContextMiddleware } from '~/middleware/utils'
import { test, getAircraft, getAllAircrafts } from './aircraft.service'

module.exports = {
  test: (root, args, context) =>
    ContextMiddleware(context).then(() => test(args, context)),
  getAircraft: (root, args, context) =>
    ContextMiddleware(context, ['canEditAircraft']).then(() =>
      getAircraft(args, context)
    ),
  showAllAircrafts: (root, args, context) =>
    ContextMiddleware(context, ['canViewAircraft']).then(() =>
      getAllAircrafts(args, context)
    )
}
