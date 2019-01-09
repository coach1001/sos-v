<template>
  <Page class="page">
    <ActionBar
      title="Upload Slip"
      android:flat="true"
    >
      <NavigationButton
        text="Go Back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateTo(mainScreen)"
      />
    </ActionBar>
    <ScrollView scrollBarIndicatorVisible="false">
      <StackLayout>
        <ActivityIndicator :busy="showLoader" />
        <Label text="Picture type" class="tlabel"/>
        <TextField
          @tap="openPictureTypeList()"
          v-model="pictureType"
          editable="false"
        />
        <Label text="Product catergory" class="tlabel"/>
        <TextField
          @tap="openProductCatergoryList()"
          v-model="productCategory"
          editable="false"
        />
        <Label text="Store/Institution" class="tlabel"/>
        <TextField v-model="storeOrInstitution"/>
        <Label text="Store/Institution location" class="tlabel"/>
        <TextField v-model="location"/>
        <Label text="Warrantee/Guarantee expiration date" class="tlabel"/>
        <TextField @tap="openExpirationDatePicker()" v-model="warranteeGuaranteeExpirationDate" editable="false"/>
        <Label text="Item approximate value" class="tlabel"/>
        <TextField v-model="appoximateValue"/>
        <!-- <Label text="Reminder option" class="h2"/> -->
        <Label text="Notes" class="tlabel"/>
        <TextField v-model="notes"/>
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
      pictureTypes: ["Product", "Proof of purchase", "Serial number"],
      pictureType: "",
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
      warranteeGuaranteeExpirationDate: "",
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
    openExpirationDatePicker() {
      console.log("Open date picker")
      this.$datePicker
      .pickDate({
        datePickerMode: "calendar"
      });
    },
    openPictureTypeList() {
      action("Select picture type...", "Close", this.pictureTypes).then(
        (result) => {
          if(this.pictureTypes.includes(result)) {
            this.pictureType = result;
          }
        }
      );
    },
    openProductCatergoryList() {
      action("Select product catergory...", "Close", this.productCategories).then(
        (result) => {
          if(this.productCategories.includes(result)) {
            this.productCategory = result;
          }
        }
      );
    },
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
  font-size: 20;
  margin-top: 20;
  color: silver;
}
</style>
