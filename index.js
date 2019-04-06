const {
  startBlockchainMonitoring
} = require("./blockchain/demux-watcher")
const {
  tryCreatePatientAccount
} = require('./handlers/patient_account')
const {
  tryCreateDoctorAccount
} = require('./handlers/doctor_account')
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
  let isAccountCreatedSuccessfully = await tryCreatePatientAccount(req, res)

  if (!!!isAccountCreatedSuccessfully) {
    // TO DO handle it
  }
})

app.post('/doctor/validate-identity', async (req, res) => {
  let isAccountCreatedSuccessfully = await tryCreateDoctorAccount(req, res)

  if (!!!isAccountCreatedSuccessfully) {
    // TO DO handle it
  }
})

app.listen(port, () => {
  console.log('Server started on port ' + port + '...')
  startBlockchainMonitoring()
})
