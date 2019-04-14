const {
   medical_db
} = require('../database/index')

const isBodyValid = (body, res) => {
   if (!!!body) {
      res.status(400).send({
         message: 'Body params required'
      })
      return false
   }
   if (!!!body.accounts) {
      res.status(400).send({
         message: 'Invalid body format'
      })
      return false
   }
   if (body.accounts.constructor !== Array) {
      res.status(400).send({
         message: 'Invalid body format, array expected'
      })
      return false
   }
   return true
}

const tryLoadDoctorFullNamesFromDB = async accounts => {
   try {
      const accountMap = new Map()
      for (const account of accounts) {
         const doctor = await medical_db.Doctor.tryGetDoctorByAccount(account)
         if (doctor) {
            accountMap.set(account, {
               name: doctor.name,
               surname: doctor.surname
            })
         }
      }
      return Promise.resolve(accountMap)
   } catch (e) {
      console.error(e)
      return null
   }
}

const sendDoctorAccountsMappedToFullNames = (map, res) => {
   if (!!!map) {
      res.status(500).send({
         message: 'Server Error'
      })
      return
   }
   const accArr = []
   map.forEach((full_name, account) => {
      accArr.push({
         account: account,
         full_name: full_name
      })
   })
   res.status(200).send({
      accountsMap: accArr
   })
}

module.exports.isBodyValid = isBodyValid
module.exports.tryLoadDoctorFullNamesFromDB = tryLoadDoctorFullNamesFromDB
module.exports.sendDoctorAccountsMappedToFullNames = sendDoctorAccountsMappedToFullNames