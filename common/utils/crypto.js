const NodeRSA = require('node-rsa')
const nodeEncrypt = (word, keyStr) => { // 加密
  const k = new NodeRSA()
  k.setOptions({ encryptionScheme: 'pkcs1' })
  k.importKey(keyStr, 'pkcs8-public')
  const x = k.encrypt(word, 'base64')
  return x
}

const nodeDecrypt = (word, keyStr) => {
  const k = new NodeRSA()
  k.setOptions({ encryptionScheme: 'pkcs1' })
  k.importKey(keyStr, 'pkcs8-private')
  const x = k.decrypt(word, 'utf8')
  return x
}

export default {
  nodeEncrypt, nodeDecrypt
}
