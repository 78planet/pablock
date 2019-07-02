const express = require('express');
const webpack = require('webpack');
var path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
const hashContract = require('./src/bmodul');

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));
app.use(express.static(path.join(__dirname, 'src')));

app.get('/career', function (req, res) {
    res.sendFile(path.join(__dirname, 'src', 'career.html'));
});

app.post('/getCont', function (req, res) {
  var c_code = req.body.c_code;
  console.log(c_code);
  console.log("*****getCon*****");
  hashContract.getHashCont(c_code).then(function(data){
    console.log(data);
    res.send({"blockHsCont":data});
  }).catch(function(err){
      console.error(err);
      res.send(err);
  });
});



// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});