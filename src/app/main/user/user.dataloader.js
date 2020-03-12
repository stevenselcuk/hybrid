import DataLoader from 'dataloader'
import { mongooseLoader } from '@entria/graphql-mongoose-loader' // eslint-disable-line

import User from './user.model'

export const getUser = () =>
  new DataLoader(ids => mongooseLoader(User, ids))
