const express = require('express')
const router = express.Router()

let usersModel = undefined

router.use((req, res, next) => {

  if (!usersModel) {
    res
      .status(500)
      .json({message: 'model not initialised'})
  }
  next()
})

router.get('/:id', function (req, res, next) {
  const id = req.params.id


  if (id) {
    try {
      const userFound = usersModel.get(id)
      if (userFound) {
        res.json(userFound)
      } else {
        res
          .status(404)
          .json({message: `User not found with id ${id}`})
      }
    } catch (exc) {
  
      res
        .status(400)
        .json({message: exc.message})
    }

  } else {
    res
      .status(400)
      .json({message: 'Wrong parameter'})
  }
})


router.post('/', function (req, res, next) {
  const newUser = req.body


  if (newUser) {
    try {
      const user = usersModel.add(newUser)
      req
        .res
        .status(201)
        .send(user)
    } catch (exc) {
      res
        .status(400)
        .json({message: exc.message})
    }
  } else {
    res
      .status(400)
      .json({message: 'Wrong parameters'})
  }
})


router.patch('/:id', function (req, res, next) {
  const id = req.params.id
  const newUserProperties = req.body


  if (id && newUserProperties) {
    try {
      const updated = usersModel.update(id, newUserProperties)
      res
        .status(200)
        .json(updated)

    } catch (exc) {

      if (exc.message === 'user.not.found') {
        res
          .status(404)
          .json({message: `User not found with id ${id}`})
      } else {
        res
          .status(400)
          .json({message: 'Invalid user data'})
      }
    }
  } else {
    res
      .status(400)
      .json({message: 'Wrong parameters'})
  }
})

router.delete('/:id', function (req, res, next) {
  const id = req.params.id

  if (id) {
    try {
      usersModel.remove(id)
      req
        .res
        .status(200)
        .end()
    } catch (exc) {

      if (exc.message === 'user.not.found') {
        res
          .status(404)
          .json({message: `User not found with id ${id}`})
      } else {
        res
          .status(400)
          .json({message: exc.message})
      }
    }
  } else {
    res
      .status(400)
      .json({message: 'Wrong parameter'})
  }
router.get('/', function (req, res, next) {
  res.json(usersModel.getAll())
})


module.exports = (model) => {
  usersModel = model
  return router
}
