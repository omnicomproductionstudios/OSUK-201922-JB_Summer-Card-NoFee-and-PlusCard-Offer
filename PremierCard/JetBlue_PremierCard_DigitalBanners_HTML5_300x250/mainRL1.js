// Banner duration timer start time
var startTime;

// Timeline reference
var tl;
var tl1;
var waterCanvas;
var waterCtx;
var waterImage;
var waterFrameId;
var waterStartTime;

// Init tricggered by onLoad in Body tag
function init() {
  // Set Banner duration timer
  startTime = new Date();
  // Set Global Timeline
  tl1 = new TimelineMax({});
  tl = gsap.timeline({ onComplete: endTime });
  waterCanvas = document.getElementById("water_canvas");
  waterCtx = waterCanvas.getContext("2d");
  waterImage = document.getElementById("bg");
  animate();
  setRollover();
}

function animate() {
  tl.set(["#main_content"], { autoAlpha: 1, force3D: true });
  tl.set(["#copy2", "#copy3", "#copy4", "#cta"], { y: 20, autoAlpha: 0 });
  tl1.set("#bg", {x: -52, y: -4, scale: 1.03, transformOrigin: "0px 0px", force3D: true,});
  tl.set("#water_canvas", { autoAlpha: 0 });

  tl1.to("#bg", 12, { x: 0, y: 0, scale: 1, ease: "none" }, 0);
  gsap.to("#water_canvas", { duration: 0.7, autoAlpha: 1, ease: "power1.out",});
  startWaterEffect();

  tl.addLabel("frame1", 0)
    .to(copy1, 1, { autoAlpha: 1, ease: "power1.inOut" }, "frame1")
    .to(copy1, 0.5, { autoAlpha: 0, ease: "power1.inOut" }, "frame1+=3.5")
    .to(offer, 0.5, { autoAlpha: 0, ease: "power1.inOut" }, "frame1+=3.5",)
    .addLabel("frame2", "frame1+=4")
    .to(copy2, 1, { y: 0, autoAlpha: 1, ease: "power3.out" }, "frame2")
    .to(copy2, 0.5, { autoAlpha: 0, ease: "power1.inOut" }, "frame2+=3.5")
    .addLabel("frame3", "frame2+=4")
    .to(copy3, 1, { y: 0, autoAlpha: 1, ease: "power3.out" }, "frame3")
    .addLabel("frame4", "frame3+=4")
    .to("#card", {autoAlpha:1}, "frame4")
    .to("#term2", {autoAlpha:1}, "frame4")
    .to("#lastFrame", 0.6, { y: -253, ease: Power2.easeOut }, "frame4")
    .to(["#copy4", "#cta"], 0.5, { autoAlpha:1, y: 0, ease: Power2.easeOut }, "frame4+=0.5")
    .to("#shine", 0.5, { backgroundPosition: "425px 0px" }, "frame4+=1");
}

function startWaterEffect() {
  if (!waterCanvas || !waterCtx || !waterImage) {
    return;
  }

  if (!waterImage.complete) {
    waterImage.addEventListener("load", startWaterEffect, { once: true });
    return;
  }

  if (waterFrameId) {
    cancelAnimationFrame(waterFrameId);
    waterFrameId = null;
  }

  waterStartTime = performance.now();
  renderWater(waterStartTime);
}

function renderWater(now) {
  var elapsed = (now - waterStartTime) / 1000;

  drawWaterFrame(elapsed);

  if (elapsed < 12.05) {
    waterFrameId = requestAnimationFrame(renderWater);
  } else {
    waterFrameId = null;
  }
}

function drawWaterFrame(elapsed) {
  var ctx = waterCtx;
  var img = waterImage;
  var canvasWidth = waterCanvas.width;
  var canvasHeight = waterCanvas.height;
  var waterTop = 0;
  var screenX = Number(gsap.getProperty("#bg", "x")) || 0;
  var screenY = Number(gsap.getProperty("#bg", "y")) || 0;
  var scale = Number(gsap.getProperty("#bg", "scaleX")) || 1;
  var displayScale = (396 * scale) / img.naturalWidth;
  var srcBandWidth = canvasWidth / displayScale;
  var stripHeight = 2;
  var maxSrcX = img.naturalWidth - srcBandWidth;
  var maxSrcY = img.naturalHeight - stripHeight / displayScale;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.save();
  clipWaterArea(ctx, elapsed, canvasWidth, canvasHeight);

  for (var dy = waterTop; dy < canvasHeight; dy += stripHeight) {
    var band = (dy - waterTop) / (canvasHeight - waterTop);
    var fade = smoothstep(0.01, 0.24, band);
    var depth = smoothstep(0.02, 1, band);
    var wave =
      Math.sin(elapsed * 2.6 + dy * 0.18) * (2.8 + depth * 5.6) +
      Math.sin(elapsed * 5.4 + dy * 0.42 + Math.sin(elapsed * 1.05)) * (1.2 + depth * 2.8) +
      Math.cos(elapsed * 3.6 - dy * 0.13) * 1.4;
    var drift = Math.sin(elapsed * 1.05 + band * 5.4) * 3.2;
    var lift = Math.sin(elapsed * 3.9 + band * 12.8) * depth * 2.3;
    var srcX = clamp((-screenX + wave + drift) / displayScale, 0, maxSrcX);
    var srcY = clamp((dy - screenY + lift) / displayScale, 0, maxSrcY);
    var srcH = stripHeight / displayScale;

    ctx.globalAlpha = 0.07 + fade * 0.12;
    ctx.drawImage(img, srcX, srcY, srcBandWidth, srcH, 0, dy, canvasWidth, stripHeight + 1);

    ctx.globalAlpha = 0.04 + fade * 0.07;
    ctx.drawImage(
      img,
      clamp(srcX + (10 + depth * 14), 0, maxSrcX),
      srcY,
      srcBandWidth,
      srcH,
      0,
      dy,
      canvasWidth,
      stripHeight + 1
    );
  }

  drawWaterCaustics(ctx, elapsed, canvasWidth, canvasHeight, waterTop);
  ctx.restore();
}

