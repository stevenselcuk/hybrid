import DataLoader from 'dataloader'
import { mongooseLoader } from '@entria/graphql-mongoose-loader' // eslint-disable-line

import Aircraft from './aircraft.model'

export const getAircraft = () =>
  new DataLoader(ids => mongooseLoader(Aircraft, ids))
