const {
  Api,
  JsonRpc,
  RpcError
} = require('eosjs')
const JsSignatureProvider = require('eosjs/dist/eosjs-jssig').default
const fetch = require('node-fetch')
const {
  TextEncoder,
  TextDecoder
} = require('util')

/* Configuration */
const httpEndpoint = 'http://127.0.0.1:8888'

const medicalContractABI = {
  contract: 'medical5',
  actions: {
    upsertpat: 'upsertpat',
    rmpatient: 'rmpatient',
    upsertdoc: 'upsertdoc',
    rmdoctor: 'rmdoctor'
  },
  tables: {
    rights: { name: 'rights', limit: 1 },
    specialities: { name: 'specialities', limit: 1 },
    patients: { name: 'patients', limit: 1 },
    permissions: { name: 'permissions', limit: 10 }
  }
}

const medicalContract = {
  ...medicalContractABI,
  privateKey: '5KieJAkEhGZ146xdaReiNQqrp4rNVnQvp332gSQE2419T5mMc11',
  authorization: {
    actor: 'medical5',
    permission: 'active'
  }
}
/* Configuration */

const signatureProvider = new JsSignatureProvider([medicalContract.privateKey])
const rpc = new JsonRpc(httpEndpoint, {
  fetch
})
const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
});

const createPatientAccount = async accountInfo => {
  return await api.transact({
    actions: [{
      account: 'eosio',
      name: 'newaccount',
      authorization: [medicalContract.authorization],
      data: {
        creator: medicalContract.contract,
        name: accountInfo.name,
        owner: {
          threshold: 1,
          keys: [{
            key: accountInfo.ownerKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        },
        active: {
          threshold: 1,
          keys: [{
            key: accountInfo.activeKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        }
      }
    }, {
      account: medicalContract.contract,
      name: medicalContract.actions.upsertpat,
      authorization: [medicalContract.authorization],
      data: {
        patient: accountInfo.name,
        pubenckey: accountInfo.encryptionKey
      }
    }]
  }, {
      blocksBehind: 3,
      expireSeconds: 30,
    })
}

const createDoctorAccount = async accountInfo => {
  return await api.transact({
    actions: [{
      account: 'eosio',
      name: 'newaccount',
      authorization: [medicalContract.authorization],
      data: {
        creator: medicalContract.contract,
        name: accountInfo.name,
        owner: {
          threshold: 1,
          keys: [{
            key: accountInfo.ownerKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        },
        active: {
          threshold: 1,
          keys: [{
            key: accountInfo.activeKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        }
      }
    }, {
      account: medicalContract.contract,
      name: medicalContract.actions.upsertdoc,
      authorization: [medicalContract.authorization],
      data: {
        doctor: accountInfo.name,
        specialtyid: accountInfo.specialtyid,
        pubenckey: accountInfo.encryptionKey
      }
    }]
  }, {
      blocksBehind: 3,
      expireSeconds: 30,
    })
}

const _table = async (name, scope, limit) => {
  return await rpc.get_table_rows({
    code: medicalContract.contract,
    scope: scope,
    table: name,
    limit: limit || 10
  })
}

const _specilities = async () => {
  const { name, limit } = medicalContract.tables.specialities
  return await _table(name, medicalContract.contract, limit)
}

const getSpecialtiesTableFromBchain = async () => {
  try {
    const specialities = await _specilities()
    const specialitiesMap = new Map()
    specialities.rows[0].mapping.forEach(specialty => {
      specialitiesMap.set(specialty.key, specialty.value)
    })
    return Promise.resolve(specialitiesMap)
  } catch (e) {
    console.error(e)
  }
}

module.exports.medicalContractABI = medicalContractABI
module.exports.createPatientAccount = createPatientAccount
module.exports.createDoctorAccount = createDoctorAccount
module.exports.getSpecialtiesTableFromBchain = getSpecialtiesTableFromBchain
