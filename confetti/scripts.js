(function() {
  window.requestAnimationFrame = window.requestAnimationFrame ||
                                    window.mozRequestAnimationFrame ||
                                    window.webkitRequestAnimationFrame;
  
  var canvas = document.querySelector("canvas");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  var ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "source-over";
  var particles = [];
  var pIndex = 0;
  var x, y, vx, vy, id, life, maxlife, degree, size, frameId;
  var color;
  
  function Dot(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    particles[pIndex] = this;
    this.id = pIndex;
    pIndex++;
    this.life = 0;
    this.maxlife = 600;
    this.degree = getRandom(0, 360); // はじめの角度をずらす
    this.size = Math.floor(getRandom(8, 10)); // 紙のサイズをランダムに
  };
  
  Dot.prototype.draw = function(x, y) {
    this.degree += 1;
    this.vx *= 0.99; // 重力
    this.vy *= 0.999; // 重力
    this.x += this.vx+Math.cos(this.degree * Math.PI / 180); // 蛇行
    this.y += this.vy;
    this.height = Math.cos(this.degree * Math.PI / 45) * this.size; // 回転しているように見せるため
    this.width = this.size;
    // 紙を出力
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x + this.x / 2, this.y + this.y / 2);
    ctx.lineTo(this.x + this.x / 2 + this.width / 2, this.y + this.y / 2 + this.height);
    ctx.lineTo(this.x + this.x / 2 + this.width + this.width / 2, this.y + this.y / 2 + this.height);
    ctx.lineTo(this.x + this.x / 2 + this.width, this.y + this.y / 2);
    ctx.closePath();
    ctx.fill();
    this.life++;
    // 紙を削除
    if (this.life >= this.maxlife) {
      delete particles[this.id];
    }
  }

  // リサイズ処理
  window.addEventListener("resize", function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    y = canvas.height / 2;
    x = canvas.width / 2;
  });
  
  function loop(){
    ctx.clearRect(0,0, canvas.width, canvas.height); // 透過率を上げると、残像が強くなる
    // 紙の量の調節
    if (frameId % 3 == 0) {
      new Dot(canvas.width * Math.random() - canvas.width + canvas.width / 2 * Math.random(), -canvas.height / 2, getRandom(1, 3), getRandom(2, 4), "#D4AF37"); // metalic gold
      new Dot(canvas.width * Math.random() + canvas.width - canvas.width * Math.random(), -canvas.height / 2, -1 * getRandom(1, 3), getRandom(2, 4), "#C0C0C0"); // siliver
    }
    for(var i in particles) {
      particles[i].draw();
    }
    frameId = requestAnimationFrame(loop);
  }
  
  loop();
  
  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
})();