import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    location: {
      key: '',
      name: '',
      coordinate: {
        lat: null,
        long: null
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
    isSearched: false
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
