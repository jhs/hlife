module.exports = check_balance

var debug = require('debug')('hlife')
var request = require('request')

var SITE = 'http://hlife.truecorp.co.th'

function check_balance(callback) {
  debug('Check balance')
  var url = `${SITE}/datausage/vas?device=web&version=`
  request({url:url, json:true}, function(er, res) {
    if (er)
      return callback(er)
    if (res.statusCode != 200)
      return callback(new Error(`Got ${res.statusCode}: ${res.body}`))

    if (res.body.message != 'Success')
      return callback(new Error(`Unknown response: ${JSON.stringify(res.body)}`))

    debug('Response HTML', res.body.html)
    callback(null, res.body.html)
  })
}

function main() {
  check_balance(function(er, state) {
    if (er)
      throw er

    console.log(state)
  })
}

if (require.main === module)
  main()
