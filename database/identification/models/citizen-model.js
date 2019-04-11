const Sequelize = require('sequelize')

class CitizenModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
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
      gender: {
        type: DataTypes.ENUM('M', 'F'),
        allowNull: false
      },
      idCardNumber: {
        type: DataTypes.STRING,
        field: 'id_card_number',
        allowNull: false,
        unique: true,
        validate: {
          isAlphanumeric: true,
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
    }, {
        modelName: 'citizen',
        timestamps: false,
        sequelize
      }
    );
  }

  static async tryGetCitizenBySSN(ssn) {
    try {
      return await this.findByPk(ssn)
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

module.exports = CitizenModel