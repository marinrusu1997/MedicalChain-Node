/* 
Eos = require("eosjs")

const youvotePrivateKey = "5JPacf1D75Seq2C2eDurmxJBZugMj5Rj66H2aUF6kKd5cwkvWSB"; // youvote
const multisigPrivateKey = "5K5d5HEwdZsgwh3kPJRP4Dk7zcDmqanmFjL9WatakQFYumqV2Vi"; //multisig
const multisigPublicKey = "EOS5Y3ChGkERRmNsLKVhvKFGdnC7K3NyASJncBKcNz5nQFK9Wza9Y";
// Default configuration
config = {
   chainId: null, // 32 byte (64 char) hex string
   keyProvider: null, // WIF string or array of keys..
   httpEndpoint: 'http://127.0.0.1:8888',
   expireInSeconds: 60,
   broadcast: true,
   verbose: false, // API activity
   sign: true
}

const eos = Eos(config)

async function getNewPermissions(accountName) {
   const account = await eos.getAccount(accountName)
   const perms = JSON.parse(JSON.stringify(account.permissions))
   return perms
}

module.exports.printTransactionResult = async function(id) {
   try {
      return await eos.getTransaction(id);
   } catch (e) {
      console.log('\nCaught exception: ' + e)
      if (e instanceof RpcError)
         console.log(JSON.stringify(e.json, null, 2))
   }
}

module.exports.printAccoutOfPubKey = async function () {
   try {
      console.log('Account for ', multisigPublicKey, ' is ', await eos.getKeyAccounts(multisigPublicKey))
   } catch (e) {
      console.log('\nCaught exception: ' + e)
      if (e instanceof RpcError)
         console.log(JSON.stringify(e.json, null, 2))
   }
}

module.exports.printActions = async function () {
   try {
      console.warn("Actions for multisig:\n", await eos.getActions('multisig'))
   } catch (e) {
      console.log('\nCaught exception: ' + e)
      if (e instanceof RpcError)
         console.log(JSON.stringify(e.json, null, 2))
   }
}

module.exports.printPollsTable = async function () {
   try {
      console.log(await eos.getTableRows({
         json: true,
         code: 'youvote',
         scope: 'youvote',
         table: 'polls',
         table_key: 'id',
         key_type: 'i64',
         index_position: 1
      }))
   } catch (e) {
      console.log('\nCaught exception: ' + e)
      if (e instanceof RpcError)
         console.log(JSON.stringify(e.json, null, 2))
   }
}

module.exports.printPermissions = async function () {
   try {
      const accountName = 'multisig'
      const perms = await getNewPermissions(accountName)
      console.log(JSON.stringify(perms, null, 2))
   } catch (e) {
      console.log('\nCaught exception: ' + e)
      if (e instanceof RpcError)
         console.log(JSON.stringify(e.json, null, 2))
   }
}

module.exports.updateAuthentication = async function () {
   try {
      const accountName = 'multisig'
      const perms = await getNewPermissions(accountName)
      const updateActive = perms.find(p => p.perm_name === 'active')
      updateActive.required_auth = {
         threshold: 3,
         keys: [{
            key: 'EOS5Y3ChGkERRmNsLKVhvKFGdnC7K3NyASJncBKcNz5nQFK9Wza9Y',
            weight: 1
         }],
         accounts: [{
            permission: {
               actor: 'youvote',
               permission: 'active'
            },
            weight: 1
         }],
         waits: [{
            wait_sec: 10,
            weight: 1
         }]
      }
      console.log(await eos.transaction(tr => {
         tr.updateauth({
            account: accountName,
            permission: updateActive.perm_name,
            parent: updateActive.parent,
            auth: updateActive.required_auth
         }, {
               authorization: `${accountName}@owner`
            })
      }, {
            keyProvider: multisigPrivateKey
         }))
   } catch (e) {
      console.log('\nCaught exception: ' + e)
      if (e instanceof RpcError)
         console.log(JSON.stringify(e.json, null, 2))
   }
}

const pollPublisher = 'multisig'

module.exports.sendAddPollTransaction = async function () {
   try {
      const result = await eos.transaction({
         actions: [{
            account: 'youvote',
            name: 'addpoll',
            authorization: [{
               actor: pollPublisher,
               permission: 'active'
            }],
            data: {
               publisher: pollPublisher,
               name: 'Is blockchain technology of the future?'
            }
         }],
         delay_sec: 10
      }, {
            keyProvider: [multisigPrivateKey, youvotePrivateKey]
         })
      console.warn("Scheduled transactions: \n",
         await eos.getScheduledTransactions(true, result.transaction_id))
   } catch (e) {
      console.log('\nCaught exception: ' + e)
      if (e instanceof RpcError)
         console.log(JSON.stringify(e.json, null, 2))
   }
}

module.exports.sendRmPollTransaction = async function () {
   try {
      console.warn("Transaction response: ", await eos.transaction({
         actions: [{
            account: 'youvote',
            name: 'rmpoll',
            authorization: [{
               actor: pollPublisher,
               permission: 'active'
            }],
            data: {
               id: 0
            }
         }],
         delay_sec: 10
      }, {
            keyProvider: [multisigPrivateKey, youvotePrivateKey]
         }))
   } catch (e) {
      console.log('\nCaught exception: ' + e)
      if (e instanceof RpcError)
         console.log(JSON.stringify(e.json, null, 2))
   }
}

*/
