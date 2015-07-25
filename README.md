# hlife

CLI interface to Truemove H-Life. Use this command to check your data packages and balance with True, without visiting the site.

Install with `npm install hlife`. If you plan to use the command, `npm install -g hlife`

The packages are an array. They seem to apply roughly from begin to end.

## Usage, API

The API returns an array of package objects. Each object looks like this:
``` js
{
    "name": "Net 3G with max 3G speed",
    "remaining": 196,
    "validity": "ตั้งแต่ 25/07/2015 23:32 ถึง 26/07/2015 23:32"
}
```

Example usage:

``` js
var hlife = require('hlife')
hlife(function(er, packages) {
  if (er)
    throw er

  packages.forEach(function(pkg) {
    console.log('I have %s MB remaining for package: %s', pkg.remaining, pkg.name)
  })
})
```

Example output:

    I have Infinity remaining for package: เน็ตไม่จำกัด 15บาท 1วัน (ความเร็วสูงสุด 512Kbps 200MB)
    I have 196 MB remaining for package: Net 3G with max 3G speed

## Usage, CLI

Just run `hlife` for a quick printout:

```
$ hlife
Infinity: เน็ตไม่จำกัด 15บาท 1วัน (ความเร็วสูงสุด 512Kbps 200MB)
196     : Net 3G with max 3G speed
```
