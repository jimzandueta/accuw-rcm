import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'

const ls = new SecureLS({ isCompression: false })

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    location: {
      key: '',
      name: '',
      coordinate: {
        lat: null,
        long: null
      },
      timezone: {
        code: null,
        name: null
      }
    },
    api: {
      key: process.env.VUE_APP_API_KEY,
      lang: process.env.VUE_APP_API_LANG
    },
    weather: {
      dForecast: null,
      hForecast: null
    },
    ipAddress: null,
    isSearched: false,
    mainBG: null,
    expiration: null
  },
  getters: {
  },
  mutations: {
    updateIpAddress (state, ip) {
      state.ipAddress = ip
    },
    updateLocation (state, location) {
      state.location = location
    },
    updateMainBG (state, url) {
      state.mainBG = url
    },
    updateWeather (state, weather) {
      state.weather = weather
    },
    toggleIsSearched (state) {
      state.isSearched = !state.isSearched
    },
    updateExpiration (state, exp) {
      state.expiration = exp
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState({
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key)
    }
  })]
})
