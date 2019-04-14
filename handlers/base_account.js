const {
  RpcError
} = require('eosjs')

const createAccountErrResp = e => {
  let err_obj = e.json
  let resp = err_obj.error.what + ': '
  if (err_obj.error.details[0])
    resp += err_obj.error.details[0].message
  return resp
}

const isBodyFormatValid = (req, res) => {
  if (!!!req.body.accountInfo || !!!req.body.userInfo) {
    res.status(400).send({
      message: 'Invalid body format'
    })
    return false
  }
  return true
}

const tryCreateAccount = async (createAccTransactionCb, req, res) => {
  let isSuccess = false

  try {
    let transactionReceipt = await createAccTransactionCb(req.body.accountInfo)
    if (transactionReceipt.processed.receipt.status === 'executed') {
      isSuccess = true
      res.status(200).send({
        transaction_id: transactionReceipt.transaction_id,
        receipt: transactionReceipt.processed.receipt,
        block_time: transactionReceipt.processed.block_time,
        block_num: transactionReceipt.processed.block_num
      })
    } else {
      res.status(400).send({
        message: 'Create account transaction failed with status: ' +
          transactionReceipt.processed.receipt.status
      })
    }
  } catch (e) {
    console.log(e)
    if (e instanceof RpcError) {
      res.status(400).send({
        message: createAccountErrResp(e)
      })
    } else {
      res.status(400).send({
        message: 'Blockchain related error'
      })
    }
  }

  return isSuccess
}

module.exports.tryCreateAccount = tryCreateAccount
module.exports.isBodyFormatValid = isBodyFormatValid
