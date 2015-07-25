module.exports = check_balance

var debug = require('debug')('hlife')
var request = require('request')
var cheerio = require('cheerio')

var SITE = 'http://hlife.truecorp.co.th'
var UA   = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'

var TH = { name     : /แพ็กเกจ/
         , remaining: /คงเหลือ/
         , validity : /ระยะเวลาใช้งาน/
         }

function check_balance(callback) {
  fetch_balance(function(er, html) {
    if (er)
      return callback(er)

    var $ = cheerio.load(html)
    var result = []
    var groups = $('.control-group')
    debug('Found %d groups', groups.length)
    for (var i = 0 ; i < groups.length; i += 3) {
      var pkg = {}
      add_pair(pkg, $(groups[i+0]))
      add_pair(pkg, $(groups[i+1]))
      add_pair(pkg, $(groups[i+2]))

      if (!pkg.name)
        return callback(new Error(`Cannot find name in groups: ${html}`))
      if (!pkg.remaining)
        return callback(new Error(`Cannot find remaining in groups: ${html}`))
      if (!pkg.validity)
        return callback(new Error(`Cannot find validity in groups: ${html}`))

      var match = pkg.remaining.match(/(\d+\.?\d*) MB/)
      if (match)
        pkg.remaining = +match[1]
      else if (pkg.remaining.match(/Unlimited/))
        pkg.remaining = Infinity

      result.push(pkg)
    }

    callback(null, result)
  })
}

function add_pair(pkg, group) {
  var label = group.find('label').text() || ''
  var key = null
  Object.keys(TH).forEach(function(field) {
    if (label.match(TH[field]))
      key = field
  })

  if (!key)
    debug('No key for group: %s', group.html())
  else {
    pkg[key] = group.find('p.text-datain').text()
  }
}

function fetch_balance(callback) {
  debug('Check balance')
  var url = `${SITE}/datausage/vas?device=web&version=`
  var headers = {'user-agent':UA, 'X-Requested-With':'XMLHttpRequest', referer:`${SITE}/`}

  request({url:url, headers:headers, json:true}, function(er, res) {
    if (er)
      return callback(er)
    if (res.statusCode != 200)
      return callback(new Error(`Got ${res.statusCode}: ${res.body}`))

    if (res.body.message != 'Success')
      return callback(new Error(`Unknown response: ${JSON.stringify(res.body)}`))

    debug('Response HTML: %j', res.body.html)
    callback(null, res.body.html)
  })
}

function main() {
  check_balance(function(er, packages) {
    if (er)
      throw er

    var label_len = 0
    packages.forEach(function(package) {
      label_len = Math.max(label_len, (''+package.remaining).length)
    })

    packages.forEach(function(package) {
      var label = ''+package.remaining
      while (label.length < label_len)
        label += ' '
      console.log('%s: %s', label, package.name)
    })
  })
}

if (require.main === module)
  main()
