import Vue from "nativescript-vue"
import Vuex from "vuex"
import to from "await-to-js"
import firebase from "nativescript-plugin-firebase";
import * as fs from "tns-core-modules/file-system";

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    error: null,
    showLoader: false,
    loggedIn: null,
    userRegistered: false,
    fileUploadPercentage: null,
    filesToUploadCount: null,
    filesUploadedCount: null,
    currentSlip: null,
    slips: []
  },
  getters: {
    getShowLoader: state => state.showLoader,
    getLoggedIn: state => state.loggedIn,
    getUserRegistered: state => state.userRegistered,
    getError: state => state.error,
    getFileUploadPercentage: state => state.fileUploadPercentage,
    getFilesToUploadCount: state => state.filesToUploadCount,
    getFilesUploadedCount: state => state.filesUploadedCount,
    getCurrentSlip: state => state.currentSlip,
    getSlips: state => state.slips
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
                if (result === "Resend verification email") {
                  dispatch("sendEmailVerification");
                }
              });
          }
        }
      }
    },
    async loadSlips({commit, state}) {  
      let slips = [];    
      commit("setLoader", true);
      /*const [err, result] = await to(
        firebase.firestore.collection(`slips_${state.user.uid}`).get()
      );      
      if(err) {
        commit("setError", "Error retrieving slips. Relaunch application.");
      } else {
        result.forEach((doc) => {
          slips.push(doc.data());
        });
        console.log(JSON.stringify(slips));
        commit("setSlips", slips);
      }*/
      slips.push({
        storeOrInstitution: "Pick n Pay",
        notes: "",
        approximateValue: 2999.00,
        warranteeGuaranteeExpirationDate: new Date("2020-01-13T17:05:36.176Z"),
        dateOfPurchase: new Date("2019-01-13T17:05:36.176Z"),
        softDelete: false,
        files:[
          {
            path: "https://firebasestorage.googleapis.com/v0/b/save-our-stuff-main.appspot.com/o/uploads%2FqSu9k5OGdigW3shoW8GrJkQ1DFa2%2Fimages%2F2019_01%2FSOS_1547399140226.jpg?alt=media&token=75ae3518-e8e6-4e40-90f2-e41186cdf85e",
            softDelete: false, 
            type: "online"
          },            
          {
            path: "https://firebasestorage.googleapis.com/v0/b/save-our-stuff-main.appspot.com/o/uploads%2FqSu9k5OGdigW3shoW8GrJkQ1DFa2%2Fimages%2F2019_01%2FSOS_1547399157099.jpg?alt=media&token=e718f52f-1be5-427d-99e8-3fcc62e6a1b8",
            softDelete: false,
            type: "online"
          }
        ],
        location: "Mountain View",
        itemDescription: "Blender",
        pictureType:["Proof of purchase"],
        productCategory: "Other"
      });
      slips.push({
        storeOrInstitution: "Cash Crusaders",
        notes: "",
        approximateValue: 5999.00,        
        warranteeGuaranteeExpirationDate: null,
        dateOfPurchase: new Date("2019-01-13T17:05:36.176Z"),
        softDelete: false,
        files:[
          {
            path: "https://firebasestorage.googleapis.com/v0/b/save-our-stuff-main.appspot.com/o/uploads%2FqSu9k5OGdigW3shoW8GrJkQ1DFa2%2Fimages%2F2019_01%2FSOS_1547399140226.jpg?alt=media&token=75ae3518-e8e6-4e40-90f2-e41186cdf85e",
            softDelete: false, 
            type: "online"
          },            
          {
            path: "https://firebasestorage.googleapis.com/v0/b/save-our-stuff-main.appspot.com/o/uploads%2FqSu9k5OGdigW3shoW8GrJkQ1DFa2%2Fimages%2F2019_01%2FSOS_1547399157099.jpg?alt=media&token=e718f52f-1be5-427d-99e8-3fcc62e6a1b8",
            softDelete: false,
            type: "online"
          }
        ],
        location: "Mountain View",
        itemDescription: "Microwave",
        pictureType:["Proof of purchase"],
        productCategory: "Other"
      });            
      commit("setSlips", slips);
      commit("setLoader", false);      
    },
    async requestPasswordReset({ }, payload) {
      const [err, result] = await to(firebase
        .resetPassword({
          email: payload.emailAddress
        }));
      if (err) {
        commit("setError", "Error when trying to create a password reset request. Please try again.");
      }
    },
    async getCurrentUser({ commit }) {
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
    async createSlip({ commit, state }, payload) {      
      let uploadResponses = [];
      let urlResponses = [];
      const uid = state.user.uid;
      const date = payload.dateOfPurchase;
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, "0");
      let uploadPath = `uploads/${uid}/images/${year}_${month}`;      
      commit("setLoader", true);
      commit("setFilesToUploadCount", payload.files.length);
      commit("setFilesUploadedCount", 0);
      commit("setFileUploadPercentage", 0);
      await Promise.all(payload.files.map(async (file) => {
        let fullUploadPath = `${uploadPath}/${file.name}`;
        try {
          let uploadResponse = await firebase.storage.uploadFile({
            remoteFullPath: fullUploadPath,
            localFile: fs.File.fromPath(file.path),
            onProgress: function (status) {
              commit("setFileUploadPercentage", status.percentageCompleted);
            }
          });
          commit("setFilesUploadedCount", state.getFilesUploadedCount + 1)
          uploadResponses.push(uploadResponse);
        } catch (error) {
          commit("setError", `${fullUploadPath} upload failed. Please try again`);
        }
      }));
      await Promise.all(payload.files.map(async (file) => {
        let fullUploadPath = `${uploadPath}/${file.name}`;
        try {
          let urlResponse = await firebase.storage.getDownloadUrl({
            remoteFullPath: fullUploadPath
          });
          urlResponses.push(urlResponse);
        } catch (error) {
          commit("setError", `${fullUploadPath} url retrieval failed. Please try again`);
        }
      }));      
      payload.files = [];
      urlResponses.forEach((urlResponse) => {
        payload.files.push({
          path: urlResponse,
          type: "online",
          softDelete: false
        })
      });
      payload.softDelete = false;            
      try {
        await firebase.firestore.collection(`slips_${uid}`).add(payload)
      } catch (error) {        
        payload.files.map((file) => {
          let fullUploadPath = `${uploadPath}/${file.name}`;
          firebase.storage.deleteFile({
            remoteFullPath: fullUploadPath
          });
        });
        commit("setError", `Slip creation failed. Please try again. ${error}`);
      }            
      commit("setCurrentSlip", payload);
      commit("pushNewSlip", payload);
      commit("setLoader", false);
    }
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
    },
    setFileUploadPercentage(state, val) {
      state.fileUploadPercentage = val;
    },
    setFilesToUploadCount(state, val) {
      state.filesToUploadCount;
    },
    setFilesUploadedCount(state, val) {
      state.filesUploadedCount;
    },
    setCurrentSlip(state, val) {
      state.currentSlip = val;
    },
    setSlips(state, val) {
      state.slips = val;
    },
    pushNewSlip(state, val) {      
      state.slips.push(val);
    }
  }
});