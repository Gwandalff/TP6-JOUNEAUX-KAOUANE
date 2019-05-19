const express = require('express')
const router = express.Router()

let alertsModel = undefined

router.use((req, res, next) => {

  if (!alertsModel) {
    res
      .status(500)
      .json({message: 'model not initialised'})
  }
  next()
})

router.get('/search', async (req, res, next) =>{
    let {status} = req.query
    let alerts = await alertsModel.findAlerts(status)
    res.status(200).send(alerts)
})

router.get('/:alertId', async (req, res, next) =>{
  let {id} = req.params

  if (alertsModel.isValidId(alertId)) {
    try {
        let alert = await alertsModel.findById(alertId)
        if (alert) {
        res.status(200).send(alert)
      } else {
        res
          .status(404)
          .json({message: `User not found with id ${alertId}`})
      }
    } catch (err) {
  
      res
        .status(400)
        .send()
    }

  } else {
    res
      .status(400)
      .send()
  }
})

// ajout d'un nouvel utilisateur
router.post('/', async (req, res, next) => {
    if(!alertsModel.verifyAlertModel(req.body)) {
        res.status(405).send("Invalid input")
        return
      }
      try {
        let alert = await alertsModel.createAlert(req.body)
        res.json(alert)
      } catch (err) {
        res.status(405).send()
      }
})


router.put('/:alertId', async (req, res, next) => {
    let {id} = req.params

    if(!alertsModel.isValidId(alertId)) {
      res.status(400).send()
      return
    }

    if(!alertsModel.verifyAlertModel(req.body)) {
      res.status(405).send("Invalid input")
      return
    }

    try {
      let alert = await alertsModel.updateAlert(alertId, req.body)
      res.status(200).send(alert)
    } catch(err) {
      res.status(500).send()
    }
})

router.delete('/:alertId', async (req, res, next)=> {
    let {id} = req.params

    if (!alertsModel.isValidId(id)) {
      res.status(400).send()
      return
    }
    try 
    {
      await alertsModel.deleteAlert(id, req.body)
      res.status(200).send()
    } catch(err) {
      res.status(404).send()
    }
  })


module.exports = (alertsModel) => {
  alertsModel = alertsModel
  return router
}