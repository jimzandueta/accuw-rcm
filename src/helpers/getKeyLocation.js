import axios from 'axios'
import store from '../store'

const getKeyLocation = async (key) => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_DOMAIN_ACCUW_LOCATION}${key}?apikey=${store.state.api.key}&language=${store.state.api.lang}&details=false&toplevel=false`)
    return res.data
  } catch (err) {
    console.log(err)
    return null
  }
}

export default getKeyLocation
export { getKeyLocation }
