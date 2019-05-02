const {
  createPatientAccount
} = require("../blockchain/eosio-client")
const {
  tryCreateAccount
} = require('./base_account')
const {
  identification_db
} = require('../database/identification/index')
const {
  medical_db
} = require('../database/index')

const _validatePatientFields = (_expected, actual) => {
  const error_msg = {
    validated: false,
    message: ''
  }

  if (!!!_expected)
    return {
      ...error_msg,
      message: 'Invalid SSN'
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
  if (expected.gender !== actual.gender)
    return {
      ...error_msg,
      message: 'Invalid Gender'
    }
  if (expected.idCardNumber !== actual.cardNumber)
    return {
      ...error_msg,
      message: 'Invalid ID Card Number'
    }
  if (Date.parse(expected.birthday) !== Date.parse(actual.birthday))
    return {
      ...error_msg,
      message: 'Invalid Birthday'
    }

  return {
    validated: true
  }
}

const validatePatientIdentificationData = async (data, res) => {
  const result = _validatePatientFields(await identification_db.Citizen.tryGetCitizenBySSN(data.ssn), data)
  if (!!!result.validated) {
    res.status(400).send({
      message: result.message
    })
    return false
  }
  return true
}

const isPatientAlreadyRegistered = async (ssn, res) => {
  const patient = await medical_db.Patient.tryGetPatientBySSN(ssn)
  if (patient) {
    res.status(400).send({
      message: 'You are registered already'
    })
    return true
  }
  return false
}

const tryAddNewPatientToMedicalDB = async (patient, account, res) => {
  const new_patient = await medical_db.Patient.tryCreate({
    ssn: patient.ssn,
    account: account,
    surname: patient.surname.toUpperCase(),
    name: patient.name.toUpperCase(),
    birthday: patient.birthday
  })
  if (!!!new_patient) {
    res.status(500).send({
      message: 'Server Error'
    })
    return false
  }
  return true
}

const tryRollbackPatientAddingToDB = async ssn => {
  if (await medical_db.Patient.tryRemove(ssn) !== 1) {
    return false
  }
  return true
}

const tryCreatePatientAccount = async (req, resp) => {
  return tryCreateAccount(createPatientAccount, req, resp)
}

const trySetPatientAccount = async (account, ssn, res) => {
  if (await medical_db.Patient.tryUpdateAccountField(account, ssn)[0] !== 1) {
    res.status(500).send({
      message: 'Server Error'
    })
    return false
  }
  return true
}

module.exports.trySetPatientAccount = trySetPatientAccount
module.exports.tryRollbackPatientAddingToDB = tryRollbackPatientAddingToDB
module.exports.tryAddNewPatientToMedicalDB = tryAddNewPatientToMedicalDB
module.exports.tryCreatePatientAccount = tryCreatePatientAccount
module.exports.isPatientAlreadyRegistered = isPatientAlreadyRegistered
module.exports.validatePatientIdentificationData = validatePatientIdentificationData
