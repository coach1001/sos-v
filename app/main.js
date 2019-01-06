import Vue from 'nativescript-vue'
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView)
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'
import firebase from 'nativescript-plugin-firebase'
import { store } from './store/store.js'

if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

firebase.init({
  onAuthStateChanged: function (data) { // optional but useful to immediately re-logon the user when he re-visits your app
    if (data.loggedIn) {
      store.commit("setUser", data);
      store.commit("setLoggedIn", true);
    } else {
      store.commit("setUser", null);
      store.commit("setLoggedIn", false);
    }
  },
  persist: true
}).then(() => {
  console.log("firebase.init successfull");
}, (error) => {
  console.log(`firebase.init error: ${error}`);
});
// Vue.prototype.$firebase = firebase;

new Vue({
  render: h => h('frame', [h(App)]),
  store: store
}).$start()
