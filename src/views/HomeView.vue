<template>
  <div class="home">
    <b>Daily Forecast</b>
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
    </div>
  </div>
</template>

<script>
import { getIpAddress, getIpLocation, getWeatherData } from '../helpers'
import store from '../store'

export default {
  name: 'HomeView',
  components: {
  },
  computed: {
    weather () {
      return store.state.weather
    },
    location () {
      return store.state.location
    },
    api () {
      return store.state.api
    },
    ipAddress () {
      return store.state.ipAddress
    },
    isSearched () {
      return store.state.isSearched
    }
  },
  data () {
    return {
      isLoaded: true
    }
  },
  mounted () {
    if (!this.isSearched) {
      if (!navigator.geolocation) {
        this.getData()
      } else {
        navigator.geolocation.getCurrentPosition(
          (res) => {
            this.location.coordinate.lat = res.coords.latitude
            this.location.coordinate.long = res.coords.longitude
          },
          (err) => {
            console.log(err)
            this.getData()
          })
      }
    }
  },
  methods: {
    async getData () {
      store.state.ipAddress = await getIpAddress()
      console.log(this.ipAddress)
      if (this.ipAddress) {
        const res = await getIpLocation(this.ipAddress)
        if (res) {
          store.state.location.key = res.ParentCity.Key
          store.state.location.name = res.ParentCity.EnglishName
          console.log(this.location)
          console.log(this.location)
          console.log('here')
          store.state.weather.dForecast = await getWeatherData('d')
          store.state.weather.hForecast = await getWeatherData('h')
          console.log(this.weather)
        }
      }
    },
    getWeatherDate () {

    }
  }
}
</script>

<style scoped>
  .home {
    padding: 20px;
  }
</style>
