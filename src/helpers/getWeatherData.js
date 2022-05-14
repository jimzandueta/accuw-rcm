import axios from 'axios'
import store from '../store'

const getWeatherData = async (t) => {
  let type = ''
  switch (t) {
    case 'h':
      type = 'hourly/12hour/'
      break
    case 'd':
      type = 'daily/5day/'
      break
    default:
      type = null
      break
  }
  if (!type) return null
  try {
    const res = await axios.get(`${process.env.VUE_APP_DOMAIN_ACCUW_FORECAST}${type}${store.state.location.key}?"language=${store.state.api.lang}&apikey=${store.state.api.key}`)
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
