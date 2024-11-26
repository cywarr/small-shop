import { Vector2 as vec2, MathUtils as mu, Clock } from "three";

console.clear();

// load fonts
await (async function () {
  async function loadFont(fontface) {
    await fontface.load();
    document.fonts.add(fontface);
  }
  let fonts = [
    new FontFace(
      "Goldman",
      "url(https://fonts.gstatic.com/s/goldman/v19/pe0rMIWbN4JFplR2FI5XEtCaBg.woff2) format('woff2')"
    )
  ];
  for (let font in fonts) {
    await loadFont(fonts[font]);
  }
})();

let baseColor = "darkgreen";

class Boxes {
  constructor() {
    this.maxDistance = 50;
    this.minDistance = 10;
    this.distanceWidth = this.maxDistance - this.minDistance;
    this.items = Array.from({ length: 200 }, () => {
      return {
        pos: new vec2(),
        dir: new vec2(),
        currDist: 0,
        fill: false,
        color: 0,
        size: 0
      };
    });

    this.init();
  }
  init() {
    this.items.forEach((item) => {
      this.setRandDir(item.dir);
      item.currDist = Math.random();
      item.fill = Math.random() < 0.5;
      item.color = Math.random() * 40 + 100;
      item.size = Math.random() * 5 + 1;
    });
  }
  setRandDir(v) {
    let a = Math.PI * 2 * Math.random();
    v.set(Math.cos(a), Math.sin(a));
  }
  draw(t) {
    this.items.forEach((item) => {
      item.currDist += t;
      if (item.currDist > 1) {
        item.currDist %= 1;
        this.setRandDir(item.dir);
      }
      let currDist = item.currDist * this.distanceWidth;
      item.pos.copy(item.dir).setLength(currDist + this.minDistance);
      item.pos.x *= ur;

      let a =
        mu.smoothstep(currDist, 0, 5) -
        mu.smoothstep(currDist, this.distanceWidth * 0.25, this.distanceWidth);
      ctx.fillStyle = `hsla(${item.color}, 100%, 25%, ${a})`;
      ctx.strokeStyle = `hsla(${item.color}, 75%, 50%, ${a})`;
      ctx.lineWidth = u(0.1);
      let s = item.size * ((item.currDist * 0.5) + 0.5);
      ctx.strokeRect(
        u(item.pos.x - s * 0.5),
        u(item.pos.y - s * 0.5),
        u(s),
        u(s)
      );
      if (item.fill) {
        ctx.fillRect(
          u(item.pos.x - s * 0.5),
          u(item.pos.y - s * 0.5),
          u(s),
          u(s)
        );
      }
      ctx.stroke();
    });
  }
}

class Corners {
  constructor() {
    this.padding = 5;
    this.radius = 15;
    this.thickness = 1;
    this.coords = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1]
    ];
  }
  draw() {
    this.coords.forEach((corner, cIdx) => {
      let startAngle = cIdx * Math.PI * 0.5;
      let endAngle = startAngle + Math.PI * 0.5;
      let x =
        u(Math.abs(corner[0] * 50 * ur) - this.radius - this.padding) *
        Math.sign(corner[0]);
      let y =
        u(Math.abs(corner[1] * 50) - this.radius - this.padding) *
        Math.sign(corner[1]);
      ctx.beginPath();
      ctx.arc(x, y, u(this.radius), startAngle, endAngle);

      ctx.lineWidth = u(this.thickness);
      ctx.strokeStyle = `hsla(120, 100%, 25%, 0.1)`;
      ctx.stroke();
      ctx.lineWidth = u(this.thickness * 0.25);
      ctx.strokeStyle = baseColor;
      ctx.stroke();
    });
  }
}

class Writing {
  constructor() {
    this.text = "SL";
    this.size = 50;
  }
  draw() {
    ctx.font = `${u(this.size)}px Goldman`;
    ctx.fillStyle = baseColor;
    ctx.strokeStyle = `hsla(120, 100%, 25%, 0.1)`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, 0, 0);
    ctx.lineWidth = u(1);
    ctx.strokeText(this.text, 0, 0);
    ctx.lineWidth = u(0.5);
    ctx.strokeStyle = "lightgreen";
    ctx.strokeText(this.text, 0, 0);
  }
}

let ctx = cnv.getContext("2d");
let unit = 0;
let u = (val) => unit * val;
let ur = 0;
let resize = () => {
  cnv.width = innerWidth;
  cnv.height = innerHeight;
  unit = cnv.height * 0.01;
  ur = innerWidth / innerHeight;
};
window.addEventListener("resize", resize);
resize();

let boxes = new Boxes();
let corners = new Corners();
let writing = new Writing();

let clock = new Clock();

(function draw() {
  requestAnimationFrame(draw);
  let t = clock.getDelta();
  ctx.fillStyle = `rgba(255, 255, 255, 0.05)`;
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.translate(u(50 * ur), u(50));
  boxes.draw(t * 0.25);
  corners.draw();
  writing.draw();
  ctx.restore();
})();
