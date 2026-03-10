// ================= NAME FONT RANDOMIZER =================
const name = document.getElementById("name");

const styles = [
  { font: "Inter", class: "" },
  { font: "Georgia", class: "serif" },
  { font: "Courier New", class: "block" },
  { font: "Arial", class: "italic" },
  { font: "Verdana", class: "sketch" },
  { font: "Trebuchet MS", class: "futuristic" },
  { font: "Times New Roman", class: "serif" },
  { font: "Impact", class: "block" },
  { font: "Lucida Console", class: "glitch" }
];

let lastIndex = -1;

setInterval(() => {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * styles.length);
  } while (randomIndex === lastIndex);
  lastIndex = randomIndex;

  const random = styles[randomIndex];
  name.style.fontFamily = random.font;
  name.className = "";
  if (random.class) name.classList.add(random.class);
}, 275);

// ================= ABOUT BUTTON SCROLL =================
document.getElementById("aboutBtn").addEventListener("click", e => {
  e.preventDefault();
  document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
});

// ================= GSAP CONFIG =================
gsap.config({ force3D: true });
gsap.registerPlugin(ScrollTrigger);

// ================= LOADER & FRAME PRELOAD =================
const frameCount = 137;
const images = Array(frameCount).fill(null);
let imagesLoaded = 0;

const loader = document.getElementById("loader");
const progressBar = document.getElementById("loader-progress");
const percentText = document.getElementById("loader-percent");
const img = document.getElementById("scrollAnimation");

const currentFrame = i =>
  `/public/frames/frame${(i + 1).toString().padStart(4, "0")}.webp`;

// Prevent scroll until loader finishes
document.body.style.overflow = "hidden";

// Load a single frame
function loadFrame(i, retry = 0) {
  const image = new Image();
  image.src = currentFrame(i);

  image.onload = () => {
    images[i] = image;
    imagesLoaded++;
    updateProgress();
    checkAllLoaded();
  };

  image.onerror = () => {
    if (retry < 3) {
      loadFrame(i, retry + 1);
    } else {
      console.warn("Failed to load frame:", i);
      images[i] = null; // mark as loaded even if failed
      imagesLoaded++;
      updateProgress();
      checkAllLoaded();
    }
  };
}

// Update loader progress bar
function updateProgress() {
  const progress = Math.floor((imagesLoaded / frameCount) * 100);
  progressBar.style.width = progress + "%";
  percentText.innerText = progress + "%";
}

// Check if all frames are loaded
function checkAllLoaded() {
  if (imagesLoaded === frameCount) finishLoading();
}

// Start loading all frames in parallel
for (let i = 0; i < frameCount; i++) {
  loadFrame(i);
}
// Finish loader
function finishLoading() {
  img.src = images[0] ? images[0].src : "";
  setTimeout(() => {
    loader.style.opacity = "0";
    document.body.style.overflow = "auto";
    setTimeout(() => loader.remove(), 600);
  }, 300);
}

// ================= FRAME ANIMATION =================
const animation = { frame: 0 };
function render() {
  const f = Math.round(animation.frame);
  if (images[f]) img.src = images[f].src;
}

// ================= ABOUT SECTION =================
const indicators = document.querySelectorAll(".progress-item");
function setActive(index) {
  indicators.forEach((dot, i) => {
    dot.classList.remove("active");
    if (i === index) dot.classList.add("active");
  });
}
setActive(0);

// Initial positions
gsap.set(".about-block", { xPercent: -50, yPercent: -50 });
gsap.set(".block1", { opacity: 1, y: 0, filter: "blur(0px)" });
gsap.set(".block2", { opacity: 0, y: window.innerHeight, filter: "blur(10px)" });
gsap.set(".block3", { opacity: 0, y: window.innerHeight, filter: "blur(10px)" });

// Hero fade out
gsap.to(".hero", {
  opacity: 0,
  ease: "none",
  scrollTrigger: {
    trigger: "#about",
    start: "top bottom",
    end: "top top",
    scrub: true
  }
});

// About timeline
const tl = gsap.timeline({
  scrollTrigger: {
    id: "aboutSection",
    trigger: "#about",
    start: "top top",
    end: "+=2800",
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    onEnter: () => setActiveNav("about"),
    onEnterBack: () => setActiveNav("about")
  }
});

// BLOCK 1 exit
tl.to(".block1", { y: -window.innerHeight, opacity: 0, filter: "blur(10px)", duration: 1 });

// FRAME 0 → 66
tl.to(animation, { frame: 66, ease: "none", duration: 2, onUpdate: render }, "<");

// BLOCK 2 enter
tl.to(".block2", { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, onComplete: () => setActive(1), onReverseComplete: () => setActive(0) }, "<0.5");

// Hold
tl.to({}, { duration: 0.6 });

// BLOCK 2 exit
tl.to(".block2", { y: -window.innerHeight, opacity: 0, filter: "blur(10px)", duration: 1 });

// FRAME 66 → 134
tl.to(animation, { frame: 134, ease: "none", duration: 2, onUpdate: render }, "<");

// BLOCK 3 enter
tl.to(".block3", { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, onComplete: () => setActive(2), onReverseComplete: () => setActive(1) }, "<0.5");

// Hold
tl.to({}, { duration: 0.6 });

// ================= WORK CARDS =================
const cards = document.querySelectorAll(".work-card");
cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    cards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
  });

  card.addEventListener("click", () => {
    const link = card.dataset.link;
    if (link) window.open(link, "_blank");
  });
});

// ================= WORK → CONTACT =================
gsap.set("#contact", { y: "100%" });

const workContact = gsap.timeline({
  scrollTrigger: {
    trigger: "#work",
    start: "top top",
    end: "+=100%",
    scrub: 1,
    pin: true,
    onUpdate: self => {
      if (self.progress > 0.5) setActiveNav("contact");
      else setActiveNav("work");
    }
  }
});

workContact.to("#contact", { y: "0%", ease: "none" });

// ================= NAVBAR =================
const navLinks = document.querySelectorAll(".nav-link");
const indicator = document.querySelector(".nav-indicator");

function moveIndicator(link) {
  indicator.style.width = link.offsetWidth + "px";
  indicator.style.left = link.offsetLeft + "px";
}

const activeLink = document.querySelector(".nav-link.active");
if (activeLink) moveIndicator(activeLink);

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    moveIndicator(link);
  });
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

function setActiveNav(id) {
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + id) {
      link.classList.add("active");
      moveIndicator(link);
    }
  });
}

// ================= COPY EMAIL =================
const copyBtn = document.getElementById("copyEmailBtn");
const toast = document.getElementById("copyToast");

copyBtn.addEventListener("click", () => {
  const email = "swayam@example.com";
  navigator.clipboard.writeText(email);
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
});

// ================= SCROLLTRIGGER NAV =================
ScrollTrigger.create({
  trigger: "#work",
  start: "top center",
  end: "top top",
  onEnter: () => setActiveNav("work"),
  onEnterBack: () => setActiveNav("work")
});

ScrollTrigger.create({
  trigger: "#home",
  start: "top top",
  end: "bottom center",
  onEnter: () => setActiveNav("home"),
  onEnterBack: () => setActiveNav("home")
});