// Banner duration timer start time
var startTime;

// Timeline references
var tl;
var tl1;

function init() {
  startTime = new Date();
  
  // Modern GSAP 3 syntax
  tl1 = gsap.timeline();
  tl = gsap.timeline({ onComplete: endTime });
  
  animate();
  setRollover();
}
function animate() {
  tl.set(["#main_content"], { autoAlpha: 1, force3D: true });
  tl.set(["#copy2, #copy21, #copy22, #copy3, #cta"], {y: 25})

  tl.addLabel('frame1', 0)
    .to('#copy1', 1, {autoAlpha: 1, ease: Power1.easeInOut}, 'frame1')
    .to(['#copy1, #tag'], 0.5, {autoAlpha: 0, ease: Power1.easeInOut}, 'frame1+=3.5')

  .addLabel('frame2', 'frame1+=3.7')
    .to('#copy2', 1, {y:0, autoAlpha: 1, ease: "power3.out"}, 'frame2')
    .to('#copy2', 0.5, {autoAlpha: 0, ease: Power1.easeInOut}, 'frame2+=3.5')

  .addLabel('frame3', 'frame2+=3.7')
    .to('#copy21', 1, {y:0, autoAlpha: 1, ease: "power3.out"}, 'frame3')
    .to('#copy21', 0.5, {autoAlpha: 0, ease: Power1.easeInOut}, 'frame3+=3.5')

  .addLabel('frame4', 'frame3+=3.7')
    .to('#copy22', 1, {y:0, autoAlpha: 1, ease: "power3.out"}, 'frame4')

  .addLabel('frame5', 'frame+=3.5')
    .to('#lastFrame',0.5,{y: 0, ease: Power2.easeInOut}, 'frame5')
    .to(["#copy3", "#cta"], 0.5, { autoAlpha:1, y: 0, ease: "power3.out" }, "frame5+=0.5")
    .to('#shine', 0.5, {backgroundPosition: '146px 0px'}, 'frame5+=1');
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