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
      <!-- <TextField v-model="filter" hint="Filter"/> -->
      <Button class="filter-button" text="Order & Filter Options" @tap="openOrderAndFilterModal"/>
      <ListView
        row="1"
        for="slip in slips"
        @itemTap="openSlip"
        @loadMoreItems="loadMore"
      >
        <v-template>
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
                  <Label
                    class="pill-c"
                    :text="slip.productCategory"
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
        </v-template>
      </ListView>
      <Fab
        @tap="addSlip"
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
import OrderAndFilter from "./OrderAndFilter";

export default {
  data() {
    return {
    };
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
        this.$store.dispatch("loadSlips");
      } 
    },
    loadMore() {
      this.$store.dispatch("loadSlips");
    },
    changeOrder() {
      this.$store.dispatch("changeOrder");
    },
    openOrderAndFilterModal() {
      this.$showModal(OrderAndFilter)
    }
  },
  mounted() {
    this.resetMenu();    
  }
};
</script>

<style scoped>
.fab-button {
  height: 55;
  width: 55;
  margin: 15;
  background-color: #ff4081;
  horizontal-align: right;
  vertical-align: bottom;
}
ListView {
  separator-color: lightgray;
}
.card-s {
  padding: 5;  
}
.hr-light {
  border: gray solid 1px;
  height: 0;
}
.pill {
  font-size: 8%;
  background-color: #2a3b89;
  color: white;
  border-radius: 50%;
  padding: 3;
  margin-top: 3;
  margin-right: 3;
  margin-bottom: 3;
}
.pill-c {
  font-size: 8%;
  background-color: orange;
  color: black;
  border-radius: 50%;
  padding: 3;
  margin-top: 3;
  margin-right: 3;
  margin-bottom: 3;
}
.item-d {
  font-weight: bold;
  margin-bottom: 5;
  font-size: 14%;
}
.heading-d {
  font-weight: bold;
  font-size: 10%;
}
.pill-d {
  font-size: 8%;
  background-color: #FF4136;
  color: white;
  border-radius: 50%;
  padding: 3;
  margin-top: 3;
  margin-right: 3;
  margin-bottom: 3;
}
.pill-g {
  font-size: 8%;
  background-color: darkgreen;
  color: white;
  border-radius: 50%;
  padding: 3;
  margin-top: 3;
  margin-right: 3;
  margin-bottom: 3;
}
.tlabel {
  font-size: 19%;
  /* margin-top: 20; */
  color: silver;
}
.filter-button {
  text-transform: capitalize;
  background-color: #2a3b89;
  color: white;

}
</style>
