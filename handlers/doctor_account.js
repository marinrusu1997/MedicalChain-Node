const {
  eosio_client
} = require('../blockchain/eosio-client.js')
const {
  tryCreateAccount
} = require('./base_account')
const {
  identification_db
} = require('../database/identification/index')
const {
  medical_db
} = require('../database/index')

const isDoctorAlreadyRegistered = async (uic, res) => {
  const doctor = await medical_db.Doctor.tryGetDoctorByUIC(uic)
  if (doctor) {
    res.status(400).send({
      message: 'You are registered already'
    })
    return true
  }
  return false
}

const _validateDoctorFields = (_expected, actual) => {
  const error_msg = {
    validated: false,
    message: ''
  }

  if (!!!_expected)
    return {
      ...error_msg,
      message: 'Invalid Unique Identification Code'
    }
  const expected = _expected.dataValues

  if (expected.surname.toUpperCase() !== actual.surname.toUpperCase())
    return {
      ...error_msg,
      message: 'Invalid Surname'
    }
  if (expected.name.toUpperCase() !== actual.name.toUpperCase())
    return {
      ...error_msg,
      message: 'Invalid Name'
    }
  if (expected.ssn !== actual.ssn)
    return {
      ...error_msg,
      message: 'Invalid SSN'
    }
  if (expected.diplomaSeries !== actual.diploma_series)
    return {
      ...error_msg,
      message: 'Invalid Diploma Series'
    }
  if (expected.specialistPhysicianCertificateSeries !== actual.specialist_physician_certificate_series)
    return {
      ...error_msg,
      message: 'Invalid Specialist Physician Certificate Series'
    }

  return {
    validated: true
  }
}

const validateDoctorIdentificationData = async (data, res) => {
  const result = _validateDoctorFields(
    await identification_db.Doctor.tryGetDoctorByUIC(data.unique_identification_code),
    data)
  if (!!!result.validated) {
    res.status(400).send({
      message: result.message
    })
    return false
  }
  return true
}

const tryAddNewDoctorToMedicalDB = async (doctor, account, res) => {
  const new_doctor = await medical_db.Doctor.tryCreate({
    uic: doctor.unique_identification_code,
    account: account,
    surname: doctor.surname.toUpperCase(),
    name: doctor.name.toUpperCase()
  })
  if (!!!new_doctor) {
    res.status(500).send({
      message: 'Server Error'
    })
    return false
  }
  return true
}

const tryRollbackDoctorAddingToDB = async uic => {
  if (await medical_db.Doctor.tryRemove(uic) !== 1) {
    return false
  }
  return true
}

const tryCreateDoctorAccount = async (req, resp) => {
  return tryCreateAccount(async accountInfo => await eosio_client.createDoctorAccount(accountInfo), req, resp)
}

module.exports.isDoctorAlreadyRegistered = isDoctorAlreadyRegistered;
module.exports.validateDoctorIdentificationData = validateDoctorIdentificationData
module.exports.tryAddNewDoctorToMedicalDB = tryAddNewDoctorToMedicalDB
module.exports.tryRollbackDoctorAddingToDB = tryRollbackDoctorAddingToDB
module.exports.tryCreateDoctorAccount = tryCreateDoctorAccount;
