<template>
<div id="thing"></div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)

import Two from 'https://cdn.skypack.dev/two.js@latest';

const colors = [
  'rgb(0, 0, 0)',
  'rgb(255, 255, 255)',
  'rgb(150, 150, 150)',
  'rgb(0, 191, 168)',
  'rgb(153, 102, 255)',
  'rgb(300, 144, 95)',
  'rgb(500, 450, 40)'
];

var two = new Two({
  type: Two.Types.svg,
  fullscreen: true,
  autostart: true
}).appendTo(document.body);

two.renderer.domElement.style.background = colors[6];
two.renderer.domElement.style.cursor = 'none';


var cx = two.width / 2;
var cy = two.height / 2;
var delta = new Two.Vector();
var mouse = new Two.Vector(cx, cy);
var drag = 0.33;
var ballRadius = 25;


let x1 = 0;
let y1 = - cy;
const x2 = 0;
const y2 = cy;
x1 = 0;
y1 = 0;
let lightRadius = Math.max(two.width, two.height);
let gradient = two.makeRadialGradient(x1, y1, lightRadius,
  new Two.Stop(0, colors[1], 1),
  new Two.Stop(0.5, colors[5], 0)
);
gradient.units = 'userSpaceOnUse';

const rectangle = two.makeRectangle(cx, cy, two.width, two.height);
rectangle.noStroke();
rectangle.fill = gradient;

const vignette = two.makeRectangle(cx, cy, two.width, two.height);
vignette.noStroke();
vignette.fill = gradient;
// two.renderer.domElement.addEventListener('pointermove', pointermove, false);
two.bind('resize', resize).bind('update', update);

// function pointermove(e) {
//   mouse.set(e.clientX, e.clientY);
// }
function resize() {

  const cx = two.width / 2;
  const cy = two.height / 2;

  let gradient = rectangle.fill;
  // gradient.left.y = - cy;
  // gradient.right.y = cy;

  // Set the size of the rectangle
  // to the size of the canvas.
  vignette.width = two.width;
  vignette.height = two.height;

  // Center rectangle.
  vignette.translation.copy(rectangle.translation);

  // Update the lightRadius variable
  // to accurately reflect the size
  // during the `update` handler.
  lightRadius = Math.max(two.width, two.height);
}


function update(frameCount) {

  let gradient = vignette.fill;
  const cx = two.width / 2;
  const cy = two.height / 2;

  const oscillation = 0.5 * (Math.sin(frameCount / 60) + 1);
  const r25 = lightRadius * 0.25;
  const r75 = lightRadius * 0.75;

  // Make the radial gradient oscillate
  gradient.lightRadius = r25 * oscillation + r75;

  const destX = mouse.x - cx;
  const destY = mouse.y - cy;

  delta.set(destX, destY)
       .sub(gradient.center)
       .multiplyScalar(0.125);  // Used to "ease" into dest

  // Move the gradient's center
  // toward the mouse as a kind
  // of "look at" behavior.
  gradient.center.add(delta);

  delta.copy(mouse).subSelf(ball.translation);
  

  for (var i = 0; i < ball.vertices.length; i++) {
    var v = ball.vertices[i];
    var dist = v.origin.distanceTo(delta);
    var pct = dist / ballRadius;

    var x = delta.x * pct;
    var y = delta.y * pct;

    var destx = v.origin.x - x;
    var desty = v.origin.y - y;

    v.x += (destx - v.x) * drag;
    v.y += (desty - v.y) * drag;
  }
  if (delta.x != 0 || delta.y != 0) {
    ball.translation.addSelf(delta);
    // ball.translation.x = ball.translation.x % two.width + delta.x;
    // ball.translation.y = ball.translation.y % two.height + delta.y;
    if (ball.opacity != 1) {
      ball.opacity = 1
    }
  } else if (ball.opacity != 0) {
    ball.opacity = 0
  }

}


var shape = new Two.Circle(0, 0, ballRadius, 16);
// var shape = new Two.Rectangle(0, 0, ballRadius * 2, ballRadius * 2);


var ball = new Two.Path(shape.vertices, true, true);
ball.position.set(cx, cy);
ball.noStroke().fill = 'white';

for (var i = 0; i < ball.vertices.length; i++) {
  var v = ball.vertices[i];
  v.origin = v.clone();
}

two.add(ball);

window.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}, false);

window.addEventListener('touchstart', function() {
  e.preventDefault();
  return false;
}, false);

window.addEventListener('touchmove', function(e) {
  e.preventDefault();
  var touch = e.changedTouches[0];
  mouse.x = touch.pageX;
  mouse.y = touch.pageY;
  return false;
}, false);

</script>

<style scoped>
* {
  box-sizing: border-box;
  user-select: none;
}

a {
  color: #42b983;
}
</style>
