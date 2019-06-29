const {
  startSyncWithMedicalSequelize,
  startSyncWithIdentificationSequelize
} = require('./database')
const { startConnectToWallet } = require('./blockchain/eosio-client')
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

/* Routes */
app.use(routes)
/* Routes */

/* Identification Database Syncronization */
startSyncWithIdentificationSequelize()
  .then(() => {
    /* Medical Database Syncronization */
    startSyncWithMedicalSequelize()
      .then(() => {
        /* Connect to Scatter */
        startConnectToWallet()
          .then(() => {
            /* Start listen for HTTP requests */
            app.listen(port, () => {
              console.log('Server started on port ' + port + '...')
            })
          })
      })
      .catch(e => {
        console.error(e)
      })
  })
  .catch(e => {
    console.error(e);
  })