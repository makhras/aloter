<template>
  <div class="container">
    <q-toolbar class="bg-transparent">
      <q-btn round flat dense icon="circle">
        <q-popup-proxy>
          <q-card class="my-card">
            <q-card-section>
              <div class="text-h6">Aloter</div>
              <div class="text-subtitle2">by M. Akhras</div>
            </q-card-section>
            <q-card-section>
              Comprehend your time allottance.
            </q-card-section>
            <q-card-section>
              <a href="https://github.com/makhras/aloter" target="_blank" rel="noopener noreferrer">More Info (repo)</a>
            </q-card-section>
          </q-card>
        </q-popup-proxy>
      </q-btn>
      <div class="menubar">
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
          {{modeLabel}}
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                dense
                v-for="m in modes"
                :key="'mode-'+m.id"
                clickable
                v-close-popup
                @click="modeSelected(m)"
              >
                <q-item-section>{{ m.label }}</q-item-section>
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
              @update:model-value="birthdaySelected"
            />
          </q-popup-proxy>
        </span>
      </div>
      <q-btn flat round dense icon="send">
        <q-popup-proxy>
          <q-list class="q-pb-md">
            <q-item-label header class="patrick md" >
              Share
            </q-item-label>
            <q-item dense clickable v-ripple>
              <q-item-section side>
                <q-icon name="mail_outline" />
              </q-item-section>
              <q-item-section>By Email</q-item-section>
            </q-item>
            <q-item dense clickable v-ripple>
              <q-item-section side>
                <q-icon name="content_copy" />
              </q-item-section>
              <q-item-section>Copy Link</q-item-section>
            </q-item>
          </q-list>
        </q-popup-proxy>
      </q-btn>
    </q-toolbar>
    <canvas id="dots">Your browser does not support canvas.</canvas>
    <div class="info">
      {{`${cols} x ${rows}`}}
    </div>
  </div>
</template>

<script>
import { format, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns'
import { get, set } from 'idb-keyval'

export default {
  data() {
    return {
      lang: 'en',
      total: 0,
      livedUnits: 0,
      birthday: '1992/04/14',
      canvas: null,
      mode: "w",
      modes: [
        {
          id: 'y',
          label: 'years'
        },
        {
          id: 'm',
          label: 'months'
        },
        {
          id: 'w',
          label: 'weeks'
        },
        {
          id: {
            en: 'd',
            es: 'd',
          },
          label: 'days'
        },
      ],
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
    
    this.getBirthday(this.$route.query.b || this.$route.query.c)
    this.getMode(this.$route.query.m)
    this.getYears(this.$route.query.t || this.$route.query.y || this.$route.query.a)

    window.addEventListener('resize', this.resizeCanvas, false);
    
  },
  computed: {
    formattedBirthday() {
      return format(new Date(this.birthday), 'PP').toLocaleLowerCase()
    },
    modeLabel() {
      return this.modes.find(m=>m.id == this.mode).label
    },
  },
  methods: {
    async getBirthday(query) {
      console.log('query: ', query);
      if (query) {
        this.birthday = query.substring(0,4) + '/' + query.substring(4,6) + '/' + query.substring(6,8)
      } else {
        const savedBirthday = await get('birthday')
        if (savedBirthday) {
          this.birthday = savedBirthday
        }
        console.log('savedBirthday ', savedBirthday);
      }
    },
    async getMode(query) {
      if (query) {
        this.mode = query
      } else {
        const savedMode = await get('mode')
        if (savedMode) {
          this.mode = savedMode
        }
        console.log('savedMode ', savedMode);
      }
    },
    async getYears(query) {
      if (query) {
        this.years = query
        console.log('this.years', this.years);
      } else {
        const savedYears = await get('years')
        if (savedYears) {
          this.years = savedYears
        }
        console.log('savedYears ', savedYears);
      }
    },
    drawCanvas() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      switch (this.mode) {
        case 'm':
          this.total = this.years * 12
          this.livedUnits = differenceInMonths(new Date(), new Date(this.birthday))
          break;
        case 's':
        case 'w':
          this.total = this.years * 12 * 4
          this.livedUnits = differenceInWeeks(new Date(), new Date(this.birthday))
          break;
        case 'd':
          this.total = this.years * 12 * 4 * 7
          this.livedUnits = differenceInDays(new Date(), new Date(this.birthday))
          break;
        case 'a':
        case 'y':
        case 't':
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
      this.$router.replace({query: {...this.$route.query, t: this.years}})
    },
    modeSelected (submission) {
      this.mode = submission.id;
      this.$router.replace({query: {...this.$route.query, m: this.mode}})
    },
    birthdaySelected(newBday) {
      const urlifiedBday = newBday.substring(0,4) + newBday.substring(5,7) + newBday.substring(8,10)
      this.$router.replace({query: {...this.$route.query, b: urlifiedBday}})
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
    birthday(newBday) {
      set('birthday', newBday)
      this.drawCanvas()
    },
    years(newYears) {
      set('years', newYears)
      this.drawCanvas()
    },
    mode(newMode) {
      set('mode', newMode)
      this.drawCanvas()
    },
    $route (to, from) {
      console.log('from: ', from);
      console.log('to: ', to);
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
  src: url('./PatrickHand-Regular.woff'),
       url('./PatrickHand-Regular.tff');
}

.menubar {
  margin: auto;
  font-family: 'Patrick Hand', Arial, Helvetica, sans-serif;
  font-size: 1rem;
  user-select: none;
  text-transform: uppercase;
  padding-left: 1em;
  // border-bottom: 1px dashed dimgray;
  span {
    margin-right: 1rem;
    &.btn {
      font-weight: bold;
      cursor: pointer;
    }
  }
}
.patrick {
  font-family: 'Patrick Hand';
  &.md {
    font-size: 1.2rem;
  }
}

.block, .q-item {
  // text-transform: uppercase;
  font-family: 'Patrick Hand';
  font-size: 1.1rem;
}

.info {
  font-size: 0.55rem;
  color: #141414;
  opacity: 0.5;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>