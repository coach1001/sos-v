<template>
  <Page class="page">
    <ActionBar title="Slips" android:flat="true">
      <ActionItem
        @tap="logout()"
        ios.systemIcon="16"
        ios.position="right"
        text="Logout"
        android.position="popup"
      ></ActionItem>
    </ActionBar>
    <ActivityIndicator :busy="showLoader"/>
    <GridLayout rows="auto, *">      
      <ListView row="1" for="slip in slips" @itemTap="openSlip">
        <v-template>  
          <WrapLayout>        
            <Label :text="slip.itemDescription" width="50%"/>
            <Label :text="slip.storeOrInstitution" width="50%"/>
            <Label :text="slip.approximateValue" width="25%"/>
          </WrapLayout>
        </v-template>
      </ListView>
      <Fab
        @tap="addSlip()"
        row="1"
        icon="res://baseline_add_white_36"
        rippleColor="#f1f1f1"
        class="fab-button"
      ></Fab>
    </GridLayout>
  </Page>
</template>

<script>
import to from "await-to-js";
import { mapGetters } from "vuex";
import LoginScreen from "./LoginScreen";
import UploadSlipScreen from "./UploadSlipScreen";
import { setTimeout } from "tns-core-modules/timer";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader",
      slips: "getSlips"
    })
  },
  created() {
    this.$store.commit("setLoader", false);
  },
  methods: {    
    openSlip(slip) {      
      //console.log(slip);
      this.$store.commit("setCurrentSlip", slip.item);      
      this.$navigateTo(UploadSlipScreen);
    },
    logout() {
      this.$store.dispatch("logout");
      this.$navigateTo(LoginScreen, { clearHistory: true });
    },
    addSlip() {
      this.$navigateTo(UploadSlipScreen);
    },
    resetMenu() {      
      this.$store.commit("setCurrentSlip", null);
      if (this.slips.length === 0) {        
        setTimeout(() => {          
          this.$store.dispatch("loadSlips");    
        }, 1000);        
      }
    }
  },
  mounted() {
    this.resetMenu();
  }
};
</script>

<style scoped>
.fab-button {
  height: 70;
  width: 70;
  margin: 15;
  background-color: #ff4081;
  horizontal-align: right;
  vertical-align: bottom;
}
</style>
