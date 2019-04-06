const {
  MongoClient
} = require("mongodb")
const {
  BaseActionWatcher
} = require('demux')
const {
  MongoActionReader
} = require('demux-eos')
const {
  MassiveActionHandler
} = require("demux-postgres")
const massive = require("massive")
const {
  medicalContractABI
} = require('./eosio-client')

/* Configuration */
const massiveDbConfig = {
  host: "127.0.0.1",
  port: 5432,
  database: "marin",
  user: "marin",
  password: "2307mgd73fn"
}
const mongoActionReaderConfig = {
  startAtBlock: -1,
  onlyIrreversible: false,
  mongoEndpoint: "mongodb://127.0.0.1",
  dbName: "EOS"
}
const mongoClientConfig = {
  url: "mongodb://localhost:27017/EOS",
  options: {
    useNewUrlParser: true
  }
}
/* Configuration */

/* Global Variables */
let client = null;
let massive_db = null;
/* Global Variables */

async function migrateDatabase(db, payload) {
  console.log(payload.sequenceName)
  await db.migrate(payload.sequenceName) // Blockchain will determine when and what migrations will run
}

async function logPrivateKey(db, payload, blockInfo, context) {
  const result = await client.db("EOS").collection("action_traces").aggregate([{
    $match: {
      trx_id: payload.transactionId
    }
  }]).toArray();
  console.log(payload);
  console.log(result[0].console);
}

async function logAddpatient(db, payload, blockInfo, context) {
  console.log(payload);
}

const updaters = [{
  actionType: medicalContractABI.contract + "::" + medicalContractABI.actions.upsertpat,
  apply: logAddpatient
}]

function processRemovePatient(payload, blockInfo, context) {
  console.log(payload);
}

const effects = [{
  actionType: medicalContractABI.contract + "::" + medicalContractABI.actions.rmpatient,
  run: processRemovePatient
}]

const handlerVersion = {
  versionName: "v1",
  updaters,
  effects
}

const handlerVersions = [
  handlerVersion
]

/* Connectors To Databases */
const startBlockchainMonitoring = async () => {
  try {
    client = await MongoClient.connect(mongoClientConfig.url, mongoClientConfig.options)
    massive_db = await massive(massiveDbConfig)
    const actionReader = new MongoActionReader(mongoActionReaderConfig)
    const actionHandler = new MassiveActionHandler(handlerVersions, massive_db)
    const actionWatcher = new BaseActionWatcher(actionReader, actionHandler, 500)
    await actionReader.initialize()
    actionWatcher.watch()
  } catch (e) {
    console.error(e);
  }
}
/* Connectors To Databases */

/* Exports */
module.exports.startBlockchainMonitoring = startBlockchainMonitoring
/* Exports */
