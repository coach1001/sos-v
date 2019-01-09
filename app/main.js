import Vue from 'nativescript-vue';
import { TNSFontIcon, fonticon } from 'nativescript-fonticon';
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView);
Vue.registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);
import LaunchScreen from './components/LaunchScreen';
import VueDevtools from 'nativescript-vue-devtools';
import firebase from 'nativescript-plugin-firebase';
import { store } from './store/store.js'

if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools);
};

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');

TNSFontIcon.paths = {
  'fa': './font-awesome.css'
};
TNSFontIcon.loadCss();

Vue.filter('fonticon', fonticon);

firebase.init({
  onAuthStateChanged: function (data) { // optional but useful to immediately re-logon the user when he re-visits your app
    if (data.loggedIn) {
      store.commit("setUser", data.user);
      store.commit("setLoggedIn", data.user.emailVerified);
    } else {
      store.commit("setUser", null);
      store.commit("setLoggedIn", false);
    }
  },
  persist: true
}).then(() => {
  console.log("firebase.init successfull");
}, (error) => {
  console.log(`firebase.init error: ${error}`)
});
// Vue.prototype.$firebase = firebase;

new Vue({
  render: h => h('frame', [h(LaunchScreen)]),
  store: store
}).$start();
