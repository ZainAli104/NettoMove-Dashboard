import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: 'Dashboard',
    showLogInPopUp: false,
    firstName: '',
    lastName: '',
    imgUrl: ''
  },
  getters: {
    title(state) {
      return state.title;
    },
    showLogInPopUp(state) {
      return state.showLogInPopUp;
    },
    firstName(state) {
      return state.firstName;
    },
    lastName(state) {
      return state.lastName;
    },
    resolveLetter(state) {
      if (state.firstName) {
        return state.firstName[0];
      } else {
        return "_";
      }
    },
    imgUrl(state) {
      return state.imgUrl
    }
  },
  mutations: {
    setTitle(state, payload) {
      state.title = payload;
    },
    setPopup(state) {
      state.showLogInPopUp = true;
      setTimeout(() => {
        state.showLogInPopUp = false;
      }, 4000)
    },
    setInfo(state, payload) {
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.email = payload.email;
      state.imgUrl = payload.imgUrl
    }
  },
  actions: {
      changeTitle(context, payload) {
        context.commit('setTitle', payload)
      },
      changeLoginPopUp(context) {
        context.commit('setPopup')
      },
      changeInfo(context, payload) {
        context.commit('setInfo', payload)
      }
  },
  modules: {
  }
})
