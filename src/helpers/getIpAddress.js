import axios from 'axios'

const getIpAddress = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_DOMAIN_IP)
    return res.data.ip
  } catch (err) {
    console.log(err)
    return null
  }
}

export default getIpAddress
export { getIpAddress }
