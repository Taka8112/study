var async = require('async');
var fs = require('fs');
var jStat = require('jStat').jStat;

//var red = [];
//var green = [];
//var blue = [];

var Red_stdev = [];
var Green_stdev = [];
var Blue_stdev = [];

var Red_Average = [];
var Green_Average = [];
var Blue_Average = [];

var Red_ratio = [];
var Green_ratio = [];
var Blue_ratio = [];

var Canvas = require('canvas');
var CImage = Canvas.Image;
var canvas = new Canvas(200, 200); //画像サイズ 200 × 200 = 40000
var ctx = canvas.getContext('2d'); // 2次元配置 

function Analysis(path ,callback){
  var tasks = [];
  tasks.push(function(next){
    var red = [];
    var green = [];
    var blue = [];

    fs.readFile(path, function(err, squid){
      if (err) throw err;
      var cimg = new CImage();
      cimg.src = squid;
      ctx.drawImage(cimg, 0, 0);//描画
      var src = ctx.getImageData(0, 0, canvas.width, canvas.height); //ImageDataオブジェクト取得
      var idata = src.data;
      var num = src.data.length;//ピクセルデータ総数取得
      //next(null, src , num, path);
      next(null, src , num, red ,green ,blue ,path);
    });
  });

  tasks.push(function(src, num, red, green, blue , path, next){
    for (var i = 0; i < num;i = i + 4){
      red.push(src.data[i]);
      green.push(src.data[i + 1]);
      blue.push(src.data[i + 2]);
    }
    var Red = jStat(red);
    var Green = jStat(green);
    var Blue = jStat(blue);
    async.mapSeries([Red, Green, Blue], function(color, cb){
      var r;
      color.stdev(function(val){
        stdev = val;
      }).sum(function(val){
        average = val / 40000;
        ratio = stdev / average;
        cb(null, [stdev,average, ratio]);
      });
    }, function(err, results) {
      r = results;
      next(null, r);
    });
  });

  async.waterfall(tasks, function(err, results){
    var red_1 = results[0];
    var green_1 = results[1];
    var blue_1 = results[2];
    callback(red_1, green_1 , blue_1);
  });
};

exports.girl = function(req, res, next){
  async.forEachSeries([0,1,2,3,4,5,6,7,8],function(n,cb){
    var picture = "./public/images/test/imgres_"+n+".jpg"
    Analysis(picture, function(RED, GREEN, BLUE){
      Red_stdev.push(RED[0]);
      Green_stdev.push(GREEN[0]);
      Blue_stdev.push(BLUE[0]);

      Red_Average.push(RED[1]);
      Green_Average.push(GREEN[1]);
      Blue_Average.push(BLUE[1]);

      Red_ratio.push(RED[2]);
      Green_ratio.push(GREEN[2]);
      Blue_ratio.push(BLUE[2]);

      cb();
    });
  }, function(err){
    canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
      res.render('data', {
        red_stdev: Red_stdev,
        green_stdev: Green_stdev,
        blue_stdev: Blue_stdev,
        red_average: Red_Average,
        green_average: Green_Average,
        blue_average: Blue_Average,
        red_ratio: Red_ratio,
        green_ratio: Green_ratio,
        blue_ratio: Blue_ratio
      });
    });
  });
};

exports.sea = function(req, res, next){
  async.forEachSeries([0,1,2,3,4,5,6],function(n,cb){
    var picture = './public/images/test/image_sample_'+n+'.jpg';
    Analysis(picture, function(RED, GREEN, BLUE){
      Red_stdev.push(RED[0]);
      Green_stdev.push(GREEN[0]);
      Blue_stdev.push(BLUE[0]);

      Red_Average.push(RED[1]);
      Green_Average.push(GREEN[1]);
      Blue_Average.push(BLUE[1]);

      Red_ratio.push(RED[2]);
      Green_ratio.push(GREEN[2]);
      Blue_ratio.push(BLUE[2]);

      cb();
    });
  }, function(err){
    canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
      res.render('sea', {
        red_stdev: Red_stdev,
        green_stdev: Green_stdev,
        blue_stdev: Blue_stdev,
        red_average: Red_Average,
        green_average: Green_Average,
        blue_average: Blue_Average,
        red_ratio: Red_ratio,
        green_ratio: Green_ratio,
        blue_ratio: Blue_ratio
      });
    });
  });
};

exports.iphone = function(req, res, next){
  async.forEachSeries([0],function(n,cb){
    var picture = './public/images/test/iphone_image_'+n+'.jpg';
    Analysis(picture, function(RED, GREEN, BLUE){
      Red_stdev.push(RED[0]);
      Green_stdev.push(GREEN[0]);
      Blue_stdev.push(BLUE[0]);

      Red_Average.push(RED[1]);
      Green_Average.push(GREEN[1]);
      Blue_Average.push(BLUE[1]);

      Red_ratio.push(RED[2]);
      Green_ratio.push(GREEN[2]);
      Blue_ratio.push(BLUE[2]);

      cb();
    });
  }, function(err){
    canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
      res.render('iphone', {
        red_stdev: Red_stdev,
        green_stdev: Green_stdev,
        blue_stdev: Blue_stdev,
        red_average: Red_Average,
        green_average: Green_Average,
        blue_average: Blue_Average,
        red_ratio: Red_ratio,
        green_ratio: Green_ratio,
        blue_ratio: Blue_ratio
      });
    });
  });
};

