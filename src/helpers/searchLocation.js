import axios from 'axios'
import store from '../store'

const searchLocation = async (search) => {
  if (search === null || search.length < 3) return null
  try {
    const res = await axios.get(`${process.env.VUE_APP_DOMAIN_ACCUW_LOCATION}cities/autocomplete?language=${store.state.api.lang}&apikey=${store.state.api.key}&q=${search}`)
    console.log('search', res.data)
    return res.data
  } catch (err) {
    console.log(err)
    return null
  }
}

export default searchLocation
export {
  searchLocation
}
