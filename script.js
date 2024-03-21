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
var trafficPassed = false
var signalState = [0, 0, 0, 0]

// console.log(ts0.redLight)

var prevVehicle = new Array(8)

function getSignalState(signal) {
  return signalState[signal]
}

function createVehicle(mode) {
  let source
  let trackId
  let trackElem
  let transform
  let vehicleType
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

  // console.log(prevVehicle[trackId] != undefined)
  //   console.log(img.id + ' ' + direction + ' ' + source+' '+prevVehicle[trackId])

  let duration = 15000 + vehicleType * 0.2 * 2000
  animateVehicle(img.id, vehicleType, direction, prevVehicle[trackId], duration, trafficPassed)
  prevVehicle[trackId] = img.id
}

function slowDown(id, vehicleType, direction, prevVehicleId, remainingTime, trafficPassed) {
  animateVehicle(id, vehicleType, direction, prevVehicleId, remainingTime > 12500 ? 12500 : remainingTime + 10, trafficPassed)
}

function trafficController() {
  let i = 0
  switchSignals(i++)

  setInterval(() => {
    switchSignals(i)
    i = (i + 1) % 4 // Increment i and ensure it wraps around from 3 back to 0
  }, 18000)
}

function switchSignals(i) {
  var currCounter = document.getElementById(`tsc${i}`);
  var readyCounter = document.getElementById(`tsc${(i+1)%4}`);
  var readyCount = 10,
    goCount = 10,
    slowCount = 4;

  setTimeout(() => {
    signalState[i] = 1;
    var goInterval = setInterval(() => {
      if (goCount > -1) {
        currCounter.innerText = goCount;
        goCount--;
      } else {
        currCounter.innerText = '5';
        clearInterval(goInterval);
      }
    }, 999);
    enableGreen(i);
    // checkTraffic(signalState) // Pass the signalState array to checkTraffic
  }, 0);

  setTimeout(() => {
    var readyInterval = setInterval(() => {
      if (readyCount > -1) { // Correct condition for countdown
        readyCounter.innerText = readyCount;
        readyCount--;
      } else {
        currCounter.innerText = '10';
        clearInterval(readyInterval);
      }
    }, 999);
  }, 5999);

  setTimeout(() => {
    signalState[i] = 2;
    var slowInterval = setInterval(() => {
      if (slowCount > -1) {
        currCounter.innerText = slowCount;
        slowCount--;
        console.log(slowCount);
      } else {
        currCounter.innerText = '--';
        clearInterval(slowInterval);
      }
    }, 1000);
    enableYellow(i);
    // checkTraffic(signalState) // Pass the signalState array to checkTraffic
  }, 11999);

  setTimeout(() => {
    signalState[i] = 0; // Update signal state to red
    enableRed(i);
    // console.log(signalState)
    // checkTraffic(signalState) // Pass the signalState array to checkTraffic
  }, 17999);
}


trafficController()

function disableRed(i) {
  signal = document.getElementById(`ts${i}`)
  redLight = signal.querySelector('.frame .light.red')
  redLight.style.backgroundColor = '#7e7e7e'
  signalState[i] = -1
}

function disableYellow(i) {
  signal = document.getElementById(`ts${i}`)
  yellowLight = signal.querySelector('.frame .light.yellow')
  yellowLight.style.backgroundColor = '#7e7e7e'
  signalState[i] = -1
}

function disableGreen(i) {
  signal = document.getElementById(`ts${i}`)
  greenLight = signal.querySelector('.frame .light.green')
  greenLight.style.backgroundColor = '#7e7e7e'
  signalState[i] = -1
}

function enableRed(i) {
  signal = document.getElementById(`ts${i}`)
  disableYellow(i)
  redLight = signal.querySelector('.frame .light.red')
  redLight.style.backgroundColor = 'red'
  signalState[i] = 0
}

function enableYellow(i) {
  signal = document.getElementById(`ts${i}`)
  //   disableRed(i)
  disableGreen(i)
  yellowLight = signal.querySelector('.frame .light.yellow')
  yellowLight.style.backgroundColor = 'yellow'
  signalState[i] = 2
}

function enableGreen(i) {
  signal = document.getElementById(`ts${i}`)
  disableRed(i)
  greenLight = signal.querySelector('.frame .light.green')
  greenLight.style.backgroundColor = '#39d600'
  signalState[i] = 1
}

async function checkTraffic(id, vehicleType, direction, prevVehicleId, remainingTime, trafficPassed, signal) {
  // console.log(id);
  let currentSignal = getSignalState(signal)
  if (currentSignal === 1) {
    // Check if the signal is green
    trafficPassed = true
    // console.log(signal);
    animateVehicle(id, vehicleType, direction, prevVehicleId, 9000 + vehicleType * 0.2 * 2000, trafficPassed)
  }
  animateVehicle(id, vehicleType, direction, prevVehicleId, 9000 + vehicleType * 0.2 * 2000, trafficPassed)

  // }

  setTimeout(() => {}, 1)
}

