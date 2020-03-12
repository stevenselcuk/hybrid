// Import the dependencies for testing
import chai, { expect } from 'chai'
import faker from 'faker'
import chaiHttp from 'chai-http'
import { Application, stop } from '~/server'
import User from '~/app/main/user/user.model'

process.env.NODE_ENV = 'test'

const request = require('supertest')(Application)
// Configure chai
chai.use(chaiHttp)
chai.should()

const createdUsers = []

let userID = ''
let theToken = ''
let verificationToken = ''

const userCredentials = {
  email: 'admin@admin.com',
  password: '12345'
}

// This is seperated cuz We have a test about that.
const email = faker.internet.email()

const newUser = {
  name: faker.name.firstName(),
  email,
  password: faker.internet.password(),
  role: faker.random.arrayElement(['admin', 'user']),
  phone: faker.phone.phoneNumber(),
  city: faker.address.city(),
  country: faker.address.country()
}

describe('User tests', () => {
  describe('Login for token for further test', () => {
    it('Must gives back token', done => {
      chai
        .request(Application)
        .post('/__/auth/login')
        .send(userCredentials)
        .then(res => {
          res.should.have.status(200)
          theToken = res.body.data.token
          done()
        })
    })
  })

  // ROUTE: [GET] /__/users
  // MODEL: USER
  // CONTROLLER: USER
  // Must gives back all of users list in JSON
  // See the function getUsers under controllers/user
  // Must be auth

  describe('[GET] /__/user/ Get Users List', () => {
    it('must give users list', done => {
      chai
        .request(Application)
        .get('/__/user')
        .set('Authorization', `Bearer ${theToken}`)
        .end((error, response) => {
          response.should.have.status(200)
          response.body.success.should.equal(true)
          done()
        })
    })
  })

  // ROUTE: [POST] /__/users
  // MODEL: USER
  // CONTROLLER: USER
  // Must verify user with given verification token
  // See the function createNewUser under controllers/user
  // Must be auth
  // Must have correct credentials (see for details controllers/users.validate)

  describe('[POST] /__/user/ Create a new user', () => {
    it('must give back the new users credentials', done => {
      chai
        .request(Application)
        .post('/__/user')
        .set('Authorization', `Bearer ${theToken}`)
        .send(newUser)
        .end((error, response) => {
          verificationToken = response.body.data.token
          userID = response.body.data.id
          createdUsers.push(response.body.data.id)
          response.should.have.status(201)
          response.body.success.should.equal(true)
          done()
        })
    })
  })

  // ROUTE: [POST] /__/users/verify
  // MODEL: USER
  // CONTROLLER: USER
  // Must verify user with given verification token
  // See the function verifyUser under controllers/user
  // Auth does not necessary
  // Must have verification token

  describe('[POST] /__/user/verify Verify the user with given verification token', () => {
    it('must give back a positive vibe 😐', done => {
      chai
        .request(Application)
        .post('/__/user/verify')
        .send({ token: verificationToken })
        .end((error, response) => {
          response.should.have.status(200)
          response.body.verified.should.equal(true)
          done()
        })
    })
  })

  // ROUTE: [POST] /__/users
  // MODEL: USER
  // CONTROLLER: USER
  // Must deny to creating new user with same e-mail
  // See the function createNewUser under controllers/user
  // Must be auth
  // Must have new user credentials on body

  describe('[POST] /__/user Try to create new user with same e-mail', () => {
    it('must intercept this shitty situation', done => {
      chai
        .request(Application)
        .post('/__/user')
        .set('Authorization', `Bearer ${theToken}`)
        .send(newUser)
        .end((error, response) => {
          response.should.have.status(422)
          response.body.success.should.equal(false)
          done()
        })
    })
  })

  // ROUTE: [DELETE] /__/users/:id
  // MODEL: USER
  // CONTROLLER: USER
  // Deletes user with given user id on params
  // See the function deleteUser under controllers/user
  // Must be auth.
  // Must have id on param

  describe('[DELETE] /__/user Try to delete user with given user ID', () => {
    it('must be delete the user successfully', done => {
      chai
        .request(Application)
        .post(`/__/user/delete`)
        .set('Authorization', `Bearer ${theToken}`)
        .send({ id: userID })
        .end((error, response) => {
          response.should.have.status(200)
          response.body.success.should.equal(true)
          response.body.data.deleted.should.equal(true)
          done()
        })
    })
  })

  // eslint-disable-next-line
  after(() => {
    // We have to clean our mess.
    //	createdUsers.forEach(id => {
    //		User.findByIdAndRemove(id, err => {
    //			if (err) {
    //				console.log(err)
    //			}
    //		})
    //	})
    stop()
  })
})
