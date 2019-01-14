<template>
  <Page class="page">
    <ActionBar
      title="Slips"
      android:flat="true"
    >
      <ActionItem
        @tap="logout()"
        ios.systemIcon="16"
        ios.position="right"
        text="Logout"
        android.position="popup"
      ></ActionItem>
    </ActionBar>
    <GridLayout rows="auto, *">
      <ActivityIndicator
        height="20%"
        width="20%"
        row="1"
        :busy="showLoader"
      />
      <ListView
        row="1"
        for="slip in slips"
        @itemTap="openSlip"
      >
        <v-template>
          <CardView
            margin="10"
            elevation="10"
            radius="1"
          >
            <StackLayout
              class="card-s"
              orientation="horizontal"
            >
              <StackLayout width="50%">
                <Label
                  class="item-d"
                  :text="slip.itemDescription"
                  height="50%"
                />
                <WrapLayout>
                  <Label
                    class="pill"
                    :key="idx"
                    v-for="(pic, idx) in slip.pictureType"
                    :text="pic"
                  />
                </WrapLayout>
              </StackLayout>
              <StackLayout width="50%">
                <Label
                  class="heading-d"
                  text="Purchase date:"
                />
                <WrapLayout>
                  <Label
                    class="pill-d"
                    :text="slip.dateOfPurchase ? new Date(slip.dateOfPurchase).toLocaleDateString() : 'No Purchase Date'"
                  />
                </WrapLayout>
                <Label
                  class="heading-d"
                  text="Approximate value:"
                />
                <WrapLayout>
                  <Label
                    class="pill-g"
                    :text="slip.approximateValue ? `R ${slip.approximateValue}`  : 'No Value'"
                  />
                </WrapLayout>
              </StackLayout>
            </StackLayout>
          </CardView>
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
      this.$store.commit("setCurrentSlip", slip.item);
      this.$navigateTo(UploadSlipScreen);
    },
    logout() {
      this.$store.dispatch("logout");
      this.$navigateTo(LoginScreen, { clearHistory: true });
    },
    addSlip() {
      this.$store.commit("setCurrentSlip", null);
      this.$navigateTo(UploadSlipScreen);
    },
    resetMenu() {
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
ListView {
  separator-color: transparent;
}
.card-s {
  padding: 10;
}
.pill {
  font-size: 10%;
  background-color: #687ad0;
  color: white;
  border-radius: 50%;
  padding: 3;
  margin-top: 3;
  margin-right: 3;
  margin-bottom: 3;
}
.item-d {
  font-weight: bold;
  margin-bottom: 5;
  font-size: 20%;
}
.heading-d {
  font-weight: bold;
  font-size: 10%;
}
.pill-d {
  font-size: 10%;
  background-color: #FF4136;
  color: white;
  border-radius: 50%;
  padding: 3;
  margin-top: 3;
  margin-right: 3;
  margin-bottom: 3;
}
.pill-g {
  font-size: 10%;
  background-color: darkgreen;
  color: white;
  border-radius: 50%;
  padding: 3;
  margin-top: 3;
  margin-right: 3;
  margin-bottom: 3;
}
</style>
