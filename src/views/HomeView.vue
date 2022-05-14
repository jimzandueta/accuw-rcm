<template>
  <div class="home">
    <div class="main-j is-full" :style="mainBGStyle">
      <div class="upper-panel columns">
        <div class="dateTime column is-two-thirds">
          <div><span class="time">{{ display.time }}</span> <span class="meridiem"> {{ display.meridiem }}</span></div>
          <div class="date">{{ display.date }}</div>
        </div>
        <div class="location column">
          <div class="city">
            {{ location.city }}
          </div>
          <span class="country">
            {{ location.country.EnglishName }}
          </span>
          <div class="forecast">
            {{ display.forecastToday }}
          </div>
        </div>
      </div>
      <div class="lower-panel columns">
        <div class="column today is-one-third">
          <div class="columns">
            <div class="column w-img-container">
              <b-image class="w-img" :src="dispWeather.today.icon"/>
            </div>
            <div class="column details is-two-thirds">
              <div>{{dispWeather.today.day}}<span> (now)</span></div>
              <div>{{dispWeather.today.temp}}</div>
              <div>{{dispWeather.today.phrase}}</div>
              <div>{{dispWeather.today.rain}}% chance of rain</div>
            </div>
          </div>
        </div>
        <div class="column forecast">
          <div class="columns">
            <div class="column">icon</div>
            <div class="column">icon</div>
            <div class="column">icon</div>
            <div class="column">icon</div>
            <div class="column">icon</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="weather.hForecast" class="weather">
      <div>{{ weather.hForecast[0].Temperature.Value }} {{ weather.hForecast[0].Temperature.Unit }}</div>
      <div>{{ weather.hForecast[0].IconPhrase }}</div>
    </div> -->
    <!-- <div class="tile is-ancestor">
      <div class="tile is-vertical is-8">
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child notification is-primary">
              <p class="title">Vertical...</p>
              <p class="subtitle">Top tile</p>
            </article>
            <article class="tile is-child notification is-warning">
              <p class="title">...tiles</p>
              <p class="subtitle">Bottom tile</p>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child notification is-info">
              <p class="title">Middle tile</p>
              <p class="subtitle">With an image</p>
              <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/640x480.png">
              </figure>
            </article>
          </div>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child notification is-danger">
            <p class="title">Wide tile</p>
            <p class="subtitle">Aligned with the right tile</p>
            <div class="content">
            </div>
          </article>
        </div>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child notification is-success">
          <div class="content">
            <p class="title">Tall tile</p>
            <p class="subtitle">With even more content</p>
            <div class="content">
            </div>
          </div>
        </article>
      </div>
    </div> -->
    <!-- <b>Daily Forecast</b>
    <div v-if="weather.dForecast.DailyForecasts">
      <div v-for="(d, idx) in weather.dForecast.DailyForecasts" :key="idx">
        <div>{{d.Date}}</div>

        <div>{{d.Day.IconPhrase}}</div>
        <div>{{d.Day.PrecipitationIntensity}}</div>
        <div>{{d.Day.PrecipitationType}}</div>

        <div>{{d.Night.IconPhrase}}</div>
        <div>{{d.Night.PrecipitationIntensity}}</div>
        <div>{{d.Night.PrecipitationType}}</div>

        <div>{{d.Temperature.Minimum.Value}}</div>
        <div>{{d.Temperature.Maximum.Value}}</div>
      </div>
    </div>
    <b>Hourly Forecast</b>
    <div v-if="weather.hForecast">
      <div v-for="(h, idx) in weather.hForecast" :key="idx">
        <div>{{h.DateTime}}</div>

        <div>{{h.IconPhrase}}</div>
        <div>{{h.HasPrecipitation}}</div>
        <div>{{h.IsDaylight}}</div>

        <div>{{h.Temperature.Value}}</div>
      </div>
    </div> -->
  </div>
</template>

<script>
import moment from 'moment-timezone'

