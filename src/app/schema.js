import { makeExecutableSchema } from 'graphql-tools'
// uncomment when adding more resolvers.
// import { merge } from 'lodash'

import { AircraftTypes, AircraftResolvers } from '~/app/aircraft'
import { UserTypes, UserResolvers } from '~/app/main/user'

const Root = /* GraphQL */ `
  type Query {
    default: String
  }
  type Mutation {
    default: String
  }
  type Subscription {
    dummy: String
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`
// uncomment when adding more resolvers.
// const resolvers = merge(AircraftResolvers)

const schema = makeExecutableSchema({
  typeDefs: [Root, AircraftTypes, UserTypes],
  resolvers: [AircraftResolvers, UserResolvers],
})

export default schema
