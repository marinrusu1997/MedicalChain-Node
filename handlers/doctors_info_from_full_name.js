const {
   medical_db
} = require('../database/index')
const {
   identification_db
} = require('../database/identification')

const isBodyValidForInfoFromFullName = (body, res) => {
   if (!!!body) {
      res.status(400).send({
         message: 'Body params required'
      })
      return false
   }
   if (!!!body.surname) {
      res.status(400).send({
         message: 'Invalid body format. Surname required'
      })
      return false
   }
   /*
   if (!!!body.name) {
      res.status(400).send({
         message: 'Invalid body format. Name required'
      })
      return false
   }
   */
   return true
}

const normalizeFullName = full_name => {
   full_name.surname = full_name.surname.toUpperCase()
   if (full_name.name) {
      full_name.name = full_name.name.toUpperCase()
   }
}

const joinQuerries = (registered_doctors, identified_doctors) => {
   const doctors = []
   registered_doctors.forEach(doctor => {
      doctors.push({
         surname: doctor.surname,
         name: doctor.name,
         account: doctor.account,
         specialty: identified_doctors.find(d => d.uic === doctor.uic).specialty
      })
   })
   return doctors
}

const getDoctorsInfoFromFullName = async full_name => {
   normalizeFullName(full_name)
   let doctors = []
   let registered_doctors = await medical_db.Doctor.tryGetDoctorsMatchingFullName(full_name)
   if (registered_doctors) {
      registered_doctors = registered_doctors.map(doctor => doctor.dataValues)
      const uics = registered_doctors.map(doctor => doctor.uic)
      let identified_doctors = await identification_db.Doctor.tryGetDoctorsInfoMatchingUICs(uics)
      if (identified_doctors) {
         identified_doctors = identified_doctors.map(doctor => ({
            uic: doctor.dataValues.uic,
            specialty: doctor.dataValues.specialty.dataValues.name
         }))
         doctors = joinQuerries(registered_doctors, identified_doctors)
      }
   }
   return doctors
}


module.exports.isBodyValidForInfoFromFullName = isBodyValidForInfoFromFullName
module.exports.getDoctorsInfoFromFullName = getDoctorsInfoFromFullName