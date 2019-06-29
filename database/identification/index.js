const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  'identification',
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
    },
    define: {
      timestamps: false
    },
    logging: false
  }
)

const CitizenModel = require('./models/citizen-model')
const DoctorModel = require('./models/doctor-model')
const SpecialtyModel = require('./models/specialty-model')

const models = {
  Citizen: CitizenModel.init(sequelize, Sequelize),
  Doctor: DoctorModel.init(sequelize, Sequelize),
  Specialty: SpecialtyModel.init(sequelize, Sequelize)
}

//SpecialtyModel.hasMany(DoctorModel) // Will ad specialtyId to Doctor model
DoctorModel.belongsTo(SpecialtyModel) // Will also add specialtyId to Doctor model

const identification_db = {
  ...models,
  sequelize
}

const startIdentificationSync = () => {
  return identification_db.sequelize
    .sync()
    .then(() => {
      return identification_db.Specialty.prepopulate()
    })
}

module.exports.identification_db = identification_db
module.exports.startIdentificationSync = startIdentificationSync
