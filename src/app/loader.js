import { getUser } from './main/user/user.dataloader'
import { getAircraft } from './aircraft/aircraft.dataloader'

const createLoaders = () => ({
  aircraft: getAircraft(),
  user: getUser(),
})

export default createLoaders;
