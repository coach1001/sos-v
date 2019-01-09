<template>
  <Page class="page">
    <ActionBar title="Upload Slip" android:flat="true">
      <NavigationButton
        text="Go Back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateTo(mainScreen)"
      />
    </ActionBar>
    <ScrollView scrollBarIndicatorVisible="false">
      <StackLayout>
        <Label text="Item Description" class="tlabel"/>
        <TextField v-model="storeOrInstitution"/>
        <Label text="Date of purchase" class="tlabel"/>
        <TextField
          @tap="openDateOfPurchaseDatePicker()"
          editable="false"
          :text="dateOfPurchaseText"
        />
        <Label text="Picture type" class="tlabel"/>
        <FilterSelect
          modal_title="Select picture type(s)"
          hint="..."
          height="100%"
          :items="pictureTypes"
          multiple="true"
          :selected="pictureType"
          allowSearch="false"
          primary_key="name"
          xbtn
          @change="pictureTypeSelectChanged"
          @close="pictureTypeSelectClosed"
        ></FilterSelect>
        <Label text="Product catergory" class="tlabel"/>
        <TextField @tap="openProductCatergoryList()" v-model="productCategory" editable="false"/>
        <Label text="Store/Institution" class="tlabel"/>
        <TextField v-model="storeOrInstitution"/>
        <Label text="Store/Institution location" class="tlabel"/>
        <TextField v-model="location"/>
        <Label text="Warrantee/Guarantee expiration date" class="tlabel"/>
        <TextField
          @tap="openExpirationDatePicker()"
          :text="warranteeGuaranteeExpirationDateText"
          editable="false"
        />
        <Label text="Item approximate value" class="tlabel"/>
        <TextField  keyboardType="number" v-model="appoximateValue"/>
        <!-- <Label text="Reminder option" class="h2"/> -->
        <Label text="Notes" class="tlabel"/>
        <TextField v-model="notes"/>
        <ActivityIndicator :busy="showLoader"/>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import to from "await-to-js";
import { mapGetters } from "vuex";
import MainScreen from "./MainScreen";

export default {
  data() {
    return {
      mainScreen: MainScreen,
      itemDescription: "",
      dateOfPurchase: null,
      dateOfPurchaseText: "",
      pictureTypes: [
        { name: "Product" },
        { name: "Proof of purchase" },
        { name: "Serial number" }
      ],
      pictureType: [],
      pictureTypeCopy: [],
      productCategories: [
        "Home small appliance",
        "Home major appliance",
        "Consumer electronics",
        "Automotive",
        "Annual Licenses",
        "Other"
      ],
      productCategory: "",
      storeOrInstitution: "",
      location: "",
      warranteeGuaranteeExpirationDate: null,
      warranteeGuaranteeExpirationDateText: "",
      appoximateValue: "",
      reminderOption: "",
      notes: ""
    };
  },
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader"
    })
  },
  methods: {
    openDateOfPurchaseDatePicker() {
      this.$datePicker
        .pickDate({
          startingDate: this.dateOfPurchase ? this.dateOfPurchase : new Date()
        })
        .then(date => {
          this.dateOfPurchase = new Date(date.year, date.month - 1, date.day);
          this.dateOfPurchaseText = this.dateOfPurchase.toLocaleDateString();
        });
    },
    openExpirationDatePicker() {
      const now = new Date();
      this.$datePicker
        .pickDate({
          startingDate: this.warranteeGuaranteeExpirationDate
            ? this.warranteeGuaranteeExpirationDate
            : new Date()
        })
        .then(date => {
          this.warranteeGuaranteeExpirationDate = new Date(
            date.year,
            date.month - 1,
            date.day
          );
          this.warranteeGuaranteeExpirationDateText = this.warranteeGuaranteeExpirationDate.toLocaleDateString();
        });
    },
    openProductCatergoryList() {
      action(
        "Select product catergory...",
        "Close",
        this.productCategories
      ).then(result => {
        if (this.productCategories.includes(result)) {
          this.productCategory = result;
        }
      });
    },
    pictureTypeSelectClosed(val) {
      this.pictureType = this.pictureTypeCopy.slice(0);
    },
    pictureTypeSelectChanged(val) {
      this.pictureTypeCopy = val.selected.slice(0);
    }
  }
};
</script>

<style scoped>
StackLayout {
  margin-left: 20;
  margin-right: 20;
}
TextField {
  margin-bottom: 20;
  margin-right: 30;
}
.tlabel {
  font-size: 19%;
  margin-top: 20;
  color: silver;
}
</style>
