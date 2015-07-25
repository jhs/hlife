var hlife = require('../')
hlife(function(er, packages) {
  if (er)
    throw er

  packages.forEach(function(pkg) {
    console.log('I have %s MB remaining for package: %s', pkg.remaining, pkg.name)
  })
})
