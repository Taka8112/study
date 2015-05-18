
/*
 * GET home page.
 */

var async = require('async');
var jStat = require('jStat').jStat;
var histgram = require('histogram');

var Canvas = require('canvas');
var CImage = Canvas.Image;
var canvas = new Canvas(200, 200); //画像サイズ 200 × 200 = 40000
var ctx = canvas.getContext('2d'); // 2次元配置 4 * 40000 = 160000

var cimg = new CImage();
cimg.src = "./public/images/test/imgres_7.jpg";
ctx.drawImage(cimg, 0, 0);//cimgの描画
var src = ctx.getImageData(0, 0, canvas.width, canvas.height); //ImageDataオブジェクト取得
var dst = ctx.createImageData(canvas.width, canvas.height); //ImageDataオブジェクト生成 


exports.reverse = function(req, res, next){ //反転変換　色情報の反転

  for (var i = 0; i < src.data.length; i = i + 4) {
    dst.data[i + 0] = 255 - src.data[i];    //R
    dst.data[i + 1] = 255 - src.data[i + 1];  //G
    dst.data[i + 2] = 255 - src.data[i + 2];  //B
    dst.data[i + 3] = src.data[i + 3];        //A
  }
  ctx.putImageData(dst, 0, 0); //ImageDataオブジェクト描画 

  canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
    res.header('Content-Type', 'image/jpeg');
    res.send(buff);
  });
};

exports.positive = function(req, res, next){ //画像を明るくする

  var width = 4 * src.width;
  var height = src.height;
  var num = src.data.length;
  //var num = width * height;

  for(var i = 0; i < num ; i = i + 4){
    dst.data[i + 0] = 100 + src.data[i + 0]; //R
    dst.data[i + 1] = 100 + src.data[i + 1]; //G
    dst.data[i + 2] = 100 + src.data[i + 2]; //B
    dst.data[i + 3] = src.data[i + 3]; //A
  }
  
  ctx.putImageData(dst, 0, 0); //ImageDataオブジェクト描画 

  canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
    res.header('Content-Type', 'image/jpeg');
    res.send(buff);
  });
};

exports.contrast = function(req, res, next){ //コントラスト調整 p1 = a * P0  + b //P0元画素値,P1変更後の画素値 

  var num = src.data.length;
  var a = 2; //コントラストグラフの傾き

  for(y = 40; y < src.height; y++){
    for(x = 70; x < src.width; x++){
      var i = (x + y * src.width) * 4; //一次元配列内の場所を計算
      dst.data[i + 0] = (src.data[i + 0] - 128) * a + 128 ;
      dst.data[i + 1] = (src.data[i + 1] - 128) * a + 128 ;
      dst.data[i + 2] = (src.data[i + 2] - 128) * a + 128 ;
      dst.data[i + 3] = src.data[i + 3]; //A
    }
  }
  
  ctx.putImageData(dst, 0, 0); //ImageDataオブジェクト描画 

  canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
    res.header('Content-Type', 'image/jpeg');
    res.send(buff);
  });
};

exports.noise = function(req, res, next){ //乱数処理 画素のランダム移動 

  function clamp(x, min ,max){
    if (x < min) return min;
    if (x > max) return max;
    return x;
  }

  for(y = 0; y < src.height; y++){
    for(x = 0; x < src.width; x++){

      var r = ~~(Math.random() * 7) - 3; //移動範囲の-3から3の値をつくる
      var r_x = clamp(x + r, 0, src.width - 1); //画素の移動範囲制限　横
      var r_y = clamp(y + r, 0, src.height - 1); //画素の移動範囲制限　縦

      var i = (x + y * src.width) * 4; //一次元配列内の場所を計算
      var s_i =  (r_x + r_y * src.width) * 4; //移動先の画素
      dst.data[i + 0] = src.data[s_i + 0] ; //R
      dst.data[i + 1] = src.data[s_i + 1] ; //G
      dst.data[i + 2] = src.data[s_i + 2] ; //B
      dst.data[i + 3] = src.data[s_i + 3] ; //A

    }
  }
  
  ctx.putImageData(dst, 0, 0); //ImageDataオブジェクト描画 

  canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
    res.header('Content-Type', 'image/jpeg');
    res.send(buff);
  });
};

