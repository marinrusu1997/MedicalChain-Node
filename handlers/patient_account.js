const {
  createPatientAccount
} = require("../blockchain/eosio-client")
const {
  tryCreateAccount
} = require('./base_account')

const tryCreatePatientAccount = async (req, resp) => {
  return tryCreateAccount(createPatientAccount, req, resp)
}

module.exports.tryCreatePatientAccount = tryCreatePatientAccount
