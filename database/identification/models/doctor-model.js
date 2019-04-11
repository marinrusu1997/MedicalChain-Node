const Sequelize = require('sequelize') 

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
            ssn: {
               type: DataTypes.STRING,
               allowNull: false,
               unique: true,
               validate: {
                  notEmpty: true,
                  isNumeric: true,
                  len: [13, 13]
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
            diplomaSeries: {
               type: DataTypes.STRING,
               field: 'diploma_series',
               allowNull: false,
               unique: true,
               validate: {
                  isAlphanumeric: true,
                  notEmpty: true
               }
            },
            specialistPhysicianCertificateSeries: {
               type: DataTypes.STRING,
               field: 'specialist_physician_certif_series',
               allowNull: false,
               unique: true,
               validate: {
                  isAlphanumeric: true,
                  notEmpty: true
               }
            }
         },
         {
            modelName: 'doctor',
            timestamps: false,
            sequelize
         }
      );
   }
}

module.exports = DoctorModel