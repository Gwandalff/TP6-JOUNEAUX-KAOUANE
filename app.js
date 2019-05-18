const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const usersRouter = require('./routes/users-v1')
const usersModel = require('./model/users')

const authRouter = require('./routes/auth-v1')
const tokenModel = require('./model/token')

const app = express()

app.use(bodyParser.json())

// Activation de Helmet
app.use(helmet({noSniff: true}))

app.use((req, res, next) => {    
    //auth-v1 = login + verifyAccess
    if(!req.url.includes("/v1/auth/login") && !req.method==='POST'){
        let token = null
        try {
            token = req.headers.authorization.split(" ")[1]
        } 
        catch (error) {
            res
            .status(401)
            .json({ code    : 0,
                type    : "authorization",
                message : "no access token"})
        }
        if (token){
            tokenModel.verifyToken(token)
            .then(() => {
                next()
            })
            .catch(() => {
                res
                .status(401)
                .json({ code    : 0,
                    type    : "authorization",
                    message : "unvalid access token"})
            })
        }
    }
    else {
        next()
    }
})

// On injecte le model dans les routers. Ceci permet de supprimer la dépendance
// directe entre les routers et le modele
app.use('/v1/users', usersRouter(usersModel))
app.use('/v1/auth', authRouter(tokenModel))

// For unit tests
exports.app = app