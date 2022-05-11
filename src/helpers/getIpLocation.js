import axios from 'axios'
import store from '../store'

const getIpLocation = async () => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_DOMAIN_ACCUW_CITIES}ipaddress?apikey=${store.state.api.key}&language=${store.state.api.lang}&details=false&q=${store.state.ipAddress}`)
    return res.data
  } catch (err) {
    console.log(err)
    return null
  }
}

export default getIpLocation
export { getIpLocation }
