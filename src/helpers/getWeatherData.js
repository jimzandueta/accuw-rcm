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
    console.log('w', res.data)
    return res.data
  } catch (err) {
    console.log(err)
    return null
  }
}

export default getWeatherData
export {
  getWeatherData
}
