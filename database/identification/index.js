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
    } 
  }
)

const CitizenModel = require('./models/citizen-model')
const DoctorModel = require('./models/doctor-model')

const models = {
  Citizen: CitizenModel.init(sequelize, Sequelize),
  Doctor: DoctorModel.init(sequelize, Sequelize)
}
 
const identification_db = {
  ...models,
  sequelize
}


module.exports.identification_db = identification_db
