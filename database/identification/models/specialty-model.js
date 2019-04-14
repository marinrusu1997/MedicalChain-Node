const Sequelize = require('sequelize')
const { getSpecialtiesTableFromBchain } = require('../../../blockchain/eosio-client')

class SpecialtyModel extends Sequelize.Model {
   static init(sequelize, DataTypes) {
      return super.init(
         {
            id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               unique: true,
               primaryKey: true
            },
            name: {
               type: DataTypes.STRING,
               allowNull: false,
               unique: true,
               validate: {
                  isAlpha: true,
                  notEmpty: true
               }
            }
         },
         {
            tableName: 'specialities',
            modelName: 'specialty',
            timestamps: false,
            sequelize
         }
      )  
   }

   static async prepopulate() {
      let specialtyModelsInserted = []
      try {
         if (await this.count() === 0) {
            const specialitiesMap = await getSpecialtiesTableFromBchain()
            const specialties = []
            specialitiesMap.forEach((specialty, id) => {
               specialties.push({
                  id: id,
                  name: specialty
               })
            })
            specialtyModelsInserted = await this.bulkCreate(specialties)
         }
      } catch (e) {
         console.error(e)
      }
      return Promise.resolve(specialtyModelsInserted)
   }
}

module.exports = SpecialtyModel