function clipWaterArea(ctx, elapsed, width, height) {
  var crestA = 10 + Math.sin(elapsed * 1.2) * 2.2;
  var crestB = 4 + Math.sin(elapsed * 1.6 + 0.8) * 2.4;
  var crestC = 14 + Math.cos(elapsed * 1.35 + 0.5) * 2.3;
  var crestD = 6 + Math.sin(elapsed * 1.28 + 1.2) * 2;
  var crestE = 16 + Math.cos(elapsed * 1.1 + 0.4) * 2.1;

  ctx.beginPath();
  ctx.moveTo(-20, crestA);
  ctx.bezierCurveTo(22, crestB, 88, 18 + Math.sin(elapsed * 1.55) * 2, 144, crestC);
  ctx.bezierCurveTo(208, 2, 252, crestD, width + 22, crestE);
  ctx.lineTo(width + 22, height);
  ctx.lineTo(-20, height);
  ctx.closePath();
  ctx.clip();
}

function drawWaterCaustics(ctx, elapsed, width, height, top) {
  var tint = ctx.createLinearGradient(0, top, 0, height);

  tint.addColorStop(0, "rgba(214,255,255,0.02)");
  tint.addColorStop(0.42, "rgba(214,255,255,0.055)");
  tint.addColorStop(1, "rgba(244,255,255,0.13)");

  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = tint;
  ctx.fillRect(0, top, width, height - top);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(190, 245, 255, 0.22)";

  for (var i = 0; i < 11; i++) {
    var baseY = top + 10 + i * 20;
    var widthSwing = 5 + (i % 4) * 1.4;
    var alpha = 0.11 + (i % 3) * 0.025;
    var grad = ctx.createLinearGradient(0, baseY, width, baseY + 8);

    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.18, "rgba(255,255,255," + (alpha * 0.5) + ")");
    grad.addColorStop(0.5, "rgba(220,250,255," + alpha + ")");
    grad.addColorStop(0.82, "rgba(255,255,255," + (alpha * 0.55) + ")");
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.moveTo(-20, baseY + Math.sin(elapsed * 1.25 + i * 0.6) * widthSwing);

    for (var x = 20; x <= width + 28; x += 28) {
      var y =
        baseY +
        Math.sin(elapsed * 1.85 + x * 0.028 + i * 0.72) * widthSwing +
        Math.cos(elapsed * 1.2 - x * 0.018 + i * 0.35) * (2.2 + i * 0.08);
      ctx.quadraticCurveTo(x - 14, y - 4, x, y);
    }

    ctx.strokeStyle = grad;
    ctx.lineWidth = 1 + (i % 3) * 0.4;
    ctx.stroke();
  }

  ctx.shadowBlur = 7;
  ctx.shadowColor = "rgba(210, 250, 255, 0.18)";

  for (var j = 0; j < 8; j++) {
    var baseX = -10 + j * 42 + Math.sin(elapsed * 0.9 + j) * 10;
    var alphaCol = 0.045 + (j % 2) * 0.02;
    var gradCol = ctx.createLinearGradient(baseX, top, baseX + 48, height);

    gradCol.addColorStop(0, "rgba(255,255,255,0)");
    gradCol.addColorStop(0.45, "rgba(225,252,255," + alphaCol + ")");
    gradCol.addColorStop(0.58, "rgba(255,255,255," + (alphaCol * 1.4) + ")");
    gradCol.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.moveTo(baseX, top - 10);
    ctx.bezierCurveTo(
      baseX + 12 + Math.sin(elapsed * 1.4 + j) * 7,
      top + 38,
      baseX - 8 + Math.cos(elapsed * 1.2 + j) * 6,
      top + 118,
      baseX + 18 + Math.sin(elapsed * 1.6 + j) * 8,
      height + 16
    );
    ctx.strokeStyle = gradCol;
    ctx.lineWidth = 0.9 + (j % 3) * 0.25;
    ctx.stroke();
  }

  ctx.shadowBlur = 0;

  for (var k = 0; k < 5; k++) {
    var cx = ((elapsed * (30 + k * 4) + k * 58) % (width + 90)) - 45;
    var cy = top + 28 + Math.sin(elapsed * 1.1 + k * 0.9) * 16 + k * 22;
    var radius = 28 + (k % 3) * 8;
    var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

    glow.addColorStop(0, "rgba(255,255,255,0.16)");
    glow.addColorStop(0.35, "rgba(220,250,255,0.08)");
    glow.addColorStop(1, "rgba(255,255,255,0)");

    ctx.globalAlpha = 0.6;
    ctx.fillStyle = glow;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

function setRollover() {
  document
    .getElementById("default_exit")
    .addEventListener("mouseover", defaultOver, false);
  document
    .getElementById("default_exit")
    .addEventListener("mouseout", defaultOut, false);
}

function defaultOver() {
  TweenMax.to("#cta", 0.15, { scale: 1.1, ease: Power1.easeInOut });
}

function defaultOut() {
  TweenMax.to("#cta", 0.15, { scale: 1, ease: Power1.easeInOut });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(min, max, value) {
  var x = clamp((value - min) / (max - min), 0, 1);

  return x * x * (3 - 2 * x);
}

function randomInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function endTime() {
  // show total banner animation time in browser console.
  var endTimestamp = new Date();

  console.log(
    "Animation duration: " + (endTimestamp - startTime) / 1000 + " seconds"
  );
}

function randomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
