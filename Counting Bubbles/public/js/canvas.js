// @ts-nocheck
//functions
var globalScore = 0
var home = true
let shootingTime = new Date();
const scoreHTML = document.querySelector('#scoreHTML')
const gameOverHTML = document.querySelector('#gameOver')
const gameOverScoreHTML = document.querySelector('#gameOverScore')
const startButtonHTML = document.querySelector('#startButton')
const startStyleHTML = document.querySelector('#start')
const againButtonHTML = document.querySelector('#againButton')
const area1HTML = document.querySelector('#chooseFirst')
const area2HTML = document.querySelector('#chooseSecond')
const area3HTML = document.querySelector('#chooseThird')
const area4HTML = document.querySelector('#chooseFourth')
const q1 = document.querySelector('#q1')
const q2 = document.querySelector('#q2')
const q3 = document.querySelector('#q3')
const q4 = document.querySelector('#q4')
const backButtonHTML = document.querySelector('#backButton')
const leaderboardHTML = document.querySelector('#leaderboard')
const scoreButtondHTML = document.querySelector('#scoreButton')
const entryButtondHTML = document.querySelector('#entryButton')
const userForm = document.querySelector('#userInput')



const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
let game = false
let pink = false
let cirlceArea = false
let vanish = false
let hover = false
let chosen = false
let shooting = false
let precision = false
let end = false
let rightAnswer
let num
let startTime, endTime;
let options 
let counter = 3
let circleAreas 
let hit = 0

const mouse = {
  x: innerWidth,
  y: innerHeight
}

//classes
class Particle {
  constructor({x, y, radius, color, move=true, velocity=0, v=0, w=0, special=false}){
    this.position = {
        x,
        y
    }
    this.radius = radius
    this.color = color
    this.opacity = 1
    this.move = move
    this.velocity = velocity
    this.direction = {
      x: v,
      y: w
    }
    this.special = special
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false)
    c.fillStyle = this.color
    if (this.special){
      c.fillStyle = 'rgb(255,255,0)'
    }
    
    c.fill()
    c.closePath()
    c.restore()
  }

  update(){
    this.draw()
    if (this.velocity>0){
      this.position.x = this.position.x + this.direction.x*this.velocity
      this.position.y = this.position.y + this.direction.y*this.velocity
    }
  }
}

const friction = 0.99
class Particle2 {
  constructor({
    position, 
    velocity, 
    radius,
    color = '#654428',
  }) {
    this.position = {
      x: position.x,
      y: position.y
    }
    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }
    this.radius = radius
    this.color = color
    this.alpha = 1
  }
  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.alpha -= 0.01
  }
}

class Enemy {
  constructor({x, y, radius, color, velocity=10, type, angle, distance=0, direction=1, counter=10}){
    this.position = {
        x,
        y
    }
    this.radius = radius
    this.color = color
    this.opacity = 1
    this.velocity = velocity
    this.type = type
    this.angle = angle
    this.distance = distance
    this.direction = direction
    this.counter = counter
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }

  update(){
    this.draw()
    if(this.type == 1 || this.type == 2){
      this.position.x = (innerWidth/2) + this.distance * Math.cos(this.angle)
      this.position.y = (innerHeight/2) + this.distance * Math.sin(this.angle)
      this.angle = (this.angle + Math.PI / 360) % (Math.PI * 2)
    }
    else if(this.type == 3){
      if (this.counter > 0){
        switch (this.direction) {
          //rechts
          case 1:
            this.position.x = this.position.x + this.velocity
            break;
          //links
          case 2:
            this.position.x = this.position.x - this.velocity
            break;
          //oben
          case 3:
            this.position.y = this.position.y - this.velocity
            break;
          //unten
          case 4:
            this.position.y = this.position.y + this.velocity
            break;
          default:
            break;
        }
        this.counter --
        if (this.counter == 0){
          let pos = path(this.position)
          this.direction = pos
          this.counter = 10
        }
      }
    } 
  }
}

class CirlceArea{
  constructor({x, y, move=false}){
    this.radius = 200
    this.color = 'red'
    this.opacity = 1
    this.position = {
      x,
      y
    }
    this.move = move
  }

  draw(){
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false)
    c.strokeStyle  = this.color
    c.closePath()
    c.stroke()
    c.restore()
  }

  update(){
    if(this.move){
      this.position.x = mouse.x
      this.position.y = mouse.y
    }
    this.draw()
  }
}


class Player{
  constructor(){
    this.points = 0
    this.particle = new Particle({x: mouse.x, y: mouse.y, radius:6, color: 'red', move: false})
    this.circle = new CirlceArea({x: mouse.x, y: mouse.y, move: true})
    this.opacity = 1
  }

  draw(){
    if(!cirlceArea) this.particle.update()
    else this.circle.update()
  }

