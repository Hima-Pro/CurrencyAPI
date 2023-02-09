var express = require('express');
var request = require('request');
const { JSDOM } = require('jsdom');
var router = express.Router({ mergeParams: true });

var scraper = (qData, callback) =>{
  var gSearch = "https://google.com/search";
  var gQuery;
  if (qData[2] > 1) {
    gQuery = `${qData[2]}+${qData[0]}+to+${qData[1]}`;
  } else {
    gQuery = `${qData[0]}+to+${qData[1]}`;
  }
  request({ qs: {q: gQuery}, uri: gSearch }, function (error, response, body) {
    if (!error && response.statusCode == 200 && body) {
      const { document } = new JSDOM(body).window;
      var elText = document.querySelector("div > .BNeawe").textContent;
      var result = elText.split(" ")[0];
          result = result.replace(".", "");
          result = result.replace(",", ".");
          result = parseFloat(result);
      callback({
        "status": 200,
        "result": parseFloat((result/qData[2]).toFixed(2)),
        "amount": result
      });
    }
  });
};

router.route('/').get(function (req, res) {
  res.json({
    "status": 404,
    "result": {
      "try": "/EGP+vs+RUB?amount=10&apikey=###",
      "accept":[
        'https://hima-pro.github.io',
        'https://currency.tdim.me',
        'https://tdim.me'
      ]
    }
  });
});

router.route('/:from/:to').get(function (req, res) {
  if (req.query.amount) {
    scraper([
      req.params.from,
      req.params.to,
      parseFloat(req.query.amount)
    ], respond);
  } else {
    scraper([
      req.params.from,
      req.params.to, 1
    ], respond);
  }
  function respond (data){
    res.type("application/json");
    res.json(data);
  }
});
module.exports = router;