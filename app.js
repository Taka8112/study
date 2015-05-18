
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var async = require('async');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var image = require("./routes/images");
var data = require("./routes/data");

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/grey', image.grey);
app.get('/reverse', image.reverse);
app.get('/positive', image.positive);
app.get('/contrast', image.contrast);
app.get('/noise', image.noise);
app.get('/edge', image.edge);
app.get('/cal', image.cal);
app.get('/girl', image.girl);

app.get('/data', data.girl);
app.get('/sea', data.sea);
app.get('/exposure', data.exposure);
app.get('/saturation', data.saturation);
app.get('/iphone', data.iphone);
app.get('/mono', data.mono);
app.get('/red', data.red);

app.get('/image', function(req, res, next){

  var Canvas = require('canvas')
    , Image = Canvas.Image
    , canvas = new Canvas(200,200)
    , ctx = canvas.getContext('2d');
  var img = new Image();    //新規画像オブジェクト

  img.src = __dirname + "/test/imgres.jpg";   //読み込みたい画像のパス

  ctx.drawImage(img, 0, 0);//imgの描画

  canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
    res.header('Content-Type', 'image/jpeg');
    res.send(buff);
  });
});



http.createServer(app).listen(app.get('port'), function(req, res){
  console.log('Express server listening on port ' + app.get('port'));
});

