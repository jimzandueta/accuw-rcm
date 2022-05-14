<template>
  <div class="home">
    <div class="main-j is-full" :style="mainBGStyle">
      <b-field class="searchbar-container">
          <b-autocomplete
            v-model="searchInput"
            :data="searchRes"
            field="disp"
            rounded
            custom-class="searchbar"
            icon-right="magnify"
            clearable
            @select="option => updateLocation(option)">
            <template #empty>No results found</template>
        </b-autocomplete>
      </b-field>
      <div class="upper-panel columns">
        <div class="dateTime column is-two-thirds">
          <div><span class="time">{{ display.time }}</span> <span class="meridiem"> {{ display.meridiem }}</span></div>
          <div class="date">{{ display.date }}</div>
        </div>
        <div class="location column">
          <div class="city">
            {{ display.city }}
          </div>
          <span class="country">
            {{ display.country }}
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
              <div>{{ dispWeather.today.day }}<span> (now)</span></div>
              <div>{{ dispWeather.today.temp }}</div>
              <div>{{ dispWeather.today.phrase }}</div>
              <div>{{ dispWeather.today.rain }}% chance of rain</div>
            </div>
          </div>
        </div>
        <div class="column forecast">
          <div class="columns">
            <div class="column" v-for="(f, idx) in dispWeather.forecast" :key="idx">
              <div class="w-img-container">
                <b-image class="w-img" :src="f.icon"/>
              </div>
              <div class="details">
                <div>{{ f.day }}</div>
                <div>{{ f.temp }}</div>
                <div>{{ f.phrase }}</div>
                <div>{{ f.rain }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'

import { getIpAddress, getIpLocation, getCoordinatesLocation, getWeatherData, getImg, getWicon, searchLocation, getKeyLocation } from '../helpers'

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
    },
    searchInput: {
      get () {
        return this.debouncedSearchInput
      },
      set (val) {
        if (this.searchtimeout) clearTimeout(this.searchtimeout)
        this.searchtimeout = setTimeout(() => {
          this.debouncedSearchInput = val
          this.updateSearchRes(this.debouncedSearchInput)
        }, 300)
      }
    }
  },
  data () {
    return {
      isLoaded: true,
      display: {
        time: '-',
        date: '-',
        meridiem: '-',
        forecastToday: '-',
        city: '-',
        country: '-'
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
      interval: null,
      searchRes: null,
      searchtimeout: null,
      debouncedSearchInput: ''
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
      this.$store.commit('toggleIsSearched')
    } else {
      this.getWeatherData()
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
      this.updateDisplay()
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
    },
    async updateSearchRes (search) {
      this.searchRes = []
      if (!search) return
      const res = await searchLocation(search)
      this.searchRes = res.map(e => {
        return {
          key: e.Key,
          disp: `${e.LocalizedName} / ${e.Country.LocalizedName}`
        }
      })
    },
    async updateLocation (loc) {
      if (!loc) return
      this.$store.commit('toggleIsSearched')
      const res = await getKeyLocation(loc.key)
      if (res) {
        this.location.coordinate.lat = res.GeoPosition.Latitude
        this.location.coordinate.long = res.GeoPosition.Longitude
        this.getLocationCoordinates()
      }
      this.searchInput = ''
      this.$store.commit('toggleIsSearched')
    },

    updateDisplay () {
      const t = moment.tz(this.location.timezone.name)
      const dt = moment(this.weather.hForecast[0].DateTime).tz(this.location.timezone.name)
      this.display.time = t.format('hh:mm')
      this.display.meridiem = t.format('A')
      this.display.date = dt.format('dddd, DD MMMM YYYY')
      this.display.city = this.location.city
      this.display.country = this.location.country.LocalizedName
      this.$store.commit('updateExpiration', t.add(15, 'minutes'))
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        const t = moment.tz(this.location.timezone.name)
        this.display.time = t.format('hh:mm')
        this.display.meridiem = t.format('A')
        if (t.isSameOrAfter(this.$store.state.expiration)) {
          this.getWeatherData()
        }
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
          day: moment(d.Date).tz(this.location.timezone.name).format('dddd'),
          isDay: this.weather.hForecast[0].IsDaylight,
          rain: this.weather.hForecast[0].IsDaylight ? `${d.Day.PrecipitationIntensity} ${d.Day.PrecipitationType}` : `${d.Night.PrecipitationIntensity} ${d.Night.PrecipitationType}`,
          icon: ''
        }
        obj.icon = getWicon(obj.isDay, String(obj.phrase).toLowerCase())
        forecast.push(JSON.parse(JSON.stringify(obj)))
      })
      forecast.shift()
      forecast.pop()
      this.dispWeather = { today, forecast }

      this.display.forecastToday = this.weather.dForecast.Headline.Text
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
    min-width: 1229px;
    min-height: 614px;
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
    .searchbar-container {
      margin: 1em;
      width: 40%;
      align-self: flex-end;
    }
    .upper-panel {
      background-color: rgba(252, 252, 252, 0.05);
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
          line-height: 1.6em;
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
      .today, .forecast {
        font-family: 'Roboto', sans-serif;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-items: center;
        text-shadow: 1px 0px 1px rgba(0,0,0,0.4);
      }
      .today {
        border-right: 1px #efefef solid;
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
      .forecast {
        .w-img-container {
          display: flex;
          flex-direction: column;
          .w-img {
            margin-top: -2em;
            width: 7em;
            height: auto;
            filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(52deg) brightness(111%) contrast(111%);
            align-self: center;
            justify-self: center;
          }
        }
        .details {
          margin-top: -1.5em;
          div:nth-child(1) {
            font-size: 1em;
            font-weight: 500;
          }
          div:nth-child(2) {
            font-size: 1.25em;
            font-weight: 400;
          }
          div:nth-child(3) {
            font-size: .9em;
            font-weight: 300;
          }
          div:nth-child(4) {
            font-size: .9em;
            font-weight: 300;
          }
        }
      }
    }
  }
</style>
<style>
  .searchbar {
      font-size: 1em;
      font-weight: 300;
    }
</style>
