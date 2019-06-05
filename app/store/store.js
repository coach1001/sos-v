import Vue from "nativescript-vue"
import Vuex from "vuex"
import to from "await-to-js"
import firebase from "nativescript-plugin-firebase";
import * as fs from "tns-core-modules/file-system";
import * as uniqid from 'uniqid';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    pictureTypeFilter: [],
    productCategoryFilter: null,
    order: "desc",
    documentsPerLoad: 10,
    loadedAll: false,
    lastVisible: null,
    user: null,
    error: null,
    showLoader: false,
    loggedIn: null,
    userRegistered: false,
    fileUploadPercentage: null,
    filesToUploadCount: null,
    filesUploadedCount: null,
    currentSlip: {},
    slips: [],    
    filter: null
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
    getSlips: state => state.slips,
    getOrder: state => state.order,
    getPictureTypeFilter: state => state.pictureTypeFilter,
    getProductCategoryFilter: state => state.productCategoryFilter
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
    async loadSlips({ commit, state }) {
      let slips = [];
      let query = null;
      commit("setLoader", true);

      if(state.lastVisible && !state.loadedAll) {
        query = await firebase.firestore.collection('slips')
          .where("softDelete", "==", false)                
          .where("ownerId" , "==", state.user.uid)
          .where("productCategory", "==", state.productCategoryFilter ? state.productCategoryFilter : "*")
          .orderBy("dateOfPurchase", state.order)
          .startAfter(state.lastVisible)
          .limit(state.documentsPerLoad);
      }
      else if(!state.loadedAll){
        query = await firebase.firestore.collection('slips')
          .where("softDelete", "==", false)                
          .where("ownerId" , "==", state.user.uid)
          .where("productCategory", "==", state.productCategoryFilter ? state.productCategoryFilter : "*")
          .orderBy("dateOfPurchase", state.order)
          .limit(state.documentsPerLoad);
      }
      if(query) {
        query.get()
        .then((querySnapShot) => {
          if(!state.loadedAll) {
            if(querySnapShot.docs.length < state.documentsPerLoad) {
              commit("setLoadedAll", true);
            }
            let lastVisible = querySnapShot.docs[querySnapShot.docs.length-1];
            querySnapShot.forEach(doc => {
              slips.push({ ...doc.data(), id: doc.id });                        
            });

            commit("setLoader", false);
            commit("setSlips", slips);
            commit("setLastVisible", lastVisible);

          }
        })
        .catch(err => {
          commit("setLoader", false);
          commit("setError", `Error retrieving slips. Relaunch application. Error : ${err}`);          
        });
      } else {
        commit("setLoader", false);
      }
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
          urlResponses.push({ urlResponse: urlResponse, name: file.name});
        } catch (error) {
          commit("setError", `${fullUploadPath} url retrieval failed. Please try again`);
        }
      }));
      payload.files = [];
      urlResponses.forEach((urlResponse) => {
        payload.files.push({
          path: urlResponse.urlResponse,
          type: "online",
          softDelete: false,
          name: urlResponse.name
        })
      });
      payload.softDelete = false;
      let createResult;
      try {
        payload.ownerId = state.user.uid;
        payload.uqId = uniqid();
        createResult = await firebase.firestore.collection('slips').add(payload);
      } catch (error) {        
        payload.files.map((file) => {
          let fullUploadPath = `${uploadPath}/${file.name}`;
          firebase.storage.deleteFile({
            remoteFullPath: fullUploadPath
          });
        });
        commit("setError", `Slip creation failed. Please try again. ${error}`);
      }
      payload.id = createResult.id;
      commit("setCurrentSlip", payload);
      commit("pushNewSlip", payload);
      commit("orderSlips");
      commit("setLoader", false);
    },
    async updateSlip({ commit, state }, payload) {
      let uploadResponses = [];
      let filesToUpload = [];
      const uid = state.user.uid;
      const date = payload.dateOfPurchase;
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, "0");
      let uploadPath = `uploads/${uid}/images/${year}_${month}`;
      payload.files.forEach((file, index) => {
        if (file.type === 'local' && file.softDelete === false) {
          filesToUpload.push({ ...file, orgIdx: index });
        }
      });      
      commit("setLoader", true);
      commit("setFilesToUploadCount", filesToUpload.length);
      commit("setFilesUploadedCount", 0);
      commit("setFileUploadPercentage", 0);      
      await Promise.all(filesToUpload.map(async (file) => {
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
      await Promise.all(filesToUpload.map(async (file) => {
        let fullUploadPath = `${uploadPath}/${file.name}`;
        try {
          let urlResponse = await firebase.storage.getDownloadUrl({
            remoteFullPath: fullUploadPath
          });
          payload.files[file.orgIdx].type = "online";
          payload.files[file.orgIdx].softDelete = false;
          payload.files[file.orgIdx].path = urlResponse;
          payload.files[file.orgIdx].name = file.name;                              
        } catch (error) {
          commit("setError", `${fullUploadPath} url retrieval failed. Please try again`);
        }
      }));      
      try {
        payload.ownerId = state.user.uid;     
        await firebase.firestore.collection('slips').doc(state.currentSlip.id).set(payload, {merge: true});
      } catch (error) {
        filesToUpload.map((file) => {
          let fullUploadPath = `${uploadPath}/${file.name}`;
          firebase.storage.deleteFile({
            remoteFullPath: fullUploadPath
          });
        });
        commit("setError", `Slip updating failed. Please try again. ${error}`);
      }
      payload.id = state.currentSlip.id;
      commit("setCurrentSlip", payload);
      commit("replaceSlip", payload);
      commit("orderSlips");
      commit("setLoader", false);
    },
    async deleteSlip({ commit, state }, docId) {
      let deletedIndex = null;
      commit("setLoader", true);
      try {
        await firebase.firestore.collection('slips').doc(docId).set({
          softDelete: true
        }, { merge: true });
        state.slips.forEach((slip, index) => {
          if (slip.id === docId) {
            deletedIndex = index;
          }
        });
        commit("removeSlip", deletedIndex);        
        commit("setCurrentSlip", {});
        commit("setLoader", false);
      } catch {
        commit("setError", `Slip deletion failed. Please try again. ${error}`);
        commit("setLoader", false);
      }
    },
    clearSlips({ commit, dispatch }) {
      commit("setSlips", []);
      commit("setLastVisible", null);
      commit("setLoadedAll", false);
      dispatch("loadSlips");  
    },
    changeOrder({ state, dispatch, commit }) {
      state.order === "desc" ? commit("setOrder", "asc") : commit("setOrder", "desc");
      dispatch("clearSlips");
    },
    defaultFilter({ dispatch, commit }) {
      commit("setOrder", "desc");
      commit("setPictureTypeFilter", []);
      commit("setProductCategoryFilter", null);
    },
    applyFilter({ dispatch, commit }, payload) {
      const order = payload.order;
      const pictureTypeFilter = payload.pictureTypeFilter;
      const productCategoryFilter = payload.productCategoryFilter;
      commit("setOrder", order);
      commit("setPictureTypeFilter", pictureTypeFilter);
      commit("setProductCategoryFilter", productCategoryFilter);
      dispatch("clearSlips");
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
      if(state.slips.length > 0 && val.length > 0) {
        let copySlips = [...state.slips];
        copySlips = copySlips.concat(val);
        Vue.set(state, 'slips', copySlips);
      } else {
        state.slips = val;
      }
    },
    pushNewSlip(state, val) {
      state.slips.push(val);
    },
    removeSlip(state, val) {
      state.slips.splice(val, 1);      
    },
    replaceSlip(state, val) {
      let index;
      state.slips.forEach((slip, idx) => {
        if(slip.id === val.id) {
          index = idx;
        }
      });
      state.slips[index] = val;
      
    },
    setLastVisible(state, val) {
      state.lastVisible = val;
    },
    setLoadedAll(state, val) {
      state.loadedAll = val;
    },
    setOrder(state, val) {
      state.order = val;
    },
    setPictureTypeFilter(state, val) {
      Vue.set(state, 'pictureTypeFilter', val);
    },
    setProductCategoryFilter(state, val) {
      state.productCategoryFilter = val;
    }
  }
});