exports.grey = function(req, res, next){ //グレースケール変換 白と黒と中間色で構成された画像

  var idata = src.data;//ピクセルデータ取得
  var num = src.data.length;//ピクセルデータ総数取得

  for (var i = 0; i < num; i=i+4) {
    var pixel = idata[i + 1];
    
    //var pixel = ((0.298912 * idata[i]) + (0.586611  * idata[i + 1]) + (0.114478 *idata[i + 2])) / 3;//YIQモデル
    dst.data[i + 0] = pixel;
    dst.data[i + 1] = pixel;
    dst.data[i + 2] = pixel;
    dst.data[i + 3] = src.data[i + 3];
  }

  //console.log(dst);
  ctx.putImageData(dst, 0, 0); //ImageDataオブジェクト描画 

  canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
    res.header('Content-Type', 'image/jpeg');
    res.send(buff);
  });
};

exports.edge = function(req, res, next){

  function toGray(idata, gray, next){  
    //for (var i = 0; i < idata.data.length ; i = i + 4) {

  for(y = 0; y < idata.height; y++){
    for(x = 0; x < idata.width; x++){
      var i = (x + y * idata.width) * 4;
      var r = idata.data[i + 0]; //R
      var g = idata.data[i + 1]; //G
      var b = idata.data[i + 2]; //B
      var gray_pixel = (0.298912 * r) + (0.586611  * g) + (0.114478 * b) / 1024;//YIQモデル
      gray.data[i + 0] = gray_pixel;
      gray.data[i + 1] = gray_pixel;
      gray.data[i + 2] = gray_pixel;
      gray.data[i + 3] = idata.data[i + 3];
    }
  }
    next();
    return gray;
  }

  var height = src.height;
  var width = src.width;

  async.series([
    function(callback){
      toGray(src ,dst, function(){  //グレースケール化
        console.log(dst);
        callback();
      });
      /*
    }, function(callback){
      for(var y = 0; y < height - 1; y++){
        for(var x = 0; x < width - 1; x++){
          var i = x + y * width;//処理する画素
          var r_i = (x + 1) + y * width; //右隣の画素
          var ex = dst.data[r_i] - dst.data[i];

          var d_i = x + (y + 1) * width;
          var ey = dst.data[d_i] - dst.data[i];

          var ez = Math.sqrt(ex*ex + ey*ey);
          dst.data[i] = ez * 2;
        }
      }
      callback();
     */
    }
  ], function(err){
    if(err) {throw err;}
  });

  ctx.putImageData(dst, 0, 0); //ImageDataオブジェクト描画 
  canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
    res.header('Content-Type', 'image/jpeg');
    res.send(buff);
  });
};


exports.cal = function(req, res, next){ //グレースケール変換 白と黒と中間色で構成された画像

  var matrix = jStat([[ 1, 2, 3 ],[ 4, 5, 6 ],[ 7, 8, 9 ]]);
  //console.log(matrix);

  var myVect = [2,6,4,7,2,7,4],
        jObj = jStat( myVect );
  //console.log(jObj);
  jObj.sum( function( val ) {
    //console.log(val);
    // val === sum
  }).min( function( val ) {
    //console.log(val);
    // val === min
  }).max( function( val ) {
    //console.log(val);
    // val === max
  }).stdev( function( val ) {
    //console.log(val);
    // val == stdev
  });

  var idata = src.data;//ピクセルデータ取得
  var num = src.data.length;//ピクセルデータ総数取得
  var grey = [];
  var red = [];
  var green = [];
  var blue = [];

  /*
  for (var i = 0; i < num; i=i+4) {
    var pixel = idata[i];
    dst.data[i + 0] = pixel;
    dst.data[i + 1] = pixel;
    dst.data[i + 2] = pixel;
    dst.data[i + 3] = src.data[i + 3];
  }

  for (var i = 0; i < num; i++){
    grey[i] = idata[i];
  }

  var Grey = jStat(grey);
  Grey.stdev(function(val){
    console.log(val);
  }).variance(function(val){
    console.log(val);
  });
 */

  histgram(cimg.src, function(err, data){
    red = data.red;
    green = data.green;
    blue = data.blue;
  
    var Red = jStat(red);
    var Green = jStat(green);
    var Blue = jStat(blue);

    Red.stdev(function(val){
      console.log('red   stdev : ' + val);
    });
    Green.stdev(function(val){
      console.log('green stdev : ' + val);
    });
    Blue.stdev(function(val){
      console.log('blue  stdev : ' + val);
    });
  });

  ctx.putImageData(src, 0, 0); //ImageDataオブジェクト描画 

  canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
    res.header('Content-Type', 'image/jpeg');
    res.send(buff);
  });
};

