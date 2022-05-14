const getImg = async () => {
  // Random Number from 0 - 9
  const r = Math.floor(Math.random() * 10)
  return require(`../assets//${r}.jpeg`)
}

export default getImg
export { getImg }
