<template>
  <div class="container">
    <q-toolbar class="bg-transparent">
      <div :class="dark?'menubar dark':'menubar'">
        <q-btn rounded flat dense size="0.8rem" class="btn">
          {{`${years} ${$t('years')}`}}
          <q-popup-proxy fit anchor="bottom left" self="top left" >
            <q-card>
              <q-list>
                <q-item
                  dense
                  v-for="y in allYears"
                  :key="'y-' + y"
                  clickable
                  v-close-popup
                  @click="yearsSelected(y)"
                  :class="years==y?'yearItem active':'yearItem'"
                >
                  <q-item-section :class="dark?'menuLabel dark':'menuLabel'">{{ y }}</q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-popup-proxy>
        </q-btn>
        <span class="text-uppercase">{{$t('from')}}</span>
        <q-btn rounded flat dense size="0.8rem" class="btn">
          {{formattedBirthday}}
          <q-popup-proxy anchor="bottom middle" self="top middle">
            <q-date
              dense
              v-model="birthday"
              landscape
              minimal
              :locale="currentLocale"
              @update:model-value="birthdaySelected"
            />
          </q-popup-proxy>
        </q-btn>
        <span class="text-uppercase">{{$t('in')}}</span>
        <q-btn rounded flat dense size="0.8rem" class="btn modeBtn">
          {{modeLabel}}
          <q-popup-proxy anchor="bottom middle" self="top middle">
            <q-card>
              <q-list style="min-width: 100px">
                <q-item
                  dense
                  v-for="m in modes"
                  :key="'mode-'+m.id"
                  clickable
                  v-close-popup
                  @click="modeSelected(m)"
                  :class="mode==m.id?'modeItem active':'modeItem'"
                >
                  <q-item-section :class="dark?'menuLabel dark':'menuLabel'">{{ $t(m.label) }}</q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-popup-proxy>
        </q-btn>
      </div>
      <q-btn round flat dense size="0.8rem" icon="scatter_plot" class="menuBtn">
        <q-popup-proxy>
          <q-card class="my-card">
            <q-card-section>
              <div class="flex">
                <div class="text-h6">Aloter</div>
                <q-space />
                <q-btn flat round dense icon="send">
                  <q-popup-proxy>
                    <q-card class="my-card">
                      <q-list class="q-pb-md">
                        <q-item clickable v-ripple>
                          <q-item-label header class="patrick md" >
                            {{$t('share')}}???
                          </q-item-label>
                          <q-item-section side>
                            <q-icon name="mail_outline" />
                          </q-item-section>
                          <q-item-section>{{$t('byEmail')}}</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple>
                          <q-item-section side>
                            <q-icon name="content_copy" />
                          </q-item-section>
                          <q-item-section>{{$t('copyLink')}}</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple>
                          <q-item-section side>
                            <q-icon name="download" />
                          </q-item-section>
                          <q-item-section>{{$t('downloadImage')}}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-card>
                  </q-popup-proxy>
                  <q-tooltip :delay="500" self="center right" anchor="center left">
                    {{$t('share')}}
                  </q-tooltip>
                </q-btn>
              </div>
            </q-card-section>
            <q-list>
              <q-item tag="label">
                <q-item-section side >
                  <q-checkbox v-model="dark"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{$t('darkMode')}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item tag="label">
                <q-item-section side >
                  <q-checkbox v-model="colored"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{$t('colors')}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <div class="text-center">
                    <q-icon name="public"/> {{langLabel}}
                  </div>
                </q-item-section>
                <q-menu fit>
                  <q-list class="text-center">
                    <q-item clickable v-close-popup :class="lang==='en'?'modeItem active':'modeItem'" @click="setLang('en')">
                      <q-item-section :class="dark?'menuLabel dark':'menuLabel'">{{$t('english')}}</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup :class="lang==='es'?'modeItem active':'modeItem'" @click="setLang('es')">
                      <q-item-section :class="dark?'menuLabel dark':'menuLabel'">{{$t('spanish')}}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </q-list>
            <q-card-section>
              {{ new Date().getFullYear() }} &copy; Mario Akhras
            </q-card-section>
          </q-card>
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
import moment from 'moment/min/moment-with-locales'
import { get, set } from 'idb-keyval'
// import 'moment/locale/es'
// import { useQuasar } from 'quasar'

