<p align="center">
  <a href="https://github.com/stevenselcuk/hybrid">
    <img
      src="https://i.imgur.com/LKckQpu.png"
      height="120"
      alt="theOnion"
      title="Hybrid API Boilerplate"
    />
  </a>



<p align="center">
   <h1>hybrid</em></h1>
</p>

[![Build Status](https://travis-ci.com/stevenselcuk/hybrid.svg?branch=master)](https://travis-ci.com/stevenselcuk/hybrid) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/8c56516433ce4306a945a0725189c752)](https://www.codacy.com/manual/stevenjselcuk/hybrid?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=stevenselcuk/hybrid&amp;utm_campaign=Badge_Grade) [![Maintainability](https://api.codeclimate.com/v1/badges/9d922e502c35dc58c8a7/maintainability)](https://codeclimate.com/github/stevenselcuk/hybrid/maintainability)

Are you interested? 👀 Live Demo : [https://hybridapi.herokuapp.com/](https://hybridapi.herokuapp.com/)

REST API Documentation:  [https://hybridapi.herokuapp.com/api-docs/](https://hybridapi.herokuapp.com/api-docs/) (Swagger UI)

JS Documentation:  [https://hybridapi.herokuapp.com/docs](https://hybridapi.herokuapp.com/docs) (JSDoc)


<p align="center">
   Starting point for your awesome project. Hybrid gives you best of two world. REST and GraphQL with awesome stack. Just keep reading this readme file to discovering it.
</p>

# 🔥Features

### 🏭Development (w/ Reloading)

- Webpack (with Babel & Eslint Loader)
- Nodemon
- Winston for logging (console and log file)

### 🏢Building

- Webpack & Babel

### 📲Deploy

- Dockerized
- PM2
- Heroku ready

### 🧪Testing

- Mocha & Chai (with auth & user tests)
- Coverage ready with NYC
- Codecov ready

### 🚐CI 
- Travis

### 📚Documentation

- Swagger UI & server
- JSDoc (a classic)
- Postman ( I ❤️it)

### 🛠Tools

- Seeding

# Tech

- Eslint
- Prettier
- Babel 7
- Webpack
- Apollo Server
- Express
- MongoDB with Mongoose
- Redis Cache (on both of REST & GrapQL)
- Multer
- Passport
- Jwt



# Start to Developing

```javascript
// Clone it
git clone https://github.com/stevenselcuk/hybrid.git

// enter folder
cd hybrid

// Install deps
yarn

// Seed admin account and other demo material
yarn seed

// For using Nodemon
yarn dev

// or using Webpack
yarn dev:webpack

// That's all
```



# Build

Build with Webpack

`yarn build`

or building with Babel

`yarn build:babel`

# Testing

`yarn test`
