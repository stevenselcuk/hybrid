const faker = require('faker')
const ObjectID = require('mongodb').ObjectID

module.exports = [
  {
    _id: new ObjectID(),
    WCNumber: '737-C12-290345',
    workOrder: '2310011C1239',
    aircraft: 'TC-JKN',
    status: 'Open',
    department: 'Mechanic',
    description: 'Change Left engine IDG orign',
    reference: 'AMM 71-00-11'
  }
]