  update(){
    this.particle.position.x = mouse.x
    this.particle.position.y = mouse.y
    /*
    if(!shooting){
      this.particle.position.x = mouse.x
      this.particle.position.y = mouse.y
    }
    else {
      this.particle.position.x = innerWidth/2
      this.particle.position.y = innerHeight/2
    }
    */
    this.draw()
  }
}

//path that enemies take (very smart!!!)
function path(position){
  let numbers = [1, 2, 3, 4]
  let ran = Math.floor(Math.random() * (numbers.length) + 1)-1
  //rechts
  if (position.x >= (innerWidth-100) && numbers[ran] == 1){
    numbers.splice(ran, 1)
    ran = Math.floor(Math.random() * (numbers.length) + 1)
  }//links
  else if (position.x <= 200 && numbers[ran] == 2){
    numbers.splice(ran, 1)
    ran = Math.floor(Math.random() * (numbers.length) + 1)
  }
  //oben
  else if (position.y <= 200 && numbers[ran] == 3){
    numbers.splice(ran, 1)
    ran = Math.floor(Math.random() * (numbers.length) + 1)
  }
  //unten
  else if (position.y >= (innerHeight-200) && numbers[ran] == 4){
    numbers.splice(ran, 1)
    ran = Math.floor(Math.random() * (numbers.length) + 1)
  }
  else ran = numbers[ran]
  return ran
}

function CirclesCollide2(object1, object2){
  let a = object1.radius + object2.radius
  let x = Math.abs(object1.position.x - object2.position.x)
  let y = Math.abs(object1.position.y - object2.position.y)
  return (a > Math.sqrt((x * x) + (y * y)))
}

function runTime(){
  setTimeout(() => {
    //Nach den ersten 5 Sekunden sammelst du so viele Pinkte wie es nur geht 
    pink = true
    particles2 = []
  }, 5000);
  setTimeout(() => {
    pink = false
    if (pinkParticles.length <= 85){
      player.points = player.points*2
    }
    else if (pinkParticles.length > 90){
      player.points = 0
      scoreHTML.innerHTML = player.points
    }
    hover = true
    vanish = true
    area1HTML.style.display = 'block'
    area2HTML.style.display = 'block'
    area3HTML.style.display = 'block'
    area4HTML.style.display = 'block'
    start();
    //cirlceArea = true
  }, 10000);
}

//manage time
function start() {
  startTime = new Date();
}
function timeEnd() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
  return seconds
}

function checkShootingTime() {
  endTime = new Date();
  var timeDiff = endTime - shootingTime; //in ms
  return timeDiff
}

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('touchmove', (event) => {
  mouse.position.x = event.touches[0].clientX
  mouse.position.y = event.touches[0].clientY
})

addEventListener('click', (event) => {
  if (cirlceArea && counter > 0){
    circleAreas.push(new CirlceArea({x: mouse.x, y: mouse.y}))
    counter --
  }
  if (shooting || end){
    let checkShooting = checkShootingTime()
    if(checkShooting > 120){
      audio.laser.play()
      const angle = Math.atan2(event.clientY - innerHeight/2, event.clientX - innerWidth/2)
      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      }
      shootingParticles.push(new Particle({x: innerWidth/2, y: innerHeight/2, radius:3, color: 'pink', move: false, velocity: 7, v: velocity.x, w: velocity.y}))
      shootingTime = new Date();
    }
  }
})

backButtonHTML.addEventListener('click', () => {
  if (home){
    leaderboardHTML.style.display = 'none'
    startStyleHTML.style.display = 'block'
  }
  else{
    leaderboardHTML.style.display = 'none'
    gameOverHTML.style.display = 'block'
  }
})


