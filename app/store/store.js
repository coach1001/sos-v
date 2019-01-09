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
    loggedIn: null,
    userRegistered: false
  },
  getters: {
    getShowLoader: state => state.showLoader,
    getLoggedIn: state => state.loggedIn,
    getUserRegistered: state => state.userRegistered,
    getError: state => state.error
  },
  actions: {
    async login({ commit, dispatch }, payload) {
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
        commit("setError", "Invalid username or password");
      } else {
        commit("setError", null);
        commit("setUser", result);
        commit("setLoggedIn", result.emailVerified);
        if (!result.emailVerified) {
          if (!payload.registering) {
            action("Account not verified", "Cancel", ["Resend verification email"])
              .then(result => {
                if(result === "Resend verification email") {
                  dispatch("sendEmailVerification");
                }
            });
          }
        }
      }
    },
    async requestPasswordReset( {}, payload) {
      const [err, result] = await to(firebase
        .resetPassword({
          email: payload.emailAddress
        }));  
        if(err) {
          commit("setError", "Error when trying to create a password reset request. Please try again.");
        }
    },
    async getCurrentUser({commit}) {
      return firebase.getCurrentUser();

    },
    async register({ commit, dispatch }, payload) {
      commit("setLoader", true);
      const [err, result] = await to(firebase
        .createUser({
          email: payload.emailAddress,
          password: payload.password
        }));
      if (err) {
        commit("setLoader", false);
        commit("setError", "Account creation failed, email address already used.");
      } else {
        commit("setError", null);
        await dispatch("login", { ...payload, registering: true });
        commit("setLoader", true);
        await dispatch("sendEmailVerification");
        commit("setLoader", false);
        commit("setUserRegistered", true);
      }
    },
    async sendEmailVerification() {
      const [err, result] = await to(firebase.sendEmailVerification());
      if (err) {
        commit("setError", "There was a problem sending your verification email.");
      }
    },
    logout({ commit }) {
      commit("setLoader", true);
      firebase.logout();
      commit("setLoader", false);
      commit("setError", null);
      commit("setUser", null);
      commit("setLoggedIn", false);
    },
  },
  mutations: {
    setLoader(state, val) {
      state.showLoader = val;
    },
    setUserRegistered(state, val) {
      state.userRegistered = val;
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