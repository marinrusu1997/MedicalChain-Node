const {
   isBodyValid,
   tryLoadDoctorFullNamesFromDB,
   sendDoctorAccountsMappedToFullNames
} = require('../handlers/doctors_full_names')
const {
   isPatientBodyValid,
   sendPatientFullName
} = require('../handlers/patient_full_name')
const {
   sendPatientsAccountsBasedOnFullName
} = require('../handlers/patient_acc_from_full_name')

module.exports = {
   getDoctorsFullNames: async function (req, res) {
      try {
         if (!!!isBodyValid(req.body, res))
            return
         sendDoctorAccountsMappedToFullNames(await tryLoadDoctorFullNamesFromDB(req.body.accounts), res)
      } catch (e) {
         console.error(e)
         res.status(500).send({
            message: 'Server Error'
         })
      }
   },
   getPatientFullName: async function (req, res) {
      try {
         if (!!!isPatientBodyValid(req.body, res))
            return
         sendPatientFullName(req.body.account, res)
      } catch (e) {
         console.error(e)
         res.status(500).send({
            message: 'Server Error'
         })
      }
   },
   getPatientsAccountsFromFullName: async function (req, res) {
      try {
         sendPatientsAccountsBasedOnFullName(req, res)
      } catch (e) {
         console.error(e)
         res.status(500).send({
            message: 'Server Error'
         })
      }
   }
}