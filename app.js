const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const mongoose = require('mongoose')
const config = require('config')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const { port: db_port, host: db_host, name: db_name, username: db_username, password: db_password } = config.get('Database')

if(db_username !== "" && db_password !== "") {
  mongoose.connect(`mongodb://${db_username}:${db_password}@${db_host}:${db_port}/${db_name}`, {useNewUrlParser: true});
} else {
  mongoose.connect(`mongodb://${db_host}:${db_port}/${db_name}`, {useNewUrlParser: true});
}

const alertsRouter = require('./routes/alerts-v1')
const alertsModel = require('./alertsModel/alertsModels')

const app = express()

const authChecker = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send()
  }
  let token = req.headers.authorization.split(' ')[1]

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if(err !== null) {
      res.status(401).json({
        message: "Unauthorized",
        type: "Unauthorized",
        code: 0
      })
    } else {
      next()
    }
  })
}

app.use(authChecker)

app.use(bodyParser.json())

// Activation de Helmet
app.use(helmet({noSniff: true}))

app.use('/alerts', alertsRouter(alertsModel))

exports.app = app