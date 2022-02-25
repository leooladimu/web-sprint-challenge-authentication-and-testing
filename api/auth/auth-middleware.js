const User = require('./auth-model')
const bcrypt = require('bcryptjs')

async function checkUsernameTaken(req, res, next) {
  const { username } = req.body;
  const [oldUser] = await User.findBy({ username })
  if (oldUser) {
    next({ status: 400, message: 'username taken' })
  }
  next()
}

function validateBody(req, res, next) {
  const { username, password } = req.body
  if (!username || !password) {
    next({ status: 400, message: 'username and password required' })
  }
  next()
}

async function validateUser(req, res, next) {
  const { username } = req.body
  const [user] = await User.findBy({ username })
  if (!user) {
    next({ status: 404, message: 'invalid credentials' })
  }
  req.user = user
  next()
}

async function validatePassword(req, res, next) {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    next()
  }
  next({ status: 400, message: 'invalid credentials' })
}

module.exports = {
  checkUsernameTaken,
  validateBody,
  validateUser,
  validatePassword
}