area1HTML.addEventListener('click', () =>{
  if (!chosen){
    let lastet = timeEnd()
    if(rightAnswer == 1 && lastet <= 3){
      audio.win2.play()
      player.points += 200
    }else if (rightAnswer == 1 && lastet > 3) {
      audio.win2.play()
      player.points += 225-lastet*20
    }else{
      audio.fail.play()
    }
    /*
    if (num[3] == 1) {
      player.points += 200
    }
    else if (num[3] == 2) {
      player.points += 150
    }
    else if (num[3] == 3) {
      player.points += 100
    }
    else if (num[3] == 4) {
      player.points += 50
    }
    */
    scoreHTML.innerHTML = player.points
    chosen = true 
    area1HTML.style.display = 'none' 
    area2HTML.style.display = 'none'
    area3HTML.style.display = 'none'
    area4HTML.style.display = 'none'
    gsap.to('#chooseFirst', {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: 'expo.in',
      onComplete: () => {
        hover = false
        vanish = false
        shooting = true
        player.particle = new Particle({x: mouse.x, y: mouse.y, radius:player.particle.radius, color: 'red', move: false})
        setTimeout(() => {
          shooting = false
          precision = true
          particles2 = []
          shootingParticles = []
        }, 10000);
        setTimeout(() => {
          if (hit > 0 && hit < 3){
            setTimeout(()=>{
              precision = false
              particles2 = []
              shootingParticles = []
              end = true
              setTimeout(() => {
                audio.music1.stop()
                gameOverHTML.style.display = 'block'
                gsap.fromTo('#gameOver', { scale: 0.8,opacity: 0,}, {
                  scale: 1, 
                  opacity: 1,
                  ease: 'expo'
                })
                end = false
                gameOverScoreHTML.innerHTML = player.points
                globalScore = player.points
                game = false
              }, 15000);
            }, 5000)
          }
          else {
            precision = false
            particles2 = []
            shootingParticles = []
            end = true
            setTimeout(() => {
              audio.music1.stop()
              gameOverHTML.style.display = 'block'
              gsap.fromTo('#gameOver', { scale: 0.8,opacity: 0,}, {
                scale: 1, 
                opacity: 1,
                ease: 'expo'
              })
              end = false
              gameOverScoreHTML.innerHTML = player.points
              globalScore = player.points
              game = false
            }, 15000);
          }
        }, 15000);
      }
    })
  }
})

area2HTML.addEventListener('click', () =>{
  if (!chosen){
    let lastet = timeEnd()
    if(rightAnswer == 2 && lastet <= 3){
      audio.win2.play()
      player.points += 200
    }else if (rightAnswer == 2 && lastet > 3) {
      audio.win2.play()
      player.points += 225-lastet*20
    }else{
      audio.fail.play()
    }
    /*
    if (num[3] == 1) {
      player.points += 200
    }
    else if (num[3] == 2) {
      player.points += 150
    }
    else if (num[3] == 3) {
      player.points += 100
    }
    else if (num[3] == 4) {
      player.points += 50
    }
    */
    scoreHTML.innerHTML = player.points
    chosen = true
    area1HTML.style.display = 'none' 
    area2HTML.style.display = 'none'
    area3HTML.style.display = 'none'
    area4HTML.style.display = 'none'
    gsap.to('#chooseSecond', {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: 'expo.in',
      onComplete: () => {
        
        hover = false
        vanish = false
        shooting = true
        player.particle = new Particle({x: mouse.x, y: mouse.y, radius:player.particle.radius, color: 'red', move: false})
        setTimeout(() => {
          shooting = false
          precision = true
          particles2 = []
          shootingParticles = []
        }, 10000);
        setTimeout(() => {
          if (hit > 0 && hit < 3){
            setTimeout(()=>{
              precision = false
              particles2 = []
              shootingParticles = []
              end = true
              setTimeout(() => {
                audio.music1.stop()
                gameOverHTML.style.display = 'block'
                gsap.fromTo('#gameOver', { scale: 0.8,opacity: 0,}, {
                  scale: 1, 
                  opacity: 1,
                  ease: 'expo'
                })
                end = false
                gameOverScoreHTML.innerHTML = player.points
                globalScore = player.points
                game = false
              }, 15000);
            }, 5000)
          }
          else {
            precision = false
            particles2 = []
            shootingParticles = []
            end = true
            setTimeout(() => {
              audio.music1.stop()
              gameOverHTML.style.display = 'block'
              gsap.fromTo('#gameOver', { scale: 0.8,opacity: 0,}, {
                scale: 1, 
                opacity: 1,
                ease: 'expo'
              })
              end = false
              gameOverScoreHTML.innerHTML = player.points
              game = false
            }, 15000);
          }
        }, 15000);
      }
    })
  }
})

