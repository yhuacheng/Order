
import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user: {},
    title: '',
    userId:""
  },
  mutations: {
    [types.LOGIN]: (state, data) => {
      state.userId = data
    },
    [types.LOGOUT]: (state) => {
      localStorage.removeItem('userId')
      state.userId = null
    },
    [types.TITLE]: (state, data) => {
      state.title = data
    }
  }
})