exports.exposure = function(req, res, next){
  async.forEachSeries([0,1,2,3,4,5,6,7,8,9],function(n,cb){
    var picture = './public/images/test/exposure_'+n+'.jpg';
    Analysis(picture, function(RED, GREEN, BLUE){
      Red_stdev.push(RED[0]);
      Green_stdev.push(GREEN[0]);
      Blue_stdev.push(BLUE[0]);

      Red_Average.push(RED[1]);
      Green_Average.push(GREEN[1]);
      Blue_Average.push(BLUE[1]);

      Red_ratio.push(RED[2]);
      Green_ratio.push(GREEN[2]);
      Blue_ratio.push(BLUE[2]);

      cb();
    });
  }, function(err){
    canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
      res.render('exposure', {
        red_stdev: Red_stdev,
        green_stdev: Green_stdev,
        blue_stdev: Blue_stdev,
        red_average: Red_Average,
        green_average: Green_Average,
        blue_average: Blue_Average,
        red_ratio: Red_ratio,
        green_ratio: Green_ratio,
        blue_ratio: Blue_ratio
      });
    });
  });
};


exports.saturation = function(req, res, next){
  async.forEachSeries([0,1,2,3,4],function(n,cb){
    var picture = './public/images/test/saturation_'+n+'.jpg';
    Analysis(picture, function(RED, GREEN, BLUE){
      Red_stdev.push(RED[0]);
      Green_stdev.push(GREEN[0]);
      Blue_stdev.push(BLUE[0]);

      Red_Average.push(RED[1]);
      Green_Average.push(GREEN[1]);
      Blue_Average.push(BLUE[1]);

      Red_ratio.push(RED[2]);
      Green_ratio.push(GREEN[2]);
      Blue_ratio.push(BLUE[2]);

      cb();
    });
  }, function(err){
    canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
      res.render('saturation', {
        red_stdev: Red_stdev,
        green_stdev: Green_stdev,
        blue_stdev: Blue_stdev,
        red_average: Red_Average,
        green_average: Green_Average,
        blue_average: Blue_Average,
        red_ratio: Red_ratio,
        green_ratio: Green_ratio,
        blue_ratio: Blue_ratio
      });
    });
  });
};

exports.mono = function(req, res, next){
  async.forEachSeries([0,1,2,3,4],function(n,cb){
    var picture = "./public/images/test/mono_"+n+".png"
    Analysis(picture, function(RED, GREEN, BLUE){
      Red_stdev.push(RED[0]);
      Green_stdev.push(GREEN[0]);
      Blue_stdev.push(BLUE[0]);

      Red_Average.push(RED[1]);
      Green_Average.push(GREEN[1]);
      Blue_Average.push(BLUE[1]);

      Red_ratio.push(RED[2]);
      Green_ratio.push(GREEN[2]);
      Blue_ratio.push(BLUE[2]);

      cb();
    });
  }, function(err){
    canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
      res.render('mono', {
        red_stdev: Red_stdev,
        green_stdev: Green_stdev,
        blue_stdev: Blue_stdev,
        red_average: Red_Average,
        green_average: Green_Average,
        blue_average: Blue_Average,
        red_ratio: Red_ratio,
        green_ratio: Green_ratio,
        blue_ratio: Blue_ratio
      });
    });
  });
};

exports.red = function(req, res, next){
  async.forEachSeries([0,1,2],function(n,cb){
    var picture = "./public/images/test/red_"+n+".png"
    Analysis(picture, function(RED, GREEN, BLUE){
      Red_stdev.push(RED[0]);
      Green_stdev.push(GREEN[0]);
      Blue_stdev.push(BLUE[0]);

      Red_Average.push(RED[1]);
      Green_Average.push(GREEN[1]);
      Blue_Average.push(BLUE[1]);

      Red_ratio.push(RED[2]);
      Green_ratio.push(GREEN[2]);
      Blue_ratio.push(BLUE[2]);

      cb();
    });
  }, function(err){
    canvas.toBuffer(function(err, buff){ //処理したimageをbufferで保存
      res.render('red', {
        red_stdev: Red_stdev,
        green_stdev: Green_stdev,
        blue_stdev: Blue_stdev,
        red_average: Red_Average,
        green_average: Green_Average,
        blue_average: Blue_Average,
        red_ratio: Red_ratio,
        green_ratio: Green_ratio,
        blue_ratio: Blue_ratio
      });
    });
  });
};
