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
        <Label text="Add Picture Image/File(s)" class="tlabel"/>
        <Fab
          @tap="addImageOrFile"
          icon="res://baseline_add_white_24"
          rippleColor="#f1f1f1"
          class="fab-button"
        ></Fab>
        <WrapLayout>
          <StackLayout :key="idx" v-for="(img, idx) in images">
            <Image :src="img.path" width="75" height="75"/>
            <Button @tap="removeImage(idx)" text="Remove"/>
          </StackLayout>
        </WrapLayout>
        <Label text="Picture type" class="tlabel"/>
        <FilterSelect
          modal_title="Picture type(s)"
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
        <Label text="Item Description" class="tlabel"/>
        <TextField v-model="itemDescription"/>
        <Label text="Date of purchase" class="tlabel"/>
        <TextField
          @tap="openDateOfPurchaseDatePicker()"
          editable="false"
          :text="dateOfPurchaseText"
        />
        <Label text="Product catergory" class="tlabel"/>
        <TextField @tap="openProductCatergoryList()" v-model="productCategory" editable="false"/>
        <Label text="Store/Institution" class="tlabel"/>
        <TextField v-model="storeOrInstitution"/>
        <Label text="Store/Institution location" class="tlabel"/>
        <TextField v-model="location"/>
        <Label text="Warrantee/Guarantee" class="tlabel"/>
        <Label text="Expiration date" class="slabel"/>
        <TextField
          @tap="openExpirationDatePicker()"
          :text="warranteeGuaranteeExpirationDateText"
          editable="false"
        />
        <Label text="Item approximate value" class="tlabel"/>
        <TextField keyboardType="number" v-model="appoximateValue"/>
        <Label text="Notes" class="tlabel"/>
        <TextField v-model="notes"/>
        <ActivityIndicator :busy="showLoader"/>
        <Button @tap="createSlip" text="Create Slip"/>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { mapGetters } from "vuex";
import MainScreen from "./MainScreen";
import * as camera from "nativescript-camera";
import * as imagepicker from "nativescript-imagepicker";
import * as fs from "tns-core-modules/file-system";
import * as imageSourceModule from "tns-core-modules/image-source";
export default {
  data() {
    return {
      images: [],
      mainScreen: MainScreen,
      itemDescription: "",
      dateOfPurchase: new Date(),
      dateOfPurchaseText: new Date().toLocaleDateString(),
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
      notes: ""
    };
  },
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader",
      error: "getError"
    })
  },
  watch: {
    error(val) {
      if (val) {
        this.$store.commit("setError", null);
        alert(val);
      }
    }
  },
  methods: {
    createSlip() {
      let payload = {};
      payload.files = [...this.images];
      payload.pictureType = this.pictureType;
      payload.itemDescription = this.itemDescription;
      payload.dateOfPurchase = this.dateOfPurchase;
      payload.productCategory = this.productCategory;
      payload.storeOrInstitution = this.storeOrInstitution;
      payload.location = this.location;
      payload.warranteeGuaranteeExpirationDate = this.warranteeGuaranteeExpirationDate;
      payload.appoximateValue = Number(this.appoximateValue);
      payload.notes = this.notes;
      this.$store.dispatch("createSlip", payload);
    },
    removeImage(idx) {
      let file = fs.File.fromPath(this.images[idx].path);
      file.remove().then(() => {
        this.images.splice(idx, 1);
      });
    },
    addImageOrFile() {
      let uploadOptions = ["File System"];
      if (camera.isAvailable()) {
        uploadOptions.push("Camera");
      }
      action("Upload image from...", "Close", uploadOptions).then(result => {
        if (result === "File System") {
          let context = imagepicker.create({
            mode: "multiple"
          });
          context
            .authorize()
            .then(function() {
              return context.present();
            })
            .then(selection => {
              selection.forEach(imageAsset => {
                let uniqueString = String(new Date().getTime());
                let tempPath = fs.knownFolders.temp();
                let fileName = `SOS_${uniqueString}.jpg`;
                let filePath = fs.path.join(tempPath.path, fileName);
                imageSourceModule.fromAsset(imageAsset).then(imageSource => {
                  imageSource.saveToFile(filePath, "jpg");
                  this.images.push({
                    name: fileName,
                    path: filePath
                  });
                });
              });
            });
        } else if (result === "Camera") {
          camera.requestPermissions().then(() => {
            camera
              .takePicture({
                saveToGallery: false
              })
              .then(imageAsset => {
                let uniqueString = String(new Date().getTime());
                let tempPath = fs.knownFolders.temp();
                let fileName = `SOS_${uniqueString}.jpg`;
                let filePath = fs.path.join(tempPath.path, fileName);
                imageSourceModule.fromAsset(imageAsset).then(imageSource => {
                  imageSource.saveToFile(filePath, "jpg");
                  this.images.push({
                    name: fileName,
                    path: filePath
                  });
                });
              });
          });
        }
      });
    },
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
  margin-bottom: 10;
  margin-right: 30;
}
.tlabel {
  font-size: 19%;
  margin-top: 20;
  color: silver;
}
.slabel {
  font-size: 19%;
  color: silver;
}
.fab-button {
  height: 35;
  width: 35;
  margin: 5;
  background-color: #ff4081;
  horizontal-align: left;
  vertical-align: bottom;
}
</style>
