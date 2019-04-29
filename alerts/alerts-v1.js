const express = require('express')
const router = express.Router()

let alert = undefined

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

/*POST that create a new alert (alert object that need to be added) */
router.post('', function (req, res, next) {
  tokenModel.getJWT(req.body)
  .then((token) => {
    res
    .status(200)
    .json({access_token : token,
           expirity     : tokenModel.getExpirity()})
  })
  .catch(() => {
    res
    .status(401)
    .json({ code    : 0,
            type    : "authorization",
            message : "unauthorize user"})
  }) 
})
/* Search alrt by different criteria*/
router.get('/search', function (req, res, next) {
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

/* GET a specific user by id */
router.get('/verifyaccess', function (req, res, next) {
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

/* Find alert by ID */
router.get('/{alertId}', function (req, res, next) {
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

router.put('/{alertId}', function (req, res, next) {
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


/* GET a specific user by id */
router.delete('/{alertId}', function (req, res, next) {
    let token = null
  })


module.exports = (model) => {
  tokenModel = model 
  return router
}