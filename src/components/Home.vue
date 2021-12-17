<template>
  <div class="container">
    <q-toolbar class="bg-transparent">
      <div class="menu">
        <span class="btn">
          {{years + ' años'}}
          <q-menu>
            <q-list>
              <q-item
                dense
                v-for="y in allYears"
                :key="'y-' + y"
                clickable
                v-close-popup
                @click="yearsSelected(y)"
              >
                <q-item-section>{{ y }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </span>
        <span>en</span>
        <span class="btn">
          {{mode}}
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                dense
                v-for="m in modes"
                :key="m"
                clickable
                v-close-popup
                @click="modeSelected(m)"
              >
                <q-item-section>{{ m }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </span>
        <span>desde</span>
        <span class="btn">
          {{formattedBirthday}}
          <q-popup-proxy>
            <q-date
              v-model="birthday"
              landscape
              minimal
            />
          </q-popup-proxy>
        </span>
      </div>
    </q-toolbar>
    <canvas id="dots">Your browser does not support canvas.</canvas>
    <div class="info">
      {{`${cols} x ${rows}`}}
    </div>
  </div>
</template>

<script>
import { format, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns'
export default {
  data() {
    return {
      total: 0,
      livedUnits: 0,
      birthday: '1992/04/14',
      canvas: null,
      mode: "Semanas",
      modes: ["Años", "Meses", "Semanas", "Dias"],
      years: 80,
      allYears: [10, 20, 30, 40, 50, 60, 70, 80, 90],
      colors: ['#303030', '#858585', '#2BAD5D', '#2ABABF', '#CDDC28', '#B91E8C'],
      dotMargin: 2,
      rows: 0,
      cols: 0,
      context: null,
    };
  },
  mounted () {
    this.canvas = document.getElementById('dots');
    this.context = this.canvas.getContext('2d');
    this.resizeCanvas()

    window.addEventListener('resize', this.resizeCanvas, false);

  },
  computed: {
    formattedBirthday() {
      return format(new Date(this.birthday), 'PP')
    }
  },
  methods: {
    drawCanvas() {
      switch (this.mode) {
        case 'Meses':
          this.total = this.years * 12
          this.livedUnits = differenceInMonths(new Date(), new Date(this.birthday))
          break;
        case 'Semanas':
          this.total = this.years * 12 * 4
          this.livedUnits = differenceInWeeks(new Date(), new Date(this.birthday))
          break;
        case 'Dias':
          this.total = this.years * 12 * 4 * 7
          this.livedUnits = differenceInDays(new Date(), new Date(this.birthday))
          break;
        default:
          this.livedUnits = differenceInYears(new Date(), new Date(this.birthday))
          this.total = this.years
          break;
      }

      const getMaxSizeOfSquaresInRect = (n,w,h) => {
        var sw, sh;
        var pw = Math.ceil(Math.sqrt(n*w/h));
        if (Math.floor(pw*h/w)*pw < n) sw = h/Math.ceil(pw*h/w);
        else sw = w/pw;
        var ph = Math.ceil(Math.sqrt(n*h/w));
        if (Math.floor(ph*w/h)*ph < n) sh = w/Math.ceil(w*ph/h);
        else sh = h/ph;
        return Math.max(sw,sh);
      }

      const cellSize = getMaxSizeOfSquaresInRect(this.total, this.canvas.width, this.canvas.height)

      this.cols = Math.floor(this.canvas.width / cellSize)
      this.rows = Math.floor(this.canvas.height / cellSize)

      let dotWidth = ((this.canvas.width - (2 * this.dotMargin)) / this.cols) - this.dotMargin;
      let dotHeight = ((this.canvas.height - (2 * this.dotMargin)) / this.rows) - this.dotMargin;
      let xMargin = 0;
      let yMargin = 0;
      let dotDiameter = 1;

      if( dotWidth > dotHeight ) {
        dotDiameter = dotHeight;
        xMargin = (this.canvas.width - ((2 * this.dotMargin) + (this.cols * dotDiameter))) / this.cols;
        yMargin = this.dotMargin;
      } else {
        dotDiameter = dotWidth;
        xMargin = this.dotMargin;
        yMargin = (this.canvas.height - ((2 * this.dotMargin) + (this.rows * dotDiameter))) / this.rows;
      }
      const dotRadius = dotDiameter * 0.5;

      let count = 0

      for(let i = 0; i < this.rows; i++) {
        for(let j = 0; j < this.cols; j++) {
          const x = (j * (dotDiameter + xMargin)) + this.dotMargin + (xMargin / 2) + dotRadius;
          const y = (i * (dotDiameter + yMargin)) + this.dotMargin + (yMargin / 2) + dotRadius;
          // const x = (j * dotDiameter) + this.dotMargin + dotRadius;
          // const y = (i * dotDiameter) + this.dotMargin + dotRadius;
          // Grab a random color from the array.
          // const color = this.colors[Math.floor(i % this.colors.length)];
          let color = '#ffffff'
          if (count > this.livedUnits) {
            color = this.colors[0]
          } else if (count > this.total) {
            color = '#ffffff'
          } else {
            color = this.colors[1]
          }
          this.drawDot(x, y, dotRadius, color);
          count++;
        }
      }
    },
    resizeCanvas () {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight - 60;
      this.debounce(this.drawCanvas(), 1000, false)
    },
    drawDot (x, y, radius, color) {
      this.context.beginPath();
      this.context.arc(x, y, radius, 0, 2 * Math.PI, false);
      this.context.fillStyle = color;
      this.context.fill();
    },
    yearsSelected (submission) {
      this.years = submission;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawCanvas()
    },
    modeSelected (submission) {
      this.mode = submission;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawCanvas()
    },
    debounce (func, wait, immediate) {
      var timeout;
      return function () {
        var context = this, args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  },
  watch: {
    birthday() {
      this.drawCanvas()
    }
  }
};
</script>

<style lang="scss">
.container {
  margin: 0;
  padding: 0;
}
canvas.dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@font-face {
  font-family: 'Patrick Hand';
  src: url('./PatrickHand-Regular.ttf');
}

.menu {
  margin: auto;
  font-family: 'Patrick Hand';
  font-size: 1.3rem;
  user-select: none;
  text-transform: uppercase;
  span {
    margin-right: 1rem;
    &.btn {
      font-weight: bold;
      cursor: pointer;
    }
  }
}

.block, .q-item {
  text-transform: uppercase;
  font-family: 'Patrick Hand';
  font-size: 1.14rem;
}

.info {
  font-size: 0.55rem;
  color: #303030;
  opacity: 0.5;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>