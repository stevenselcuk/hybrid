const faker = require('faker')
const ObjectID = require('mongodb').ObjectID

module.exports = [
  {
    _id: new ObjectID(),
    wonumber: '2310011C1239',
    aircraft: 'TC-JKN',
    type: 'A Check',
    letterCheckID: 'A-8',
    customer: 'Turkish Airlines'
  }
]
