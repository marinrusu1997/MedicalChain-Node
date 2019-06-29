const {
  Api,
  JsonRpc
} = require('eosjs')
const JsSignatureProvider = require('eosjs/dist/eosjs-jssig').default
const fetch = require('node-fetch')
const {
  TextEncoder,
  TextDecoder
} = require('util')
const ScatterJS = require('scatterjs-core').default
const ScatterEOS = require('scatterjs-plugin-eosjs2').default

/* Configuration */
ScatterJS.plugins(new ScatterEOS())

const medicalContract = {
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

const requiredFields = {
  personal: [],
  location: [],
  accounts: []
}
/* Configuration */

/* Implementation */
class EOSIOWalletClient {

  constructor() {
    this.app_name = 'identification_service'

    this.network = ScatterJS.Network.fromJson({
      blockchain: 'eos',
      chainId: '',
      host: '127.0.0.1',
      port: 8888,
      protocol: 'http'
    })

    requiredFields.accounts = [this.network]

    this.rpc = new JsonRpc(this.network.fullhost(), {
      fetch
    })

    this.identity = null
    this.eos = null
    this.contractAccount = null
  }

  async connect() {
    const blockchain_info = await this.rpc.get_info()
    this.network.chainId = blockchain_info.chain_id
    if (await ScatterJS.connect(this.app_name, this.network)) {
      this.identity = await ScatterJS.scatter.getIdentity(requiredFields)
      this.contractAccount = this.identity.accounts.find(
        x => x.blockchain === "eos"
      )
      console.info('Logged with ', this.contractAccount.name)
      /*
      if (!!!this.contractAccount || this.contractAccount.name !== medicalContractABI.contract) {
        throw new Error('Selected account is not medical')
      }
      */
      this.eos = ScatterJS.eos(this.network, Api, { expireInSeconds: 60, rpc: this.rpc, beta3: true })
    } else {
      throw new Error('Failed to connect to Scatter Wallet')
    }
  }

  disconnect() {
    if (ScatterJS.scatter) {
      ScatterJS.scatter.forgetIdentity()
      this.identity = null
    } else {
      console.error('Not connected to wallet')
    }
  }

  get_contract_authorization() {
    return {
      actor: this.contractAccount.name,
      permission: this.contractAccount.authority
    }
  }

  async _create_account(accountInfo, actions) {
    return await this.eos.transact({
      actions: [
        {
          account: 'eosio',
          name: 'newaccount',
          authorization: [this.get_contract_authorization()],
          data: {
            creator: this.contractAccount.name,
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
        },

        ...actions
      ]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
  }

  async createPatientAccount(accountInfo) {
    return this._create_account(accountInfo, [
      {
        account: this.contractAccount.name,
        name: medicalContract.actions.upsertpat,
        authorization: [this.get_contract_authorization()],
        data: {
          patient: accountInfo.name,
          pubenckey: accountInfo.encryptionKey
        }
      }
    ])
  }

  async createDoctorAccount(accountInfo) {
    return this._create_account(accountInfo, [
      {
        account: this.contractAccount.name,
        name: medicalContract.actions.upsertdoc,
        authorization: [this.get_contract_authorization()],
        data: {
          doctor: accountInfo.name,
          specialtyid: accountInfo.specialtyid,
          pubenckey: accountInfo.encryptionKey
        }
      }
    ])
  }

  async _table(name, scope, limit) {
    return await this.rpc.get_table_rows({
      code: this.contractAccount.name,
      scope: scope,
      table: name,
      limit: limit || 10
    })
  }

  async _specilities() {
    const { name, limit } = medicalContract.tables.specialities
    return await _table(name, this.contractAccount.name, limit)
  }

  async getSpecialtiesTableFromBchain() {
    try {
      const specialities = await this._specilities()
      const specialitiesMap = new Map()
      specialities.rows[0].mapping.forEach(specialty => {
        specialitiesMap.set(specialty.key, specialty.value)
      })
      return specialitiesMap
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

const eosio_client = new EOSIOWalletClient()

module.exports.eosio_client = eosio_client
module.exports.startConnectToWallet = async () => {
  return eosio_client.connect()
}

/* 

const httpEndpoint = 'http://127.0.0.1:8888'

const medicalContractABI = {
  contract: 'medical',
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
    actor: 'medical',
    permission: 'active'
  }
}

*/

/*

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

*/
