<template>
  <div id="pixi"></div>
</template>

<script>
import * as PIXI from 'pixi.js'
export default {
  mounted() {
    const pixi = new PIXI.Application({ antialias: true });
    document.getElementById('pixi').appendChild(pixi.view);

    const graphics = new PIXI.Graphics();

    // Circle
    graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphics.beginFill(0xDE3249, 1);
    graphics.drawCircle(100, 250, 50);
    graphics.endFill();

    // Circle + line style 1
    graphics.lineStyle(2, 0xFEEB77, 1);
    graphics.beginFill(0x650A5A, 1);
    graphics.drawCircle(250, 250, 50);
    graphics.endFill();

    // Circle + line style 2
    graphics.lineStyle(10, 0xFFBD01, 1);
    graphics.beginFill(0xC34288, 1);
    graphics.drawCircle(400, 250, 50);
    graphics.endFill();

    // draw a rounded rectangle
    graphics.lineStyle(2, 0xFF00FF, 1);
    graphics.beginFill(0x650A5A, 0.25);
    graphics.drawRoundedRect(50, 440, 100, 100, 25);
    graphics.endFill();

    pixi.stage.addChild(graphics);
  }
}
</script>

<style>

</style>