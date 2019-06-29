const Sequelize = require('sequelize')
const Op = Sequelize.Op

class DoctorModel extends Sequelize.Model {
   static init(sequelize, DataTypes) {
      return super.init(
         {
            uic: {
               type: DataTypes.STRING,
               allowNull: false,
               unique: true,
               primaryKey: true,
               validate: {
                  notEmpty: true,
                  isNumeric: true,
                  len: [10, 10]
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
            }
         },
         {
            modelName: 'doctor',
            timestamps: false,
            sequelize
         }
      )
   }

   static async tryGetDoctorByUIC(uic) {
      try {
         return await this.findByPk(uic)
      } catch (e) {
         console.error(e)
         return null
      }
   }

   static async tryGetDoctorByAccount(account) {
      try {
         return await this.findOne({
            where: { account: account }
         })
      } catch (e) {
         console.error(e)
         return null
      }
   }

   static async tryGetDoctorByFullName(full_name) {
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

   static async tryGetDoctorsMatchingFullName(full_name) {
      try {
         const where = {
            surname: {
               [Op.like]: `${full_name.surname}%`
            }
         }
         if (full_name.name) {
            where.name = {
               [Op.like]: `${full_name.name}%`
            }
         }
         return this.findAll({
            where: where
         })
      } catch (e) {
         console.error(e)
         return null
      }
   }

   static async tryCreate(doctor) {
      try {
         return await this.create(doctor)
      } catch (e) {
         console.error(e)
         return null
      }
   }

   static async tryRemove(uic) {
      try {
         return await this.destroy({
            where: {
               uic: uic
            }
         })
      } catch (e) {
         console.error(e)
         return 0
      }
   }

   static async tryUpdateAccountField(account, uic) {
      try {
         return await this.update(
            {
               account: account
            },
            {
               where: { uic: uic }
            }
         )
      } catch (e) {
         console.error(e)
         return [0]
      }
   }
}

module.exports = DoctorModel