const {Alert} = require('../model/alerts')
const ObjectId = require('mongoose').Types.ObjectId

//d'aprsè le swagger
const CATEGORIES = ['weather', 'sea', 'transport']
const STATUS = ['warning', 'threat', 'danger', 'risk']

const verifyAlertModel = (model) => {
  if (!model.type || !model.label || !model.status || !model.from || !model.to) {
    return false
  }

  if(CATEGORIES.indexOf(model.type) == -1 || STATUS.indexOf(model.status) == -1) {
    return false
  }
  return true
}

const isValidId = (id) => {
  return ObjectId.isValid(id)
}

const createAlert = (body) => {
  return new Promise(async (resolve, reject) => {
    const { type, label, status, from, to} = body
    try {
      let alert = new Alert({
        type: type,
        label: label,
        status: status,
        from: Date.parse(from),
        to: Date.parse(to)
      })

      await alert.save()
      resolve(alert)
    } catch(err) {
      reject()
    }
  })
}

const findAlerts = (status) => {
  return Alert.find({status: { "$in": status }})
}

const findById = (id) => {
  return new Promise(async (resolve, reject) => {
    let alert = await Alert.findById(id)
    if (alert === null) {
      reject()
    } else {
      resolve(alert)
    }
  })
}

const updateAlert = (id, body) => {
  return new Promise(async (resolve, reject) => {
    let alert = await Alert.findOneAndUpdate({_id: id}, {$set: body}, {new: true}) 
    if (alert === null) {
      reject()
    } else {
      resolve(alert)
    }
  }) 
}

const deleteAlert = (id) => {
  return new Promise( async (resolve, reject) => {
    let alert = await Alert.findOneAndDelete({_id: id}) 
    if (alert === null) {
      reject()
    } else {
      resolve(alert)
    }
  }) 
}

exports.verifyAlertModel = verifyAlertModel
exports.isValidId = isValidId

exports.createAlert = createAlert
exports.findAlerts = findAlerts
exports.findById = findById
exports.updateAlert = updateAlert
exports.deleteAlert = deleteAlert