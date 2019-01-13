import Vue from "nativescript-vue";
// Vue.registerElement("CardView", () => require('nativescript-cardview').CardView);
Vue.registerElement("Fab", () => require("nativescript-floatingactionbutton").Fab);
Vue.registerElement("FilterSelect", () => require("nativescript-filter-select").FilterSelect)
import LaunchScreen from "./components/LaunchScreen";
import VueDevtools from "nativescript-vue-devtools";
import firebase from "nativescript-plugin-firebase";
import { store } from "./store/store.js";

const ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;
const PhotoViewer = require("nativescript-photoviewer");

const datePicker = new ModalPicker();
const photoViewer = new PhotoViewer();

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === "production");

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
Vue.prototype.$datePicker = datePicker;
Vue.prototype.$photoViewer = photoViewer;

new Vue({
  render: h => h("frame", [h(LaunchScreen)]),
  store: store
}).$start();
