const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const restrict = require('./middleware/restricted.js')

const authRouter = require('./auth/authRouter.js')
const jokesRouter = require('./jokes/jokesRouter.js')

const server = express()

server.use(helmet())
server.use(cors())
server.use(express.json())

server.use('/api/auth', authRouter)
server.use('/api/jokes', restrict, jokesRouter)

module.exports = server
