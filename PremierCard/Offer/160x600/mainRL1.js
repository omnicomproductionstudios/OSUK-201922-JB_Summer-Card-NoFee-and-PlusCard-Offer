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
// .to("#sea-offset", {duration: 20, attr: { dx: -300, dy: -250 }, repeat: -1, ease: "none" }, 0)
    // .set("#sea-displace", { attr: { scale: 120 } })
function animate() {
  tl.set(["#main_content"], { autoAlpha: 1, force3D: true });
  tl.set(["#copy2", "#copy3", "#copy4", "#cta"], { y: 20, autoAlpha: 0 });
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
    .to(["#term2, #card-end, #logo-end"], {autoAlpha:1}, "frame4")
    .to("#lastFrame", 0.6, { y: 0, ease: Power2.easeOut }, "frame4")
    .to("#shine", { autoAlpha:1 }, "frame")
    .to(["#copy4", "#cta"], 0.5, { autoAlpha:1, y: 0, ease: Power2.easeOut }, "frame4+=0.5")
    .to("#shine", 0.5, { backgroundPosition: '146px 0px' }, "frame4+=1");
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