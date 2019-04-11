const {
  startBlockchainMonitoring
} = require("./blockchain/demux-watcher")
const {
  isBodyFormatValid,
  validatePatientIdentificationData,
  isAlreadyRegistered,
  tryAddNewPatientToMedicalDB,
  tryCreatePatientAccount,
  tryRollbackPatientAddingToDB,
  trySetPatientAccount
} = require('./handlers/patient_account')
const {
  tryCreateDoctorAccount
} = require('./handlers/doctor_account')
const {
  medical_db,
  startSyncWithMedicalSequelize,
  startSyncWithIdentificationSequelize
} = require('./database')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

/* Configuration */
const port = 7080
const app = express()
app.use(cors())
app.use(bodyParser.json())
/* Configuration */

app.post('/patient/validate-identity', async (req, res) => {
  try {
    if (!!!isBodyFormatValid(req, res))
      return
    if (await isAlreadyRegistered(req.body.userInfo.ssn, res))
      return
    if (!!! await validatePatientIdentificationData(req.body.userInfo, res))
      return
    if (!!! await tryAddNewPatientToMedicalDB(req.body.userInfo, res))
      return
    if (!!! await tryCreatePatientAccount(req, res)) {
      if (!!! await tryRollbackPatientAddingToDB(req.body.userInfo.ssn)) {
        console.error('Failed to remove patient ', req.body)
      }
      return
    }
    if (!!! await trySetPatientAccount(req.body.accountInfo.name,
      req.body.userInfo.ssn, res)) {
      console.error('Failed to update account for patient ', req.body)
    }
  } catch (e) {
    console.error(e)
    res.status(500).send({
      message: 'Server error'
    })
  }
})

app.post('/doctor/validate-identity', async (req, res) => {
  let isAccountCreatedSuccessfully = await tryCreateDoctorAccount(req, res)

  if (!!!isAccountCreatedSuccessfully) {
    // TO DO handle it
  }
})

startSyncWithIdentificationSequelize()
  .then(() => {
    startSyncWithMedicalSequelize()
      .then(() => {
        app.listen(port, () => {
          console.log('Server started on port ' + port + '...')
          startBlockchainMonitoring()
        })
      })
      .catch(e => {
        console.error(e)
      })
  })
  .catch(e => {
    console.error(e);
  })

