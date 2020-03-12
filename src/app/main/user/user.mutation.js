import { addUser, updateUser, deleteUser } from './user.service'
import { ContextMiddleware } from '~/middleware/utils'
import {
  checkNewUser,
  checkUpdateUser
} from './user.validate'

export default {
  addUser: async (root, args, context) => {
    const { user, clerance } = context //eslint-disable-line
    try {
      await ContextMiddleware(
        context,
        ['canAddUser'],
        checkNewUser(args.input)
      )
      await addUser(args, context)
      return { message: 'User has been succesfully added', ok: true }
    } catch (err) {
      return { message: err, ok: false }
    }
  },
  updateUser: async (root, args, context) => {
    const { next, user } = context
    try {
      await ContextMiddleware(
        context,
        ['canEditUsers'],
        checkUpdateUser({ ...args.input, id: args.id })
      )
      await updateUser(user, args.id, args.input)
      return { message: 'User has been succesfully updated', ok: true }
    } catch (err) {
      return next(err)
    }
  },
  deleteUser: async (root, args, context) => {
    const { next, user } = context
    try {
      await ContextMiddleware(context, ['admin'])
      await deleteUser(user, args)
      return { ok: true, message: 'User has been deleted successfully' }
    } catch (err) {
      return next(err)
    }
  }
}