export default {
  data() {
    return {
      lang: 'en',
      languages: [
        {
          id: 'en',
          label: 'english'
        },
        {
          id: 'es',
          label: 'spanish'
        },
      ],
      esLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        firstDayOfWeek: 1
      },
      enLocale: {
        /* starting with Sunday */
        days: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        daysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        months: 'January_Febrary_March_April_May_June_July_August_September_October_November_December'.split('_'),
        monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        firstDayOfWeek: 1
      },
      dark: false,
      colored: false,
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
        // {
        //   id: 'd',
        //   label: 'days'
        // },
      ],
      years: 80,
      allYears: [10, 20, 30, 40, 50, 60, 70, 80, 90],
      colors: {
        black: '#000000', 
        white: '#ffffff',
        dimBlack: '#00000080',
        dimWhite: '#ffffff99',
        transparent: '#00000000',
        childhood: '#23DBF7',
        teenhood: '#14E066',
        adulthood: '#8800FE',
        oldhood: '#F89716',
        past: '#ffffff70',
        future: '#ffffffdb',
      },
      dotMargin: 0,
      rows: 0,
      cols: 0,
      context: null,
    };
  },
  mounted () {
    this.canvas = document.getElementById('dots');
    this.context = this.canvas.getContext('2d');

    this.resizeCanvas(true)
    this.getSettings()
    

    window.addEventListener('resize', this.resizeCanvas, false);
    
  },
  computed: {
    currentLocale() {
      switch (this.lang){
        case 'en':
          return this.enLocale
        case 'es':
          return this.esLocale
        }
    },
    formattedBirthday() {
      return moment(new Date(this.birthday)).format('DD MMM YYYY')
    },
    modeLabel() {
      return this.$t(this.modes.find(m=>m.id == this.mode).label)
    },
    langLabel() {
      return this.$t(this.languages.find(l=>l.id == this.lang).label)
    }
  },
  methods: {
    setLang(newLang) {
      this.lang = newLang
      this.$i18n.locale = newLang
      moment.locale(this.lang)
      set('locale', this.lang)
    },
    async getSettings() {
      const birthdayQuery = this.$route.query.b || this.$route.query.c
      if (birthdayQuery) {
        this.birthday = birthdayQuery.substring(0,4) + '/' + birthdayQuery.substring(4,6) + '/' + birthdayQuery.substring(6,8)
      } else {
        const savedBirthday = await get('birthday')
        if (savedBirthday) {
          this.birthday = savedBirthday
        }
      }

      const modeQuery = this.$route.query.m
      if (modeQuery) {
        this.mode = modeQuery
      } else {
        const savedMode = await get('mode')
        if (savedMode) {
          this.mode = savedMode
        }
      }
      
      const yearsQuery = this.$route.query.t || this.$route.query.y || this.$route.query.a
      if (yearsQuery) {
        this.years = yearsQuery
      } else {
        const savedYears = await get('years')
        if (savedYears) {
          this.years = savedYears
        }
      }

      const savedDark = await get('dark')
      const savedColored = await get('colored')
      if (savedDark) {
        this.dark = savedDark
      } else {
        this.dark = false
      }
      if (savedColored) {
        this.colored = savedColored
      } 
      this.$q.dark.set(this.dark)

      const savedLocale = await get('locale')
      if (savedLocale) {
        this.lang = savedLocale
      } else {
        this.lang = 'en'
      }
      this.$i18n.locale = this.lang
      moment.locale(this.lang)
      
    },
    drawCanvas() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      
      const differenceBetweenDates = (dateBirth, dateNow, unit) => {
        return moment(dateBirth).diff(moment(dateNow), unit, true)
      }

      const newDate = new Date()
      const birthDate = new Date(this.birthday)

      switch (this.mode) {
        case 'm':
          this.total = this.years * 12
          // this.livedUnits = differenceInMonths(new Date(), new Date(this.birthday))
          this.livedUnits = differenceBetweenDates(newDate, birthDate, 'months')
          break;
        case 's':
        case 'w':
          this.total = this.years * 12 * 4
          this.livedUnits = differenceBetweenDates(newDate, birthDate, 'weeks')
          break;
        // case 'd':
        //   this.total = this.years * 12 * 4 * 7
        //   this.livedUnits = differenceBetweenDates(newDate, birthDate, 'days')
        //   break;
        case 'a':
        case 'y':
        case 't':
        default:
          this.livedUnits = differenceBetweenDates(newDate, birthDate, 'years')
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
        dotDiameter = dotHeight
        xMargin = (this.canvas.width - ((2 * this.dotMargin) + (this.cols * dotDiameter))) / this.cols
        yMargin = this.dotMargin
      } else {
        dotDiameter = dotWidth
        xMargin = this.dotMargin
        yMargin = (this.canvas.height - ((2 * this.dotMargin) + (this.rows * dotDiameter))) / this.rows
      }
      const dotRadius = dotDiameter * 0.5

      let count = 0
      const childhood = this.total * (10/this.years)
      const teenhood = this.total * (20/this.years)
      const adulthood = this.total * (45/this.years)
      const oldhood = this.total * (60/this.years)

      for(let i = 0; i < this.rows; i++) {
        for(let j = 0; j < this.cols; j++) {
          const x = (j * (dotDiameter + xMargin)) + this.dotMargin + (xMargin / 2) + dotRadius
          const y = (i * (dotDiameter + yMargin)) + this.dotMargin + (yMargin / 2) + dotRadius
          // const x = (j * dotDiameter) + this.dotMargin + dotRadius;
          // const y = (i * dotDiameter) + this.dotMargin + dotRadius;
          // Grab a random color from the array.
          // const color = this.colors[Math.floor(i % this.colors.length)];
          let color = this.colors.black
          let altColor = this.colors.dimBlack
          if (this.dark) {
            color = this.colors.white
            altColor = this.colors.dimWhite
          } else {
            
          }
          const isPast = count < this.livedUnits
          if (this.colored) {
            if (count < childhood) {
              color = this.colors.childhood
            } else if (count > childhood - 1 && count < teenhood) {
              color = this.colors.teenhood
            } else if (count > teenhood - 1 && count < adulthood) {
              color = this.colors.adulthood
            } else if (count > adulthood - 1 && count < oldhood) {
              color = this.colors.oldhood
            } else {
              color = altColor
            }
          } 
          if (count < this.total) {
            console.log('color: ', color);
            this.drawDot(x, y, dotRadius, color, isPast);
          }
          count++;
        }
      }
    },
    resizeCanvas (doNotRender) {
      const maxWidth = 1080
      this.canvas.width = window.innerWidth > maxWidth ? maxWidth : window.innerWidth - 40
      this.canvas.height = window.innerHeight - 62
      if (doNotRender!==true) this.drawCanvas('resizeCanvas')
    },
    drawDot (x, y, radius, color, isPast) {
      this.context.beginPath();
      this.context.arc(x, y, isPast?radius-1.5:radius-1, 0, 2 * Math.PI, false)
      this.context.fillStyle = isPast?color+'60':color
      this.context.strokeStyle = isPast?color+'40':this.colors.transparent
      this.context.lineWidth = 2
      this.context.fill()
      this.context.stroke()
      this.context
    },
    yearsSelected (years) {
      this.years = years;
      this.$router.replace({query: {...this.$route.query, t: this.years}})
    },
    modeSelected (mode) {
      this.mode = mode.id;
      this.$router.replace({query: {...this.$route.query, m: this.mode}})
    },
    birthdaySelected(newBday) {
      const urlifiedBday = newBday.substring(0,4) + newBday.substring(5,7) + newBday.substring(8,10)
      this.$router.replace({query: {...this.$route.query, b: urlifiedBday}})
    },
    debounce (func, wait, immediate) {
      let timeout;
      return function () {
        const context = this
        const args = arguments
        const later = () => {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  },
  watch: {
    birthday(newBday, oldBday) {
      console.log('newBday: ', newBday, ' oldBday: ', oldBday);
      set('birthday', newBday)
      this.drawCanvas()
    },
    dark(newDark) {
      set('dark', newDark)
      this.$q.dark.set(newDark)
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
    colored(newColored) {
      set('colored', newColored)
      this.drawCanvas()
    },
    // $route (to, from) {
    //   console.log('from: ', from);
    //   console.log('to: ', to);
    // }
  }
};
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
$patrick-hand: 'Patrick Hand', cursive, Avenir, Helvetica, sans-serif;

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

.menubar {
  margin: auto;
  align-items: center;
  font-family: $patrick-hand;
  font-size: 1.1rem;
  user-select: none;
  display: flex;
  color: black;
  span {
    // padding: 0 0.5rem;
    &.q-btn__content {
      font-size: 1rem;
      font-weight: bold;
      padding: 0rem 0.5rem;
      border: 1px solid rgb(41, 41, 41);
      border-radius: 1rem;
    }
  }
  &.dark {
    color: white;
  }
}
.patrick {
  font-family: $patrick-hand;
  &.md {
    font-size: 1.2rem;
  }
}

.block, .q-item {
  // text-transform: uppercase;
  font-family: $patrick-hand;
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

.yearItem, .modeItem {
  text-align: center;
  color: #000000f6;
  &.active {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.333);
    cursor: default;
  }
}

.menuBtn {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
}

.menuLabel {
  color: black;
  &.dark {
    color: white;
  }
}
</style>