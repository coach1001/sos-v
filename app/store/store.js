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
    loggedIn: false,
    userRegistered: false
  },
  getters: {
    getShowLoader: state => state.showLoader,
    getLoggedIn: state => state.loggedIn,
    getUserRegistered: state => state.userRegistered,
    getError: state => state.error
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
        commit("setError", "Invalid username or password");
      } else {
        console.log("LOGGED INTO FIREBASE", result);
        commit("setError", null);
        commit("setUser", result);
        commit("setLoggedIn", result.emailVerified);
        if(!result.emailVerified) {
          commit("setError", "Email account not verified.");
        }        
      }
    },
    async register({ commit, dispatch }, payload) {
      commit("setLoader", true);
      const [err, result] = await to(firebase
        .createUser({
          email: payload.emailAddress,
          password: payload.password
        }));
      commit("setLoader", false);
      
      if (err) {
        commit("setError", "Account creation failed, email address already used.");
      } else {
        console.log("ACCOUNT CREATED");
        commit("setError", null);        
        await dispatch("login", payload);
        await dispatch("sendEmailVerification"); 
        commit("setUserRegistered", true);       
      }
    },
    async sendEmailVerification() {
      const [err, result] = await to(firebase.sendEmailVerification());
      if (err) {
        commit("setError", "There was a problem sending your verification email.");
      } else {
        console.log("VERIFICATION SENT");
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