area3HTML.addEventListener('click', () =>{
  if (!chosen){
    let lastet = timeEnd()
    if(rightAnswer == 3 && lastet <= 3){
      audio.win2.play()
      player.points += 200
    }else if (rightAnswer == 3 && lastet > 3) {
      audio.win2.play()
      player.points += 225-lastet*20
    }else{
      audio.fail.play()
    }
    /*
    if (num[3] == 1) {
      player.points += 200
    }
    else if (num[3] == 2) {
      player.points += 150
    }
    else if (num[3] == 3) {
      player.points += 100
    }
    else if (num[3] == 4) {
      player.points += 50
    }
    */
    scoreHTML.innerHTML = player.points
    chosen = true
    area1HTML.style.display = 'none' 
    area2HTML.style.display = 'none'
    area3HTML.style.display = 'none'
    area4HTML.style.display = 'none'
    gsap.to('#chooseThird', {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: 'expo.in',
      onComplete: () => {
        area3HTML.style.display = 'none'
        hover = false
        vanish = false
        shooting = true
        player.particle = new Particle({x: mouse.x, y: mouse.y, radius:player.particle.radius, color: 'red', move: false})
        setTimeout(() => {
          shooting = false
          precision = true
          particles2 = []
          shootingParticles = []
        }, 10000);
        setTimeout(() => {
          if (hit > 0 && hit < 3){
            setTimeout(()=>{
              precision = false
              particles2 = []
              shootingParticles = []
              end = true
              setTimeout(() => {
                audio.music1.stop()
                gameOverHTML.style.display = 'block'
                gsap.fromTo('#gameOver', { scale: 0.8,opacity: 0,}, {
                  scale: 1, 
                  opacity: 1,
                  ease: 'expo'
                })
                end = false
                gameOverScoreHTML.innerHTML = player.points
                globalScore = player.points
                game = false
              }, 15000);
            }, 5000)
          }
          else {
            precision = false
            particles2 = []
            shootingParticles = []
            end = true
            setTimeout(() => {
              audio.music1.stop()
              gameOverHTML.style.display = 'block'
              gsap.fromTo('#gameOver', { scale: 0.8,opacity: 0,}, {
                scale: 1, 
                opacity: 1,
                ease: 'expo'
              })
              end = false
              gameOverScoreHTML.innerHTML = player.points
              game = false
            }, 15000);
          }
        }, 15000);
      }
    })
  }
})

area4HTML.addEventListener('click', () =>{
  if (!chosen){
    let lastet = timeEnd()
    if(rightAnswer == 4 && lastet <= 3){
      audio.win2.play()
      player.points += 200
    }else if (rightAnswer == 4 && lastet > 3) {
      audio.win2.play()
      player.points += 225-lastet*20
    }else{
      audio.fail.play()
    }
    /*
    if (num[3] == 1) {
      player.points += 200
    }
    else if (num[3] == 2) {
      player.points += 150
    }
    else if (num[3] == 3) {
      player.points += 100
    }
    else if (num[3] == 4) {
      player.points += 50
    }
    */
    scoreHTML.innerHTML = player.points
    chosen = true
    area1HTML.style.display = 'none' 
    area2HTML.style.display = 'none'
    area3HTML.style.display = 'none'
    area4HTML.style.display = 'none'
    gsap.to('#chooseFourth', {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: 'expo.in',
      onComplete: () => {
        area4HTML.style.display = 'none'
        hover = false
        vanish = false
        shooting = true
        player.particle = new Particle({x: mouse.x, y: mouse.y, radius:player.particle.radius, color: 'red', move: false})
        setTimeout(() => {
          shooting = false
          precision = true
          particles2 = []
          shootingParticles = []
        }, 10000);
        setTimeout(() => {
          if (hit > 0 && hit < 3){
            setTimeout(()=>{
              precision = false
              particles2 = []
              shootingParticles = []
              end = true
              setTimeout(() => {
                audio.music1.stop()
                gameOverHTML.style.display = 'block'
                gsap.fromTo('#gameOver', { scale: 0.8,opacity: 0,}, {
                  scale: 1, 
                  opacity: 1,
                  ease: 'expo'
                })
                end = false
                gameOverScoreHTML.innerHTML = player.points
                globalScore = player.points
                game = false
              }, 15000);
            }, 5000)
          }
          else {
            precision = false
            particles2 = []
            shootingParticles = []
            end = true
            setTimeout(() => {
              audio.music1.stop()
              gameOverHTML.style.display = 'block'
              gsap.fromTo('#gameOver', { scale: 0.8,opacity: 0,}, {
                scale: 1, 
                opacity: 1,
                ease: 'expo'
              })
              end = false
              gameOverScoreHTML.innerHTML = player.points
              globalScore = player.points
              game = false
            }, 15000);
          }
        }, 15000);
      }
    })
  }
})

againButtonHTML.addEventListener('click',() =>{
  audio.music1.play()
  gsap.to('#gameOver', {
    opacity: 0,
    scale: 0.8,
    duration: 0.2,
    ease: 'expo.in',
    onComplete: () => {
      startStyleHTML.style.transform = 'scale(1, 1)'
      gameOverHTML.style.display = 'none'
      gameOverHTML.style.transform = 'scale(1, 1)'
      entryButtondHTML.style.display = 'block';
      userForm.style.display = 'block';
      area1HTML.style.transform = 'scale(1, 1)'
      area1HTML.style.opacity = '1'
      area2HTML.style.transform = 'scale(1, 1)'
      area2HTML.style.opacity = '1'
      area3HTML.style.transform = 'scale(1, 1)'
      area3HTML.style.opacity = '1'
      area4HTML.style.transform = 'scale(1, 1)'
      area4HTML.style.opacity = '1'
    }
  })
  game = true
  home = false
  init()
  runTime()
})

