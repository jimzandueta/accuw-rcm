import axios from 'axios'
import store from '../store'

const getWeatherData = async (t) => {
  let type = ''
  switch (t) {
    case 'h':
      type = `hourly/${process.env.VUE_APP_FORECAST_HOUR}hour/`
      break
    case 'd':
      type = `daily/${process.env.VUE_APP_FORECAST_DAY}day/`
      break
    default:
      type = null
      break
  }
  if (!type) return null
  try {
    const res = await axios.get(`${process.env.VUE_APP_DOMAIN_ACCUW_FORECAST}${type}${store.state.location.key}?"language=${store.state.api.lang}&apikey=${store.state.api.key}`)
    // console.log(type)
    // console.log('res.data[0]', res.data[0])
    // console.log('res.data', res.data)
    if (t === 'h') return res.data
    if (t === 'd') return res.data
  } catch (err) {
    console.log(err)
    return null
  }
  // axios
  // .get("http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/" + this.location.locationKey + "?apikey=" + this.api.apiKey + "&language=" + this.api.lang + "&details=false&metric=true")
  // .then((Response) => {
  // this.weather.fiveDayData = Response.data;
  // })
  // .catch((error) => {
  // this.$notify({type: "error", text: error})
  // })
}

export default getWeatherData
export {
  getWeatherData
}
// }

// get(){

// get(){
//     axios
//         .get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + this.location.locationKey + "?apikey=" + this.api.apiKey + "&language=" + this.api.lang + "&details=false&metric=true")
//         .then((Response) => {
//         this.weather.fiveDayData = Response.data;
//         })
//         .catch((error) => {
//         this.$notify({type: "error", text: error})
//         })
//     }
