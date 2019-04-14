const {
   isBodyFormatValid
} = require('../handlers/base_account')
const {
   validatePatientIdentificationData,
   isPatientAlreadyRegistered,
   tryAddNewPatientToMedicalDB,
   tryCreatePatientAccount,
   tryRollbackPatientAddingToDB
} = require('../handlers/patient_account')
const {
   isDoctorAlreadyRegistered,
   validateDoctorIdentificationData,
   tryAddNewDoctorToMedicalDB,
   tryRollbackDoctorAddingToDB,
   tryCreateDoctorAccount
} = require('../handlers/doctor_account')

module.exports = {
   createPatientAccount: async function (req, res) {
      try {
         if (!!!isBodyFormatValid(req, res))
            return
         if (await isPatientAlreadyRegistered(req.body.userInfo.ssn, res))
            return
         if (!!! await validatePatientIdentificationData(req.body.userInfo, res))
            return
         if (!!! await tryAddNewPatientToMedicalDB(req.body.userInfo, req.body.accountInfo.name, res))
            return
         if (!!! await tryCreatePatientAccount(req, res)) {
            if (!!! await tryRollbackPatientAddingToDB(req.body.userInfo.ssn)) {
               console.error('Failed to remove patient ', req.body)
            }
            return
         }
      } catch (e) {
         console.error(e)
         res.status(500).send({
            message: 'Server error'
         })
      }
   },
   createDoctorAccount: async function (req, res) {
      try {
         if (!!!isBodyFormatValid(req, res))
            return
         if (await isDoctorAlreadyRegistered(req.body.userInfo.unique_identification_code, res))
            return
         if (!!! await validateDoctorIdentificationData(req.body.userInfo, res))
            return
         if (!!! await tryAddNewDoctorToMedicalDB(req.body.userInfo, req.body.accountInfo.name, res))
            return
         if (!!! await tryCreateDoctorAccount(req, res)) {
            if (!!! await tryRollbackDoctorAddingToDB(req.body.userInfo.unique_identification_code)) {
               console.error('Failed to remove doctor ', req.body)
            }
         }
      } catch (e) {
         console.error(e)
         res.status(500).send({
            message: 'Server error'
         })
      }
   }
}