startButtonHTML.addEventListener('click',() =>{
  home = false
  audio.music1.play()
  globalScore = 0
  gsap.to('#start', {
    opacity: 0,
    scale: 0.8,
    duration: 0.2,
    ease: 'expo.in',
    onComplete: () => {
      startStyleHTML.style.display = 'none'
    }
  })
  game = true
  runTime()
})

let player
let badEnemies
let normalEnemies
let goodEnemies
let precisionEnemies
let sA

let particles
let particles2
let particles3
let particles4
let particles5
let pinkParticles
let newParticles
let shootingParticles
let gun

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

async function init(){
  pink = false
  cirlceArea = false
  vanish = false
  hover = false
  chosen = false
  shooting = false
  counter = 3

  player = new Player()
  particles = []
  particles2 = []
  particles3 = []
  particles4 = []
  particles5 = []
  pinkParticles = []
  circleAreas = []
  newParticles = []
  shootingParticles = []
  badEnemies = []
  normalEnemies = []
  goodEnemies = []
  num = []
  gun = new Particle({x: innerWidth/2, y: innerHeight/2, radius:20, color: 'red', move: false})
  options = [1, 2, 3, 4]
  for (let i = 0; i< 4; i++) {
    let ran = Math.floor(Math.random() * (options.length) + 1)
    num.push(options[ran-1])
    options.splice(ran-1, 1)
  }
  //create particles
  for (let i = 0; i < 2000; i++) {
    let mode = false
    if (i % 40 == 0){
      mode = true
    }
    particles.push(new Particle({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: 2+ 3*Math.random(),
      color: `hsl(${Math.random() * 200} , 50%, 50%)`,
      special: mode
    }))
  }
  for (let i = 0; i < 500; i++) {
    particles3.push(new Particle({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: 3,
      color: `hsl(${Math.random() * 200} , 50%, 50%)`
    }))
  }
  for (let i = 0; i < 500; i++) {
    particles4.push(new Particle({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: 2+ Math.random()*2,
      color: `hsl(${Math.random() * 200} , 50%, 50%)`
    }))
  }
  for (let i = 0; i < 100; i++) {
    pinkParticles.push(new Particle({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: 2+ Math.random()*2,
      color: 'rgb(255,20,147)'
    }))
  }
  for (let i = 0; i < 500; i++) {
    particles5.push(new Particle({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: 2+ Math.random()*2,
      color: `hsl(${Math.random() * 200} , 50%, 50%)`
    }))
  }
  for (let i = 0; i < 7; i++) {
    badEnemies.push(new Enemy({
      x: (innerWidth/2) + 40 * Math.cos(i*18),
      y: (innerHeight/2) + 40 * Math.sin(i*18),
      radius: 40,
      color: 'rgb(0,191,255)',
      type: 1,
      angle: i*18,
      distance: 400
    }))
  }
  for (let i = 0; i < 11; i++) {
    normalEnemies.push(new Enemy({
      x: (innerWidth/2) + 20 * Math.cos(36*i),
      y: (innerHeight/2) + 20 * Math.cos(36*i),
      radius: 20,
      color: 'rgb(138,43,226)',
      type: 2,
      angle: 36*i,
      distance: 200
    }))
  }
  for (let i = 0; i < 5; i++) {
    goodEnemies.push(new Enemy({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: 5,
      color: 'rgb(255,255,0)',
      type: 3,
      angle: 36*i,
      direction: (i % 4)+1
    }))
  }
  precisionEnemies = []
  for (let i = 0; i < 5; i++) {
    precisionEnemies.push(new Enemy({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: 10,
      color: 'rgb(255,255,0)',
      type: 3,
      angle: 180,
      direction: 1
    }))
  }


  for (let i = 0; i < 400; i++) {
    newParticles.push(new Particle({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: 3,
      color: `hsl(${Math.random() * 200} , 50%, 50%)`
    }))
  }
  //create math questions
  let num1 = Math.floor(Math.random() * (20) + 1)
  let num2 = Math.floor(Math.random() * (20) + 1)
  sA = [num1*num2, (num1-1)*(num2-1), (num1+1)*(num2-1), (num1+1)*(num2+1)]
  sA = shuffle(sA)
  sA.forEach((num, index) => {
    if (num == num1*num2){
      rightAnswer = index + 1
    }
  })
  q1.innerHTML = num1.toString()+"*"+num2.toString()+" = "+sA[0].toString()
  q2.innerHTML = num1.toString()+"*"+num2.toString()+" = "+sA[1].toString()
  q3.innerHTML = num1.toString()+"*"+num2.toString()+" = "+sA[2].toString()
  q4.innerHTML = num1.toString()+"*"+num2.toString()+" = "+sA[3].toString()
}


