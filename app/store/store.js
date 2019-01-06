import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import to from 'await-to-js'
import firebase, { logout } from 'nativescript-plugin-firebase'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    error: null,
    showLoader: false,
    loggedIn: false
  },
  getters: {
    getShowLoader: state => state.showLoader,
    getLoggedIn: state => state.loggedIn
  },
  actions: {
    async login({ commit }, payload) {
      commit("setLoader", true);
      const [err, result] = await to(firebase
        .login({
          type: firebase.LoginType.PASSWORD,
          passwordOptions: {
            email: payload.emailAddress,
            password: payload.password
          }
        }));
      commit("setLoader", false);
      if (err) {
        commit("setError", err);
      } else {
        commit("setError", null);
        commit("setUser", result);
        commit("setLoggedIn", true);
      }
    },
    logout({ commit }) {
      commit("setLoader", true);
      firebase.logout();
      commit("setLoader", false);
      commit("setError", null);
      commit("setUser", null);
      commit("setLoggedIn", false);
    }
  },
  mutations: {
    setLoader(state, val) {
      state.showLoader = val;
    },
    setLoggedIn(state, val) {
      state.loggedIn = val;
    },
    setUser(state, val) {
      state.user = val;
    },
    setError(state, val) {
      if (val) {
        console.log("Backend Error: ", val);
      }
      state.error = val;
    }
  }
});