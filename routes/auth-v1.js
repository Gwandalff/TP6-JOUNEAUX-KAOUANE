const express = require('express')
const router = express.Router()

let tokenModel = undefined

/* Control tokenModel initialisation */
router.use((req, res, next) => {
  /* istanbul ignore if */
  if (!tokenModel) {
    res
      .status(500)
      .json({message: 'model not initialised'})
  }
  next()
})

/* GET a specific user by id */
router.get('/verifyaccess', (req, res, next) =>{
    let token = null
    try{
      token = req.headers.authorization.split(" ")[1]
    }
    catch(error){
      res
      .status(401)
      .json({code : 0,
             type : "authorization",
             message : "no access token"})
    }
    if(token){
      tokenModel.checkJWT(token)
      .then(() => {
        res
        .status(200)
        .json({message : "valid access token"})
      })
      .catch(() => {
        res
        .status(401)
        .json({code : 0, 
               type: "authorization", 
               message : "unvalid access token"})
      })
    }
  })

router.post('/login', function (req, res, next) {
  tokenModel.getJWT(req.body)
  .then((token) => {
    res
    .status(200)
    .json({access_token : token, expirity : tokenModel.getExpirity()})
  })
  .catch(() => {
    res
    .status(401)
    .json({ code    : 0,
            type    : "authorization",
            message : "unauthorize user"})
  }) 
})


module.exports = (model) => {
  tokenModel = model 
  return router
}