function createScoreLabel({ position, score, color }) {
  const scoreLabel = document.createElement('label')
  scoreLabel.innerHTML = "+"+score.toString()
  scoreLabel.style.color = color
  scoreLabel.style.position = 'absolute'
  scoreLabel.style.left = position.x + 'px'
  scoreLabel.style.top = position.y + 'px'
  scoreLabel.style.userSelect = 'none'
  scoreLabel.style.pointerEvents = 'none'
  scoreLabel.style.fontSize = '20px'
  document.body.appendChild(scoreLabel)

  gsap.to(scoreLabel, {
    opacity: 0,
    y: -30,
    duration: 0.75,
    onComplete: () => {
      scoreLabel.parentNode.removeChild(scoreLabel)
    }
  })
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c?.fillRect(0, 0, innerWidth, innerHeight)
  

  //send shit to screen
  player.update()
  
  if (pink && !cirlceArea && !vanish && !shooting && !precision && !end){
    pinkParticles.forEach((particle) => {
      if (particle.move) {
        let num = Math.random()
        if (num < 0.25) {
          gsap.to(particle.position, {
            x: particle.position.x-0.5
          })
        }
        else if (num >= 0.25 && num < 0.50) {
          gsap.to(particle.position, {
            x: particle.position.x+0.5
          })
        }
        else if (num >= 0.50 && num < 0.75) {
          gsap.to(particle.position, {
            y: particle.position.y-0.5
          })
        }
        else {
          gsap.to(particle.position, {
            y: particle.position.y+0.5
          })
        }
      }
      particle.update()
    });
    particles2.forEach((particle, index) => {
      if (particle.alpha <= 0){
        particles2.splice(index, 1)
      }else particle.update()
    })
  }
  else if (!pink && !cirlceArea && !vanish && !shooting && !precision && !end) {
    particles.forEach((particle) => {
      if (particle.move) {
        let num = Math.random()
        if (num < 0.25) {
          gsap.to(particle.position, {
            x: particle.position.x-0.5
          })
        }
        else if (num >= 0.25 && num < 0.50) {
          gsap.to(particle.position, {
            x: particle.position.x+0.5
          })
        }
        else if (num >= 0.50 && num < 0.75) {
          gsap.to(particle.position, {
            y: particle.position.y-0.5
          })
        }
        else {
          gsap.to(particle.position, {
            y: particle.position.y+0.5
          })
        }
      }
      particle.update()
    });
    particles2.forEach((particle, index) => {
      if (particle.alpha <= 0){
        particles2.splice(index, 1)
      }else particle.update()
    })
  }
  else if (!pink && cirlceArea){
    circleAreas.forEach((circles) => {
      circles.update()
    })
  }
  else if (!pink && !cirlceArea && !hover && shooting && !precision && !end){
    gun.update()
    //all about shooting
    particles4.forEach((particle) => {
      if (particle.move) {
        let num = Math.random()
        if (num < 0.25) {
          gsap.to(particle.position, {
            x: particle.position.x-0.5
          })
        }
        else if (num >= 0.25 && num < 0.50) {
          gsap.to(particle.position, {
            x: particle.position.x+0.5
          })
        }
        else if (num >= 0.50 && num < 0.75) {
          gsap.to(particle.position, {
            y: particle.position.y-0.5
          })
        }
        else {
          gsap.to(particle.position, {
            y: particle.position.y+0.5
          })
        }
      }
      particle.update()
    });
    shootingParticles.forEach((sP, index) => {
      sP.update()
      if((sP.position.x - sP.radius < 0) || 
      (sP.position.x - sP.radius > innerWidth) || 
      (sP.position.y + sP.radius < 0) || 
      (sP.position.y - sP.radius > innerHeight)
      ){
        setTimeout(() => {
          shootingParticles.splice(index, 1)
        }, 0)
      }
    })
    badEnemies.forEach((enemie) => {
      enemie.update()
    })
    normalEnemies.forEach((enemie) => {
      enemie.update()
    })
    goodEnemies.forEach((enemie) => {
      enemie.update()
    })
    particles2.forEach((particle, index) => {
      if (particle.alpha <= 0){
        particles2.splice(index, 1)
      }else particle.update()
    })
  }
  else if (!pink && !hover && !cirlceArea && !shooting && precision && !end){
    precisionEnemies.forEach((enemie) => {
      enemie.update()
    })
    particles2.forEach((particle, index) => {
      if (particle.alpha <= 0){
        particles2.splice(index, 1)
      }else particle.update()
    })
    particles3.forEach((particle) => {
      if (particle.move) {
        let num = Math.random()
        if (num < 0.25) {
          gsap.to(particle.position, {
            x: particle.position.x-0.5
          })
        }
        else if (num >= 0.25 && num < 0.50) {
          gsap.to(particle.position, {
            x: particle.position.x+0.5
          })
        }
        else if (num >= 0.50 && num < 0.75) {
          gsap.to(particle.position, {
            y: particle.position.y-0.5
          })
        }
        else {
          gsap.to(particle.position, {
            y: particle.position.y+0.5
          })
        }
      }
      particle.update()
    });
  }
  else if(!pink && !cirlceArea && !hover && !shooting && !precision && end){
    particles5.forEach((particle) => {
      if (particle.move) {
        let num = Math.random()
        if (num < 0.25) {
          gsap.to(particle.position, {
            x: particle.position.x-0.5
          })
        }
        else if (num >= 0.25 && num < 0.50) {
          gsap.to(particle.position, {
            x: particle.position.x+0.5
          })
        }
        else if (num >= 0.50 && num < 0.75) {
          gsap.to(particle.position, {
            y: particle.position.y-0.5
          })
        }
        else {
          gsap.to(particle.position, {
            y: particle.position.y+0.5
          })
        }
      }
      particle.update()
    });
    particles2.forEach((particle, index) => {
      if (particle.alpha <= 0){
        particles2.splice(index, 1)
      }else particle.update()
    })
    gun.update()
    shootingParticles.forEach((sP, index) => {
      sP.update()
      if((sP.position.x - sP.radius < 0) || 
      (sP.position.x - sP.radius > innerWidth) || 
      (sP.position.y + sP.radius < 0) || 
      (sP.position.y - sP.radius > innerHeight)
      ){
        setTimeout(() => {
          shootingParticles.splice(index, 1)
        }, 0)
      }
    })
  }
  //collision detection 
  if(game){
    if (pink && !cirlceArea && !hover && !vanish && !shooting && !precision && !end){
      pinkParticles.forEach((particle, index) => {
        if(CirclesCollide2(particle, player.particle)){
          createScoreLabel({
            position: {
              x: particle.position.x,
              y: particle.position.y
            },
            score: 2,
            color: particle.color
          })
          for(let i = 0; i < particle.radius*2; i++){
            particles2.push(new Particle2({
              position: {
                x: particle.position.x + particle.radius,
                y: particle.position.y + particle.radius
              },
              velocity: {
                x: (Math.random() - 0.5)*(Math.random()*8),
                y: (Math.random() - 0.5)*(Math.random()*8) 
              },
              radius: Math.random()*2,
              color: particle.color
            }))
          }
          audio.bubble.play()
          setTimeout(() => {
            player.points += 2
            scoreHTML.innerHTML = player.points
            pinkParticles.splice(index, 1)
          }, 0)
        }
      })
    }
    else if (!pink && !hover && !cirlceArea && !vanish && !shooting && !precision && !end) {
      particles.forEach((particle, index) => {
        if(CirclesCollide2(particle, player.particle)){
          createScoreLabel({
            position: {
              x: particle.position.x,
              y: particle.position.y
            },
            score: 1,
            color: particle.color
          })
          audio.bubble.play()
          //make player bigger if it was a collsion with a special star
          if(particle.special){
            player.particle.radius += 0.1
          }
          for(let i = 0; i < particle.radius*2; i++){
            particles2.push(new Particle2({
              position: {
                x: particle.position.x + particle.radius,
                y: particle.position.y + particle.radius
              },
              velocity: {
                x: (Math.random() - 0.5)*(Math.random()*8),
                y: (Math.random() - 0.5)*(Math.random()*8) 
              },
              radius: Math.random()*2,
              color: particle.color
            }))
          }
          setTimeout(() => {
            player.points += 1
            scoreHTML.innerHTML = player.points
            particles.splice(index, 1)
            particles.push(new Particle({
              x: Math.random() * innerWidth,
              y: Math.random() * innerHeight,
              radius: 3,
              color: `hsl(${Math.random() * 200} , 50%, 50%)`
            }))
          }, 0)
        }
      })
    }
    else if (!pink && !cirlceArea && !hover && !vanish && shooting && !precision && !end){
      let newColor 
      shootingParticles.forEach((shot, i) => {
        badEnemies.forEach((bad, iBad) => {
          if(CirclesCollide2(shot, bad)){
            createScoreLabel({
              position: {
                x: bad.position.x,
                y: bad.position.y
              },
              score: 10,
              color: bad.color
            })
            newColor = bad.color
            audio.bubble2.play()
            // fill up array with particles
            for(let i = 0; i < bad.radius*2; i++){
              particles2.push(new Particle2({
                position: {
                  x: bad.position.x + bad.radius,
                  y: bad.position.y + bad.radius
                },
                velocity: {
                  x: (Math.random() - 0.5)*(Math.random()*8),
                  y: (Math.random() - 0.5)*(Math.random()*8) 
                },
                radius: Math.random()*2,
                color: bad.color
              }))
            }
            if (bad.radius -10 > 10){
              gsap.to(bad, {
                radius: bad.radius-10
              })
              player.points += 10
              scoreHTML.innerHTML = player.points
              setTimeout(() => {
                shootingParticles.splice(i, 1)
              }, 0)
            }else {
              setTimeout(() => {
                player.points += 10
                scoreHTML.innerHTML = player.points
                shootingParticles.splice(i, 1)
                badEnemies.splice(iBad, 1)
              }, 0)
            }
          }
        })
        normalEnemies.forEach((normal, inor) => {
          if(CirclesCollide2(shot, normal)){
            createScoreLabel({
              position: {
                x: normal.position.x,
                y: normal.position.y
              },
              score: 10,
              color: normal.color
            })
            newColor = normal.color
            audio.bubble2.play()
            for(let i = 0; i < normal.radius*2; i++){
              particles2.push(new Particle2({
                position: {
                  x: normal.position.x + normal.radius,
                  y: normal.position.y + normal.radius
                },
                velocity: {
                  x: (Math.random() - 0.5)*(Math.random()*8),
                  y: (Math.random() - 0.5)*(Math.random()*8) 
                },
                radius: Math.random()*2,
                color: normal.color
              }))
            }
            if (normal.radius -7 > 10){
              gsap.to(normal, {
                radius: normal.radius-7
              })
              player.points += 10
              scoreHTML.innerHTML = player.points
              setTimeout(() => {
                shootingParticles.splice(i, 1)
              }, 0)
            }else {
              setTimeout(() => {
                player.points += 10
                scoreHTML.innerHTML = player.points
                shootingParticles.splice(i, 1)
                normalEnemies.splice(inor, 1)
              }, 0)
            }
          }
        })
        goodEnemies.forEach((good, igood) => {
          if(CirclesCollide2(shot, good)){
            createScoreLabel({
              position: {
                x: good.position.x,
                y: good.position.y
              },
              score: 100,
              color: good.color
            })
            newColor = good.color
            audio.bubble2.play()
            for(let i = 0; i < good.radius*2; i++){
              particles2.push(new Particle2({
                position: {
                  x: good.position.x + good.radius,
                  y: good.position.y + good.radius
                },
                velocity: {
                  x: (Math.random() - 0.5)*(Math.random()*8),
                  y: (Math.random() - 0.5)*(Math.random()*8) 
                },
                radius: Math.random()*2,
                color: good.color
              }))
            }
            setTimeout(() => {
              player.points += 100
              scoreHTML.innerHTML = player.points
              shootingParticles.splice(i, 1)
              goodEnemies.splice(igood, 1)
            }, 0)
          }
        })
      })
    }
    else if (!pink && !cirlceArea && !hover && !vanish && !shooting && precision && !end){
      precisionEnemies.forEach((pEnemy, ienem) => {
        if(CirclesCollide2(player.particle, pEnemy)){
          createScoreLabel({
            position: {
              x: pEnemy.position.x,
              y: pEnemy.position.y
            },
            score: 100,
            color: pEnemy.color
          })
          audio.bubble2.play()
          hit ++
          for(let i = 0; i < pEnemy.radius*2; i++){
            particles2.push(new Particle2({
              position: {
                x: pEnemy.position.x + pEnemy.radius,
                y: pEnemy.position.y + pEnemy.radius
              },
              velocity: {
                x: (Math.random() - 0.5)*(Math.random()*8),
                y: (Math.random() - 0.5)*(Math.random()*8) 
              },
              radius: Math.random()*2,
              color: 'rgb(255,255,0)',
            }))
          }
          setTimeout(() => {
            player.points += 100
            scoreHTML.innerHTML = player.points
            precisionEnemies.splice(ienem, 1)
          }, 0)
        }
      });
    }
    else if(!pink && !cirlceArea && !hover && !shooting && !precision && end){
      shootingParticles.forEach((shot, i) => {
        particles5.forEach((particle, j) =>{
          if(CirclesCollide2(shot, particle)){
            createScoreLabel({
              position: {
                x: particle.position.x,
                y: particle.position.y
              },
              score: 1,
              color: particle.color
            })
            audio.bubble.play()
            for(let i = 0; i < particle.radius*2; i++){
              particles2.push(new Particle2({
                position: {
                  x: particle.position.x + particle.radius,
                  y: particle.position.y + particle.radius
                },
                velocity: {
                  x: (Math.random() - 0.5)*(Math.random()*8),
                  y: (Math.random() - 0.5)*(Math.random()*8) 
                },
                radius: Math.random()*2,
                color: particle.color
              }))
            }
            setTimeout(() => {
              player.points += 1
              scoreHTML.innerHTML = player.points
              particles5.splice(j, 1)
            }, 0)
          }
        })
      })
    }
  }
}

init()
animate()

window.addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight
  init()
})