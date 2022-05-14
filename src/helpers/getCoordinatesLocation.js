import axios from 'axios'
import store from '../store'

const getCoordinatesLocation = async () => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_DOMAIN_ACCUW_LOCATION}cities/geoposition?apikey=${store.state.api.key}&language=${store.state.api.lang}&details=false&toplevel=false&q=${store.state.location.coordinate.lat},${store.state.location.coordinate.long}`)
    return res.data
  } catch (err) {
    console.log(err)
    return null
  }
}

export default getCoordinatesLocation
export { getCoordinatesLocation }