import { getIpAddress, getIpLocation, getCoordinatesLocation, getWeatherData, getImg, getWicon } from '../helpers'

export default {
  name: 'HomeView',
  components: {
  },
  computed: {
    weather () {
      return this.$store.state.weather
    },
    location () {
      return this.$store.state.location
    },
    api () {
      return this.$store.state.api
    },
    ipAddress () {
      return this.$store.state.ipAddress
    },
    isSearched () {
      return this.$store.state.isSearched
    },
    mainBG () {
      return this.$store.state.mainBG
    },
    mainBGStyle () {
      return {
        backgroundImage: `url(${this.mainBG})`
      }
    }
  },
  data () {
    return {
      isLoaded: true,
      display: {
        time: null,
        date: null,
        meridiem: null,
        forecastToday: '-'
      },
      dispWeather: {
        today: {
          temp: '-',
          phrase: '-',
          day: '-',
          rain: '-',
          isDay: null
        },
        forecast: []
      },
      interval: null
    }
  },
  mounted () {
    if (!this.isSearched) {
      if (!navigator.geolocation) {
        this.getLocationIP()
      } else {
        navigator.geolocation.getCurrentPosition(
          (res) => {
            this.location.coordinate.lat = res.coords.latitude
            this.location.coordinate.long = res.coords.longitude
            this.getLocationCoordinates()
          },
          (err) => {
            console.log(err)
            this.getLocationIP()
          })
      }
    } else {
      // use cookies here
    }
  },
  methods: {
    async getLocationIP () {
      this.$store.commit('updateIpAddress', await getIpAddress())
      if (this.ipAddress) {
        const res = await getIpLocation(this.ipAddress)
        if (res) this.updateState(res)
      }
    },
    async getLocationCoordinates () {
      const res = await getCoordinatesLocation()
      if (res) this.updateState(res)
    },
    async getWeatherData () {
      const weather = {
        dForecast: await getWeatherData('d'),
        hForecast: await getWeatherData('h')
      }
      this.$store.commit('updateWeather', weather)
      this.updateDispWeather()
    },
    async updateState (res) {
      const location = {
        key: res.ParentCity.Key,
        city: res.ParentCity.EnglishName,
        country: res.Country,
        coordinate: {
          lat: res.GeoPosition.Latitude,
          long: res.GeoPosition.Longitude
        },
        timezone: {
          code: res.TimeZone.Code,
          name: res.TimeZone.Name
        }
      }
      this.$store.commit('updateLocation', location)
      this.$store.commit('updateMainBG', await getImg())
      this.getWeatherData()
      this.updateTime()
    },

    updateTime () {
      const t = moment.tz(this.location.timezone.name)
      const dt = moment(this.weather.hForecast[0].DateTime).tz(this.location.timezone.name)
      this.display.time = t.format('hh:mm')
      this.display.meridiem = t.format('A')
      this.display.date = dt.format('dddd, DD MMMM YYYY')
      this.interval = setInterval(() => {
        const t = moment.tz(this.location.timezone.name)
        this.display.time = t.format('hh:mm')
        this.display.meridiem = t.format('A')
      }, 60000)
    },
    updateDispWeather () {
      const today = {
        temp: `${this.weather.hForecast[0].Temperature.Value} °${this.weather.hForecast[0].Temperature.Unit}`,
        phrase: this.weather.hForecast[0].IconPhrase,
        day: moment(this.display.date).tz(this.location.timezone.name).format('dddd'),
        isDay: this.weather.hForecast[0].IsDaylight,
        rain: this.weather.hForecast[0].PrecipitationProbability,
        icon: ''
      }
      today.icon = getWicon(today.isDay, String(today.phrase).toLowerCase())

      const forecast = []
      const df = this.weather.dForecast.DailyForecasts
      df.forEach(d => {
        const obj = {
          temp: `${d.Temperature.Minimum.Value}°${d.Temperature.Minimum.Unit} - ${d.Temperature.Maximum.Value}°${d.Temperature.Maximum.Unit}`,
          phrase: this.weather.hForecast[0].IsDaylight ? d.Day.IconPhrase : d.Night.IconPhrase,
          day: moment(d.date).tz(this.location.timezone.name).format('dddd'),
          isDay: this.weather.hForecast[0].IsDaylight,
          rain: this.weather.hForecast[0].IsDaylight ? `${d.Day.PrecipitationIntensity} ${d.Day.PrecipitationType}` : `${d.Night.PrecipitationIntensity} ${d.Night.PrecipitationType}`,
          icon: ''
        }
        obj.icon = getWicon(obj.isDay, String(obj.phrase).toLowerCase())
        forecast.push(JSON.parse(JSON.stringify(obj)))
      })

      this.dispWeather = { today, forecast }
      console.log(this.dispWeather)
      const d = this.weather.dForecast.DailyForecasts[0].Day.IconPhrase
      const n = this.weather.dForecast.DailyForecasts[0].Night.IconPhrase
      if (n === d) {
        this.display.forecastToday = `${d} all through out the day.`
      } else {
        this.display.forecastToday = `${d} in the morning. \\\n ${n} in the evening.`
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style lang='scss' scoped>
  .home {
    width: 90%;
    height: 80%;
  }
  .main-j {
    display: flex;
    flex-direction: column;
    background-size: cover;
    width: 100%;
    height: calc(100vh - 20%);
    position: relative;
    box-shadow: -2px 6px 9px 0px rgba(0,0,0,0.59);
    -webkit-box-shadow: -2px 6px 9px 0px rgba(0,0,0,0.59);
    -moz-box-shadow: -2px 6px 9px 0px rgba(0,0,0,0.59);
    .upper-panel {
      background-color: rgba(252, 252, 252, 0.3);
      color: rgba(252, 252, 252, 0.3);
      height: 70%;
      margin: 0;

      .dateTime, .location {
        font-family: 'Roboto', sans-serif;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-items: center;
        text-shadow: 1px 0px 1px rgba(0,0,0,0.4);
      }
      .dateTime {
        padding-left: 40px;
        .time {
          font-size: 8em;
          font-weight: 700;
        }
        .meridiem {
          font-size: 4em;
          font-weight: 500;
        }
        .date {
          margin-top: -1.3em;
          font-size: 1.8em;
          font-weight: 400;
        }
      }
      .location {
        padding-right: 40px;
        text-align: left;
        .city {
          font-size: 4em;
          font-weight: 700;
        }
        .country {
          margin-top: -0.75em;
          font-size: 1.8em;
          font-weight: 400;
        }
        .forecast {
          margin-top: 0.75em;
          font-size: 1.25em;
          font-weight: 300;
        }
      }
    }
    .lower-panel {
      background-color: rgba(2, 2, 1, 0.7);
      color: rgba(2, 2, 1, 0.7);
      height: 30%;
      margin: 0;
      .today {
        border-right: 1px #efefef solid;
      }
      .today, .forecast {
        font-family: 'Roboto', sans-serif;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-items: center;
        text-shadow: 1px 0px 1px rgba(0,0,0,0.4);
        .w-img-container {
          display: flex;
          flex-direction: column;
        }
        .w-img {
          width: 200px;
          height: auto;
          filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(52deg) brightness(111%) contrast(111%);
          align-self: center;
          justify-self: center;
        }
        div.details {
          display: flex;
          flex-direction: column;
          justify-content: center;
          div {
            align-self: flex-start;
          }
          div:nth-child(1) {
            font-size: 1.5em;
            font-weight: 500;
            span {
              font-size: .75em;
              font-weight: 300;
            }
          }
          div:nth-child(2) {
            font-size: 2.75em;
            font-weight: 700;
          }
          div:nth-child(3) {
            font-size: 1em;
            font-weight: 300;
          }
          div:nth-child(4) {
            font-size: 1em;
            font-weight: 100;
          }
        }
      }
    }
  }

</style>
