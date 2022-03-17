
const canvas = document.getElementById('view');
const ctx = canvas.getContext('2d');

const screenWidth = 400;
const screenHeight = 400;
const depthAdjuster = 0.01;

const worldData = {
  baseUnit: 20,
};
const objects = [{
  metaData: {
    name: 'Morgans Object',
    description: 'YES',
    version: '0.0.0'
  },
  position: {
    x: -50,
    y: -50,
    z: 50
  },
  rotation: {
    x: 0,
    y: 45,
    z: 0,
  },
  color: 'red',
  size: {
    x: 100,
    y: 100,
    z: 100 * (depthAdjuster * 10)
  }
}];

const renderSegment = (x1, y1, x2, y2) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = 'red';
  ctx.stroke();
};

const projectWorldPointToScreenPoint = (x, y, z, rotX, rotY, rotZ) => {
  const zAdjustedX = z === 0 ? x : x / (z * depthAdjuster);
  const zAdjustedY = z === 0 ? y : y / (z * depthAdjuster);
  const canvasAdjustedX = zAdjustedX + screenWidth / 2;
  const canvasAdjustedY = zAdjustedY + screenWidth / 2;
  return [canvasAdjustedX, canvasAdjustedY];
}

const renderObject = (object) => {
  ctx.fillStyle = object.color;

  const a1 = projectWorldPointToScreenPoint(
    object.position.x,
    object.position.y,
    object.position.z,
    object.rotation.x,
    object.rotation.y,
    object.rotation.z,
  );

  const b1 = projectWorldPointToScreenPoint(
    object.position.x + object.size.x,
    object.position.y,
    object.position.z,
    object.rotation.x,
    object.rotation.y,
    object.rotation.z,
  );

  const c1 = projectWorldPointToScreenPoint(
    object.position.x,
    object.position.y + object.size.y,
    object.position.z,
    object.rotation.x,
    object.rotation.y,
    object.rotation.z,
  );

  const d1 = projectWorldPointToScreenPoint(
    object.position.x + object.size.x,
    object.position.y + object.size.y,
    object.position.z,
    object.rotation.x,
    object.rotation.y,
    object.rotation.z,
  );

  const a2 = projectWorldPointToScreenPoint(
    object.position.x,
    object.position.y,
    object.position.z + object.size.z,
    object.rotation.x,
    object.rotation.y,
    object.rotation.z,
  );

  const b2 = projectWorldPointToScreenPoint(
    object.position.x + object.size.x,
    object.position.y,
    object.position.z + object.size.z,
    object.rotation.x,
    object.rotation.y,
    object.rotation.z,
  );

  const c2 = projectWorldPointToScreenPoint(
    object.position.x,
    object.position.y + object.size.y,
    object.position.z + object.size.z,
    object.rotation.x,
    object.rotation.y,
    object.rotation.z,
  );

  const d2 = projectWorldPointToScreenPoint(
    object.position.x + object.size.x,
    object.position.y + object.size.y,
    object.position.z + object.size.z,
    object.rotation.x,
    object.rotation.y,
    object.rotation.z,
  );

  renderSegment(...a1, ...a2);
  renderSegment(...b1, ...b2);
  renderSegment(...c1, ...c2);
  renderSegment(...d1, ...d2);

  renderSegment(...a1, ...b1);
  renderSegment(...a1, ...c1);
  renderSegment(...b1, ...d1);
  renderSegment(...c1, ...d1);

  renderSegment(...a2, ...c2);
  renderSegment(...b2, ...d2);
  renderSegment(...a2, ...b2);
  renderSegment(...c2, ...d2);
}

const keysPressed = {
  w: false,
  a: false,
  s: false,
  d: false,
  q: false,
  e: false,
};

window.addEventListener('keypress', e => {
  keysPressed[e.key] = true;
});

window.addEventListener('keyup', e => {
  keysPressed[e.key] = false;
});

let adjuster = 3;
const loop = () => {

  ctx.fillStyle = '#222222';
  ctx.fillRect(0, 0, 500, 500);
  objects.forEach(renderObject);

  const input = [0, 0, 0];
  if (keysPressed.w) {
    input[1]--;
  }
  if (keysPressed.s) {
    input[1]++;
  }
  if (keysPressed.q) {
    input[2]++;
  }
  if (keysPressed.e) {
    input[2]--;
  }
  if (keysPressed.a) {
    input[0]--;
  }
  if (keysPressed.d) {
    input[0]++;
  }

  objects[0].position.z += adjuster * input[2];
  objects[0].position.y += adjuster * input[1];
  objects[0].position.x += adjuster * input[0];
}


loop();

let playing = false;

function togglePlay() {
  if (playing) {
    clearInterval(interval);
    playing = false;
    return;
  }
  interval = setInterval(loop, 25);
  playing = true;
  return;
}
togglePlay();

