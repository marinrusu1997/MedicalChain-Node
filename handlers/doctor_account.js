const {
  createDoctorAccount
} = require('../blockchain/eosio-client')
const {
  tryCreateAccount
} = require('./base_account')

const tryCreateDoctorAccount = async (req, resp) => {
  return tryCreateAccount(createDoctorAccount, req, resp)
}

module.exports.tryCreateDoctorAccount = tryCreateDoctorAccount;
