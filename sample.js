
var Canvas = require('canvas')
  , http = require('http');

http.createServer(function (req, res) {

  var canvas = new Canvas(200,200);
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
  ctx.fillRect(10, 10, 190, 190);

  // テキスト描画
  var text = "Canvas Test";
  ctx.font = '30px Impact';
  ctx.rotate(.1);
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillText(text, 10, 100);

  // アンダーライン描画
  var te = ctx.measureText(text);
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.lineTo(50, 102);
  ctx.lineTo(50 + te.width, 102);
  ctx.stroke();

  // 出力
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<img src="' + canvas.toDataURL() + '" />');
  console.log(canvas);
  console.log(ctx);

}).listen(3000);
