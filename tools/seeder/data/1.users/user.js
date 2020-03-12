const faker = require('faker')
const {ObjectID} = require('mongodb')

module.exports = [
  {
    _id: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
    name: 'Steven Onion',
    email: 'steven@onion.com',
    password: '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
    role: 'admin',
    clerance: ['canEditAircraft','canDeleteAircraft'],
    verified: true,
    verification: '3d6e072c-0eaf-4239-bb5e-495e6486148f',
    city: 'L.A.',
    country: 'United State of America',
    phone: '123123',
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]
