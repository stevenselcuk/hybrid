import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export const AircraftManufacturers = [
  'Airbus',
  'Boeing',
  'Embarer',
  'Bombardier'
]

const AircraftSchema = new mongoose.Schema({
  registration: {
    type: String,
    required: false,
    unique: true
  },
  manufacturer: {
    type: String,
    required: false,
    enum: AircraftManufacturers,
    default: AircraftManufacturers[0]
  },
  model: {
    type: String,
    required: true
  },
  msn: {
    type: String,
    required: true
  },
  weightVariant: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  totalFlightCycle: {
    type: Number,
    required: true
  },
  totalFlightHour: {
    type: Number,
    required: true
  },
  operator: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})

AircraftSchema.plugin(mongoosePaginate)

const Aircraft = mongoose.model('Aircraft', AircraftSchema)

export default Aircraft
