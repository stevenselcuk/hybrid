import { UserTypes } from './user.type'
import * as UserQuery from './user.query'
import * as UserMutation from './user.mutation'


const UserResolvers = {
	Query: {
	...UserQuery,
},
  Mutation: {
  ...UserMutation,
  }
}

export {
  UserTypes,
	UserResolvers
 }
