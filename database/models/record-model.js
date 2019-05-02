const Sequelize = require('sequelize')

class RecordModel extends Sequelize.Model {
   static init(sequelize, DataTypes) {
      return super.init(
         {
            patientAccount: {
               type: DataTypes.STRING,
               field: 'patient_account',
               allowNull: false,
               unique: true,
               validate: {
                  notEmpty: true,
                  isAlphanumeric: true,
                  len: [12, 12]
               }
            },
            doctorAccount: {
               type: DataTypes.STRING,
               field: 'doctor_account',
               comment: 'who added record',
               allowNull: false,
               unique: true,
               validate: {
                  notEmpty: true,
                  isAlphanumeric: true,
                  len: [12, 12]
               }
            }

         },
         {

         }
      )
   }
}