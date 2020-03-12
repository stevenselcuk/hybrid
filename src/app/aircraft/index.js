import { AircraftTypes } from './aircraft.type'
import * as AircraftQuery from './aircraft.query'
import * as AircraftMutation from './aircraft.mutation'


const AircraftResolvers = {
	Query: {
	...AircraftQuery,
},
  Mutation: {
  ...AircraftMutation,
  }
}

export { 
	AircraftTypes,
	AircraftResolvers
 }