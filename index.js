var cors = require('cors');
var express = require('express');
var scrape = require('./app/scrape');

var app = express();
var env = process.env.NODE_ENV || 'development';
var whitelist = [
  'https://hima-pro.github.io',
  'https://currency.tdim.me',
  'https://tdim.me'
];
var IgnoreWhitelist = true;
let corsOptions = {};
if (env === 'development') {
  app.set('json spaces', 2);
  whitelist.push('http://localhost:8090');
} else {
  corsOptions = {
    origin(origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin || IgnoreWhitelist) {
        callback(null, true);
      } else {
        callback(new Error("Hello, are you okay?"));
      }
    }
  };
}

app.use(cors(corsOptions));
app.use("/", cors(corsOptions), scrape);
if (env === 'development') {
  app.listen(8090, ()=>{
    console.log('server listen : 8090');
  });
} else {
  module.exports = app;
}
