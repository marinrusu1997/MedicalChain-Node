const Sequelize = require('sequelize')

class PatientModel extends Sequelize.Model {
   static init(sequelize, DataTypes) {
      return super.init(
         {
            ssn: {
               type: DataTypes.STRING,
               allowNull: false,
               unique: true,
               primaryKey: true,
               validate: {
                  notEmpty: true,
                  isNumeric: true,
                  len: [13, 13]
               }
            },
            account: {
               type: DataTypes.STRING,
               allowNull: false,
               unique: true,
               validate: {
                  notEmpty: true,
                  isAlphanumeric: true,
                  len: [12, 12]
               }
            },
            surname: {
               type: DataTypes.STRING,
               allowNull: false,
               validate: {
                  isAlpha: true,
                  notEmpty: true
               }
            },
            name: {
               type: DataTypes.STRING,
               allowNull: false,
               validate: {
                  isAlpha: true,
                  notEmpty: true
               }
            },
            birthday: {
               type: DataTypes.DATEONLY,
               allowNull: false,
               validate: {
                  isDate: true
               }
            }
         },
         {
            modelName: 'patient',
            timestamps: false,
            sequelize
         }
      )
   }

   static async tryGetPatientBySSN(ssn) {
      try {
         return await this.findByPk(ssn)
      } catch (e) {
         console.error(e)
         return null
      }
   }

   static async tryGetPatientByAccount(account) {
      try {
         return await this.findOne({
            where: { account: account }
         })
      } catch (e) {
         console.error(e)
         return null
      }
   }

   static async tryGetPatientByFullName(full_name) {
      try {
         return await this.findOne({
            where: {
               surname: full_name.surname,
               name: full_name.name
            }
         })
      } catch (e) {
         console.error(e)
         return null
      }
   }

   static async tryCreate(patient) {
      try {
         return await this.create(patient)
      } catch (e) {
         console.error(e)
         return null
      }
   }

   static async tryRemove(ssn) {
      try {
         return await this.destroy({
            where: {
               ssn: ssn
            }
         })
      } catch (e) {
         console.error(e)
         return 0
      }
   }

   static async tryUpdateAccountField(account, ssn) {
      try {
         return await this.update(
            {
               account: account
            },
            {
               where: { ssn: ssn }
            }
         )
      } catch (e) {
         console.error(e)
         return [0]
      }
   }
}

module.exports = PatientModel