const fs   = require('fs');
const jwt  = require('jsonwebtoken');

let usersModel = undefined
const tokenModel = {}

const privateKEY  = fs.readFileSync('./keys/private.key', 'utf8');
const publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');

const expirity = "2h"
const signOptions = {
    expiresIn : expirity,
    algorithm : "RS256"
};

const verifyOptions = {
    expiresIn:  expirity,
    algorithm:  ["RS256"]
};

tokenModel.getJWT = (user) => {
    return new Promise(async(resolve, reject) => {
        usersModel.verifyUser(user.login, user.password)
        .then(() => {
            const payload = {name : user.name, login : user.login};
            jwt.sign(payload, privateKEY, signOptions, (err, token) => {
                resolve(token)
            })
        })
        .catch(() => {
            reject()
        })
    })
}

tokenModel.checkJWT = (token) => {
    return new Promise(async(resolve, reject) => {
        jwt.verify(token, publicKEY, verifyOptions, (err) => {
            if (err) {
                reject()
            }
            else {
                resolve()
            }
        })
    })
}

tokenModel.getExpirity = () => {
    return expirity
}

const verifyToken = (token) => {
    return new Promise(async(resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err !== null) {
          reject()
        } else {
          resolve()
        }
      })
    })
  }

/** return a closure to initialize model */
module.exports = (model) => {
    usersModel = model
    return tokenModel
}
exports.verifyToken = verifyToken