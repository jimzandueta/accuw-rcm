const getImg = async () => {
  // Random Number from 0 - 9
  const r = Math.floor(Math.random() * 10)
  const imgURL = `./img/${r}.jpeg`
  return imgURL
}

export default getImg
export { getImg }