function animateVehicle(id, vehicleType, direction, prevVehicleId, duration, trafficPassed) {
  // console.log(id);
  const v = document.querySelector(`#${id}`)
  let initialPosition
  let targetPosition
  let targetTransform
  let animationId

  switch (direction) {
    case 'down':
      targetPosition = 868 + mapOffsetY
      targetTransform = `translateY(${targetPosition}px)`
      break
    case 'right':
      targetPosition = 868 + mapOffsetX
      targetTransform = `translateX(${targetPosition}px)`
      break
    case 'up':
      targetPosition = -100 - mapOffsetY
      targetTransform = `translateY(${targetPosition}px)`
      break
    case 'left':
      targetPosition = -100 - mapOffsetX
      targetTransform = `translateX(${targetPosition}px)`
      break
  }

  if (direction == 'up' || direction == 'down') {
    initialPosition = v.getBoundingClientRect().y
  } else if (direction == 'right' || direction == 'left') {
    initialPosition = v.getBoundingClientRect().x
  }

  const startTime = performance.now()

  function updatePosition(timestamp) {
    const elapsedTime = timestamp - startTime
    const progress = elapsedTime / duration

    if (progress >= 1) {
      v.style.transform = targetTransform
      // console.log('Animation complete. Current position:', targetPosition)
      v.remove()
      return
    }

    const newPosition = initialPosition + progress * (targetPosition - initialPosition)

    const prevVehicle = document.querySelector(`#${prevVehicleId}`)

    switch (direction) {
      case 'up':
        if (!trafficPassed && v.getBoundingClientRect().y - mapOffsetY < 448) {
          // console.log(id);

          checkTraffic(id, vehicleType, direction, prevVehicleId, duration + 10, trafficPassed, 0)
          return
        }
        if (trafficPassed && v.getBoundingClientRect().y + v.clientHeight - mapOffsetY < 10) {
          v.remove()
        }
        break

      case 'down':
        if (!trafficPassed && v.getBoundingClientRect().y + v.clientHeight - mapOffsetY > 320) {
          checkTraffic(id, vehicleType, direction, prevVehicleId, duration - elapsedTime + 10, trafficPassed, 2)
          return
        }
        if (trafficPassed && v.getBoundingClientRect().y + v.clientHeight - mapOffsetY > 778) {
          v.remove()
        }
        break

      case 'left':
        if (!trafficPassed && v.getBoundingClientRect().x - v.clientWidth - mapOffsetX < 400) {
          checkTraffic(id, vehicleType, direction, prevVehicleId, duration - elapsedTime + 10, trafficPassed, 3)
          return
        }
        if (trafficPassed && v.getBoundingClientRect().x - v.clientWidth - mapOffsetX < 10) {
          v.remove()
        }
        break
      case 'right':
        if (!trafficPassed && v.getBoundingClientRect().x + v.clientWidth - mapOffsetX > 320) {
          checkTraffic(id, vehicleType, direction, prevVehicleId, duration - elapsedTime + 10, trafficPassed, 1)
          return
        }
        if (trafficPassed && v.getBoundingClientRect().x + v.clientWidth - mapOffsetX > 778) {
          v.remove()
        }
        break
    }

    if (prevVehicle && document.contains(prevVehicle)) {
      const distance =
        direction == 'up'
          ? v.getBoundingClientRect().y - prevVehicle.getBoundingClientRect().y - prevVehicle.clientHeight
          : direction == 'down'
          ? prevVehicle.getBoundingClientRect().y - v.clientHeight - v.getBoundingClientRect().y
          : direction == 'left'
          ? v.getBoundingClientRect().x - prevVehicle.getBoundingClientRect().x - prevVehicle.clientWidth
          : direction == 'right'
          ? prevVehicle.getBoundingClientRect().x - v.getBoundingClientRect().x - v.clientWidth
          : null

      //   const distance = Math.abs(prevPosition - currentPos)

      // const position
      if (distance < 10) {
        // console.log('Animation Paused. Current position:', targetPosition)
        if (trafficPassed) {
          slowDown(id, vehicleType, direction, prevVehicleId, duration - elapsedTime + 10, trafficPassed)
        } else {
          slowDown(id, vehicleType, direction, prevVehicleId, duration + 10, trafficPassed)
        }
        return
      }

      //   console.log(prevVehicleId, ' ', prevPosition, ' ', id, ' ', newPosition)
    }

    // Continue the animation if it was paused and distance is greater than 100 pixels
    if (direction == 'up' || direction == 'down') {
      v.style.transform = `translateY(${newPosition}px)`
    } else if (direction == 'right' || direction == 'left') {
      v.style.transform = `translateX(${newPosition}px)`
    }

    // Continue the animation loop regardless of whether it was paused or not
    animationId = requestAnimationFrame(updatePosition)
  }

  animationId = requestAnimationFrame(updatePosition)
}

// // Start the animation loop
// animateVehicle(); // You need to call this function somewhere to start the animation loop

// Call the function to start the animation
// animateElement();

createVehicle(0)
// createVehicle(0)
// createVehicle(0)
// createVehicle(0)
// createVehicle(0)
// createVehicle(0)
// createVehicle(0)
// createVehicle(0)
// createVehicle(0)
// createVehicle(0)
// // createVehicle(0)
// // createVehicle(0)
// // createVehicle(0)
// // createVehicle(0)

// createVehicle(0)
// setInterval(() => {
//   createVehicle(0)
// }, 5000)
