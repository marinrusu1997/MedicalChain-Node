const express = require('express')
const registrCtrl = require('./controllers/registration-controller')
const identityCtrl = require('./controllers/identity-controller')

const router = express.Router()

router.route('/patient/register').post(registrCtrl.createPatientAccount)
router.route('/doctor/register').post(registrCtrl.createDoctorAccount)

router.route('/patient/full-name').post(identityCtrl.getPatientFullName)
router.route('/patient/acc-from-full-name').post(identityCtrl.getPatientsAccountsFromFullName)
router.route('/doctor/full-names').post(identityCtrl.getDoctorsFullNames)
router.route('/doctor/info-from-full-name').post(identityCtrl.getDoctorsInfoFromFullName)


module.exports = router