const {
  startBlockchainMonitoring
} = require("./blockchain/demux-watcher")
const {
  medical_db,
  startSyncWithMedicalSequelize,
  startSyncWithIdentificationSequelize
} = require('./database')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')

/* Configuration */
const port = 7080
const app = express()
app.use(cors())
app.use(bodyParser.json())
/* Configuration */

app.use(routes)

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

