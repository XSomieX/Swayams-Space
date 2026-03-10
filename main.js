const name = document.getElementById("name")

const styles=[
{font:"Inter",class:""},
{font:"Georgia",class:"serif"},
{font:"Courier New",class:"block"},
{font:"Arial",class:"italic"},
{font:"Verdana",class:"sketch"},
{font:"Trebuchet MS",class:"futuristic"},
{font:"Times New Roman",class:"serif"},
{font:"Impact",class:"block"},
{font:"Lucida Console",class:"glitch"}
]

let lastIndex = -1;

setInterval(() => {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * styles.length);
  } while (randomIndex === lastIndex); // avoid same font twice
  lastIndex = randomIndex;

  const random = styles[randomIndex];

  name.style.fontFamily = random.font;
  name.className = "";
  if(random.class) name.classList.add(random.class);

}, 275);

document.getElementById("aboutBtn").addEventListener("click",e=>{

e.preventDefault()

document.querySelector("#about").scrollIntoView({behavior:"smooth"})

})
gsap.config({
force3D:true
})

gsap.registerPlugin(ScrollTrigger)

const frameCount=134

const currentFrame=i=>`/public/frames/frame${i.toString().padStart(4,"0")}.webp`

const img=document.getElementById("scrollAnimation")

const images=[]

for(let i=1;i<=frameCount;i++){

const image=new Image()
image.src=currentFrame(i)
images.push(image)

}

img.src=images[0].src

const animation={frame:0}

function render(){

img.src=images[Math.round(animation.frame)].src

}

/* INDICATORS */

const indicators = document.querySelectorAll(".progress-item")

function setActive(index){

indicators.forEach((dot,i)=>{

dot.classList.remove("active")

if(i===index) dot.classList.add("active")

})

}

setActive(0)

/* INITIAL POSITIONS */

gsap.set(".block1",{opacity:1,y:0,filter:"blur(0px)"})
gsap.set(".block2",{opacity:0,y:window.innerHeight,filter:"blur(10px)"})
gsap.set(".block3",{opacity:0,y:window.innerHeight,filter:"blur(10px)"})

gsap.to(".hero",{
  opacity:0,
  ease:"none",
  scrollTrigger:{
    trigger:"#about",
    start:"top bottom",
    end:"top top",
    scrub:true
  }
})

const tl = gsap.timeline({
scrollTrigger:{
id:"aboutSection",
trigger:"#about",
start:"top top",
end:"+=2800",
scrub:1,
pin:true,
anticipatePin:1,
onEnter:()=>setActiveNav("about"),
onEnterBack:()=>setActiveNav("about")
}
})

/* BLOCK 1 EXIT */

tl.to(".block1",{

y:-window.innerHeight,
opacity:0,
filter:"blur(10px)",
duration:1

})

/* FRAME 0 → 66 */

tl.to(animation,{

frame:66,
ease:"none",
duration:2,
onUpdate:render

},"<")

/* BLOCK 2 ENTER */

tl.to(".block2",{

y:0,
opacity:1,
filter:"blur(0px)",
duration:1.5,
onComplete:()=>setActive(1),
onReverseComplete:()=>setActive(0)

},"<0.5")

/* HOLD BLOCK 2 */

tl.to({}, {duration:0.6})

/* BLOCK 2 EXIT */

tl.to(".block2",{

y:-window.innerHeight,
opacity:0,
filter:"blur(10px)",
duration:1

})

/* FRAME 66 → 134 */

tl.to(animation,{

frame:134,
ease:"none",
duration:2,
onUpdate:render

},"<")

/* BLOCK 3 ENTER */

tl.to(".block3",{

y:0,
opacity:1,
filter:"blur(0px)",
duration:1.5,
onComplete:()=>setActive(2),
onReverseComplete:()=>setActive(1)

},"<0.5")

/* HOLD BLOCK 3 */

tl.to({}, {duration:0.6})

const cards = document.querySelectorAll(".work-card")

cards.forEach(card => {

card.addEventListener("mouseenter", () => {

cards.forEach(c => c.classList.remove("active"))
card.classList.add("active")

})

card.addEventListener("click", () => {

const link = card.dataset.link
if(link){
window.open(link, "_blank")
}
})
})
/* WORK → CONTACT SLIDE TRANSITION */

gsap.set("#contact", {
  y: "100%"
})

const workContact = gsap.timeline({
scrollTrigger:{
trigger:"#work",
start:"top top",
end:"+=100%",
scrub:1,
pin:true,

onUpdate:(self)=>{

if(self.progress > 0.5){
setActiveNav("contact")
}else{
setActiveNav("work")
}

}
}
})

workContact.to("#contact",{
  y:"0%",
  ease:"none"
})
/* NAVBAR SECTION INDICATOR */

/* NAVBAR INDICATOR */

const navLinks = document.querySelectorAll(".nav-link")
const indicator = document.querySelector(".nav-indicator")

function moveIndicator(link){

indicator.style.width = link.offsetWidth + "px"
indicator.style.left = link.offsetLeft + "px"

}

const activeLink = document.querySelector(".nav-link.active")
if(activeLink){
moveIndicator(activeLink)
}

/* CLICK MOVE */

navLinks.forEach(link=>{
link.addEventListener("click",()=>{
navLinks.forEach(l=>l.classList.remove("active"))
link.classList.add("active")
moveIndicator(link)
})
})

/* FIX SCROLLTRIGGER POSITION BUG */

window.addEventListener("load", () => {
ScrollTrigger.refresh()
})
/* NAV ACTIVE FIX FOR PINNED SECTIONS */

function setActiveNav(id){

navLinks.forEach(link=>{

link.classList.remove("active")

if(link.getAttribute("href") === "#" + id){
link.classList.add("active")
moveIndicator(link)
}

})

}
const copyBtn = document.getElementById("copyEmailBtn")
const toast = document.getElementById("copyToast")

copyBtn.addEventListener("click", () => {

const email = "swayam@example.com"

navigator.clipboard.writeText(email)

toast.classList.add("show")

setTimeout(()=>{
toast.classList.remove("show")
},2000)

})
/* WORK SECTION */

ScrollTrigger.create({
trigger:"#work",
start:"top center",
end:"top top",
onEnter:()=>setActiveNav("work"),
onEnterBack:()=>setActiveNav("work")
})

/* HOME */

ScrollTrigger.create({
trigger:"#home",
start:"top top",
end:"bottom center",
onEnter:()=>setActiveNav("home"),
onEnterBack:()=>setActiveNav("home")
})