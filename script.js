var vehicleId = 0
let mapOffsetX = document.querySelector('.mapElem').getBoundingClientRect().x
let mapOffsetY = document.querySelector('.mapElem').getBoundingClientRect().y

const ts0 = document.getElementById('ts0')
const ts1 = document.getElementById('ts1')
const ts2 = document.getElementById('ts2')
const ts3 = document.getElementById('ts3')

// const redLight = document.querySelector('.frame .redLight')
var signal
var redLight
var yellowLight
var greenLight

console.log(ts0.redLight)

var lastVehicle = new Array(8)

function createVehicle(mode) {
  let source
  let trackId
  let trackElem
  let transform
  let vehicleType
  let prevVehicle
  let directions = ['up', 'right', 'down', 'left']
  let direction = directions[Math.floor(Math.random() * directions.length)]

  if (mode == 0) {
    let sources = ['bus.png', 'truck.png', 'bike.png', 'car.png']
    vehicleType = Math.floor(Math.random() * sources.length)
    source = sources[vehicleType]
  }

  let imgSrc = `./images/${direction}/${source}`

  switch (direction) {
    case 'down':
      trackId = 2 + Math.floor(Math.random() * 2)
      transform = `translateY(${-100 - mapOffsetY}px)`
      break
    case 'right':
      trackId = 4 + Math.floor(Math.random() * 2)
      transform = `translateX(${-100 - mapOffsetX}px)`
      break
    case 'up':
      trackId = 0 + Math.floor(Math.random() * 2)
      transform = `translateY(${868 + mapOffsetY}px)`
      break
    case 'left':
      trackId = 6 + Math.floor(Math.random() * 2)
      transform = `translateX(${868 + mapOffsetX}px)`
      break
    default:
      console.error('Error choosing direction in createVehicle()')
      break
  }

  trackElem = document.querySelector(`#t${trackId}`)

  var img = document.createElement('img')
  img.src = imgSrc

  img.className = `vehicle ${direction}`
  img.id = `vehicle${vehicleId++}`
  img.style.transform = transform
  trackElem.appendChild(img)

  console.log(lastVehicle[trackId] != undefined)
  //   console.log(img.id + ' ' + direction + ' ' + source+' '+lastVehicle[trackId])

  let duration = 15000 + vehicleType * 0.2 * 2000
  animateVehicle(img.id, vehicleType, direction, lastVehicle[trackId], duration)
  lastVehicle[trackId] = img.id
}

function slowDown(id, vehicleType, direction, prevVehicleId, remainingTime) {
  // setTimeout(() => {
  animateVehicle(id, vehicleType, direction, prevVehicleId, remainingTime)
  // }, 5);
}

function trafficController() {
  for (let i = 0; i < 4; i++) {
    signal = document.getElementById(`ts${i}`)
  }
}

trafficController()

function disableAllRed() {
  for (let i = 0; i < 4; i++) {
    signal = document.getElementById(`ts${i}`)
    let redLight = signal.querySelector('.frame .light.red')
    redLight.style.backgroundColor = '#7e7e7e'
  }
}

function disableAllYellow() {
  for (let i = 0; i < 4; i++) {
    signal = document.getElementById(`ts${i}`)
    yellowLight = signal.querySelector('.frame .light.yellow')
    yellowLight.style.backgroundColor = '#7e7e7e'
  }
}

function disableAllGreen() {
  for (let i = 0; i < 4; i++) {
    signal = document.getElementById(`ts${i}`)
    greenLight = signal.querySelector('.frame .light.green')
    greenLight.style.backgroundColor = '#7e7e7e'
  }
}

function enableAllRed() {
  disableAllYellow()
  disableAllGreen()
  for (let i = 0; i < 4; i++) {
    signal = document.getElementById(`ts${i}`)
    redLight = signal.querySelector('.frame .light.red')
    redLight.style.backgroundColor = 'red'
  }
}

enableAllRed()
disableAllGreen()
disableAllYellow()
function enableYellow(signalId) {
  signal = document.getElementById(signalId)
  yellowLight = signal.querySelector('.frame .light.yellow')
  yellowLight.style.backgroundColor = 'yellow'
}

function enableGreen(signalId) {
  signal = document.getElementById(signalId)
  greenLight = signal.querySelector('.frame .light.red')
  greenLight.style.backgroundColor = 'red'
}

function animateVehicle(id, vehicleType, direction, prevVehicleId, duration) {
    const v = document.querySelector(`#${id}`);
    let initialPosition;
    let targetPosition;
    let targetTransform;
    let animationId;
  
    switch (direction) {
      case 'down':
        targetPosition = 868 + mapOffsetY;
        targetTransform = `translateY(${targetPosition}px)`;
        break;
      case 'right':
        targetPosition = 868 + mapOffsetX;
        targetTransform = `translateX(${targetPosition}px)`;
        break;
      case 'up':
        targetPosition = -100 - mapOffsetY;
        targetTransform = `translateY(${targetPosition}px)`;
        break;
      case 'left':
        targetPosition = -100 - mapOffsetX;
        targetTransform = `translateX(${targetPosition}px)`;
        break;
    }
  
    if (direction == 'up' || direction == 'down') {
      initialPosition = v.getBoundingClientRect().y;
    } else if (direction == 'right' || direction == 'left') {
      initialPosition = v.getBoundingClientRect().x;
    }
  
    const startTime = performance.now();
  
    function updatePosition(timestamp) {
      const elapsedTime = timestamp - startTime;
      const progress = elapsedTime / duration;
  
      if (progress >= 1) {
        v.style.transform = targetTransform;
        console.log('Animation complete. Current position:', targetPosition);
        v.remove();
        return;
      }
  
      const newPosition = initialPosition + progress * (targetPosition - initialPosition);
  
      const prevVehicle = document.querySelector(`#${prevVehicleId}`);
      if (prevVehicle && document.contains(prevVehicle)) {
        const prevPosition = direction == 'up' || direction == 'down' ? prevVehicle.getBoundingClientRect().y  : prevVehicle.getBoundingClientRect().x ;
        const currentPos = direction == 'up' || direction == 'down' ? v.getBoundingClientRect().y : v.getBoundingClientRect().x;
        const distance = Math.abs(prevPosition - currentPos);
  
        if (distance < 100) {
          console.log('Animation Paused. Current position:', targetPosition);
          slowDown(id, vehicleType, direction, prevVehicleId, duration - elapsedTime);
          return;
        }
      }
  
      // Continue the animation if it was paused and distance is greater than 100 pixels
      if (direction == 'up' || direction == 'down') {
        v.style.transform = `translateY(${newPosition}px)`;
      } else if (direction == 'right' || direction == 'left') {
        v.style.transform = `translateX(${newPosition}px)`;
      }
  
      // Continue the animation loop regardless of whether it was paused or not
      animationId = requestAnimationFrame(updatePosition);
    }
  
    animationId = requestAnimationFrame(updatePosition);
  }
  

// // Start the animation loop
// animateVehicle(); // You need to call this function somewhere to start the animation loop

// Call the function to start the animation
// animateElement();

createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)
createVehicle(0)

setInterval(() => {
  createVehicle(0)
}, 2000)