exports.girl = function(req, res, next){ 

  var picture = new CImage();

  var red = [];
  var green = [];
  var blue = [];

  var Red_result = [];
  var Green_result = [];
  var Blue_result = [];

  var Red_Average = [];
  var Green_Average = [];
  var Blue_Average = [];

  var Red_ratio = [];
  var Green_ratio = [];
  var Blue_ratio = [];

  //var images = [
  picture.src = "./public/images/test/imgres_0.jpg";
  var src = ctx.getImageData(0, 0, canvas.width, canvas.height); //ImageDataオブジェクト取得
  var num = src.data.length;//ピクセルデータ総数取得
  ctx.drawImage(picture, 0, 0);//描画

  console.log(picture);
  /*
  picture.find(function(err, result){
    console.log(result);
  });
 */
  for (var i = 0; i < num;i = i + 4){
    red.push(src.data[i]);
    green.push(src.data[i + 1]);
    blue.push(src.data[i + 2]);
  }

  var Red = jStat(red);
  var Green = jStat(green);
  var Blue = jStat(blue);

  async.forEach([0], function(x, cb){
    Red.stdev(function(val){
      Red_result[x] = val;
    }).sum(function(val){
      Red_Average[x] = val / red.length;
      Red_ratio[x] = Red_result[x] / Red_Average[x];
    });
    Green.stdev(function(val){
      Green_result[x] = val;
    }).sum(function(val){
      Green_Average[x] = val / green.length;
      Green_ratio[x] = Green_result[x] / Green_Average[x];
    });
    Blue.stdev(function(val){
      Blue_result[x] = val;
    }).sum(function(val){
      Blue_Average[x] = val / blue.length;
      Blue_ratio[x] = Blue_result[x] / Blue_Average[x];
    });
  }, function(err){
    if (err) {throw err;}
  });

  //ctx.putImageData(src, 0, 0); //ImageDataオブジェクト描画 

  canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
    res.render('girl', {
      red_stdev: Red_result,
      green_stdev: Green_result,
      blue_stdev: Blue_result,
      red_average: Red_Average,
      green_average: Green_Average,
      blue_average: Blue_Average,
      red_ratio: Red_ratio,
      green_ratio: Green_ratio,
      blue_ratio: Blue_ratio
    });
  });
};


exports.iphone = function(req, res, next){ 

  var red = [];
  var green = [];
  var blue = [];

  var Red_result = [];
  var Green_result = [];
  var Blue_result = [];

  var Red_Average = [];
  var Green_Average = [];
  var Blue_Average = [];

  var Red_ratio = [];
  var Green_ratio = [];
  var Blue_ratio = [];

  async.forEach([0], function(x, cb){
    histgram('./public/images/test/iphone_image_'+x+'.jpg', function(err, data){
      red = data.red;
      green = data.green;
      blue = data.blue;

      var Red = jStat(red);
      var Green = jStat(green);
      var Blue = jStat(blue);

      Red.stdev(function(val){
        Red_result[x] = val;
      }).sum(function(val){
        Red_Average[x] = val / red.length;
        Red_ratio[x] = Red_result[x] / Red_Average[x];
      });
      Green.stdev(function(val){
        Green_result[x] = val;
      }).sum(function(val){
        Green_Average[x] = val / green.length;
        Green_ratio[x] = Green_result[x] / Green_Average[x];
      });
      Blue.stdev(function(val){
        Blue_result[x] = val;
      }).sum(function(val){
        Blue_Average[x] = val / blue.length;
        Blue_ratio[x] = Blue_result[x] / Blue_Average[x];
      });
      cb();
    });
  }, function(err){
    if(err) {throw err;}
  });

  ctx.putImageData(src, 0, 0); //ImageDataオブジェクト描画 

  canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
    console.log(Red_Average);
    res.render('iphone', {
      red_stdev: Red_result,
      green_stdev: Green_result,
      blue_stdev: Blue_result,
      red_average: Red_Average,
      green_average: Green_Average,
      blue_average: Blue_Average,
      red_ratio: Red_ratio,
      green_ratio: Green_ratio,
      blue_ratio: Blue_ratio
    });
  });
};


