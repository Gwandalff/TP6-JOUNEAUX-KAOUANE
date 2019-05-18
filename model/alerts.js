const mongoose = require('mongoose')

const Alert = mongoose.model('Alert', {
  label: String,
  type: String,
  status: String,
  from: Date,
  to: Date,
})

exports.Alert = Alert