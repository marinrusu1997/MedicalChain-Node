const {
   medical_db
} = require('../database/index')

const isPatientBodyValid = (body, res) => {
   if (!!!body) {
      res.status(400).send({
         message: 'Body params required'
      })
      return false
   }
   if (!!!body.account) {
      res.status(400).send({
         message: 'Invalid body format'
      })
      return false
   }
   if (body.account.constructor === Array) {
      res.status(400).send({
         message: 'Invalid body format, single account expected'
      })
      return false
   }
   return true
}

const sendPatientFullName = async (account, res) => {
   const patient = await medical_db.Patient.tryGetPatientByAccount(account)
   if (!!!patient) {
      res.status(400).send({
         message: 'Invalid patient account'
      })
   } else {
      res.status(200).send({
         full_name: {
            name: patient.name,
            surname: patient.surname
         }
      })
   }
}

module.exports.isPatientBodyValid = isPatientBodyValid
module.exports.sendPatientFullName = sendPatientFullName
