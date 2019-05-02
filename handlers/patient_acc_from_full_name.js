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
   if (!!!body.full_name) {
      res.status(400).send({
         message: 'Invalid body format'
      })
      return false
   }
   if (!!!body.full_name.name || !!!body.full_name.surname) {
      res.status(400).send({
         message: 'Invalid body format, name and surname expected'
      })
      return false
   }
   return true
}

const loadPatientsByFullName = async (full_name, res) => {
   const patients = await medical_db.Patient.tryGetPatientsByFullName(full_name)
   if (patients.length === 0) {
      res.status(400).send({
         message: 'No patients with this name and surname'
      })
      return null
   }

   const patientMappingArr = []
   for (const patient of patients) {
      patientMappingArr.push({
         account: patient.account,
         birthday: patient.birthday
      })
   }
   return patientMappingArr
}

const sendPatientsAccountsBasedOnFullName = async (req, res) => {
   if (!!!isPatientBodyValid(req.body, res))
      return
   const patientsAccounts = await loadPatientsByFullName(req.body.full_name, res)
   if (patientsAccounts) {
      res.status(200).send({
         patientsAccounts
      })
   }
}

module.exports.sendPatientsAccountsBasedOnFullName = sendPatientsAccountsBasedOnFullName