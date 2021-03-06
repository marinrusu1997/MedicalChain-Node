const Sequelize = require('sequelize')
const { startIdentificationSync } = require('./identification')

const sequelize = new Sequelize(
  'medical',
  'marin',
  '2307mgd73fn', {
    host: "127.0.0.1",
    port: 5432,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
)

const PatientModel = require('./models/patient-model')
const DoctorModel = require('./models/doctor-model')

const models = {
  Patient: PatientModel.init(sequelize, Sequelize),
  Doctor: DoctorModel.init(sequelize, Sequelize)
}

const medical_db = {
  ...models,
  sequelize
}

const startSyncWithIdentificationSequelize = () => {
  return startIdentificationSync()
}

const startSyncWithMedicalSequelize = () => {
  return sequelize.sync()
}

module.exports.startSyncWithMedicalSequelize = startSyncWithMedicalSequelize
module.exports.startSyncWithIdentificationSequelize = startSyncWithIdentificationSequelize
module.exports.medical_db = medical_db
