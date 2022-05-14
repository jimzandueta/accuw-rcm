import { weatherIcons } from '../maps'

const getWicon = (isDay, phrase) => {
  const f = weatherIcons.filter(d => {
    return d.day === isDay && String(d.text).toLowerCase() === phrase
  })
  if (!f.length) return require('../assets/weather-icons/1.svg')
  return require(`../assets/weather-icons/${f[0].icon}.svg`)
}

export default getWicon
export {
  getWicon
}
