<template>
  <Page class="page">
    <ActionBar title="Upload Slip" android:flat="true">
      <NavigationButton
        text="Go Back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateTo(mainScreen, {clearHistory: true})"
      />
    </ActionBar>
    <GridLayout rows="auto, *">
      <ActivityIndicator height="20%" width="20%" row="1" :busy="showLoader"/>

      <ScrollView v-if="!showLoader" row="1" scrollBarIndicatorVisible="false">
        <StackLayout class="main-stack-margin">
          <Label text="Add Picture Image/File(s)" class="tlabel"/>
          <Fab
            @tap="addImageOrFile"
            icon="res://baseline_add_white_24"
            rippleColor="#f1f1f1"
            class="fab-button hl"
          ></Fab>
          <WrapLayout>
            <StackLayout :key="idx" v-for="(img, idx) in shownImages">
              <Image @tap="showImage(idx)" :src="img.path" width="75" height="75"/>
              <Button @tap="removeImage(img)" text="Remove"/>
            </StackLayout>
          </WrapLayout>
          <Label text="Picture type" class="tlabel"/>
          <StackLayout style="padding-top: 20;">
            <check-box
              text="Product"
              :checked="pictureTypeProduct"
              @checkedChange="pictureTypeProduct = $event.value"
            />
            <check-box
              text="Proof of purchase"
              :checked="pictureTypeProofOfPurchase"
              @checkedChange="pictureTypeProofOfPurchase = $event.value"
            />
            <check-box
              text="Serial Number"
              :checked="pictureTypeSerialNumber"
              @checkedChange="pictureTypeSerialNumber = $event.value"
            />
          </StackLayout>
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
          <TextField keyboardType="number" v-model="approximateValue"/>
          <Label text="Notes" class="tlabel"/>
          <TextField v-model="notes"/>
          <StackLayout class="space"></StackLayout>
        </StackLayout>
      </ScrollView>
      <StackLayout row="1" orientation="horizontal" class="hr">
        <Fab
          @tap="createSlip"
          v-if="!currentSlip"
          horizontalAlignment="right"
          icon="res://baseline_cloud_upload_white_24"
          rippleColor="#f1f1f1"
          class="fab-button mb-15"
        ></Fab>
        <Fab
          @tap="updateSlip"
          v-if="currentSlip"
          horizontalAlignment="right"
          icon="res://baseline_save_white_24"
          rippleColor="#f1f1f1"
          class="fab-button mb-15"
        ></Fab>
        <Fab
          @tap="deleteSlip"
          v-if="currentSlip"
          horizontalAlignment="right"
          icon="res://baseline_delete_white_24"
          rippleColor="#f1f1f1"
          class="fab-button mb-15"
        ></Fab>
      </StackLayout>
    </GridLayout>
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
      pictureTypeProduct: null,
      pictureTypeProofOfPurchase: null,
      pictureTypeSerialNumber: null,    
      isChecked: null,
      validationMessage: "",
      removeImages: [],
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
      approximateValue: "",
      notes: "",
      requiredFields: [
        {
          field: "itemDescription",
          type: "text",
          error: "Item description is required"
        },
        {
          field: "productCategory",
          type: "text",
          error: "Product catergory is required"
        },
        {
          field: "pictureType",
          type: "array",
          error: "Atleast one picture type is required",
          minLength: 1
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader",
      error: "getError",
      currentSlip: "getCurrentSlip"
    }),
    shownImages() {
      return this.images.filter(image => !image.softDelete);
    }
  },
  watch: {
    error(val) {
      if (val) {
        this.$store.commit("setError", null);
        alert(val);
      }
    },
    currentSlip(val) {
      if (val) {
        this.mapStoreToSlip(val);
      }
    }
  },
  mounted() {
    if (this.currentSlip) {
      this.mapStoreToSlip(this.currentSlip);
    }
  },
  methods: {
    countImages() {
      let validAmount = true;
      let count = 0;
      this.images.forEach(image => {
        if (image.softDelete === false) {
          count += 1;
        }
      });
      if (count > 5) {
        validAmount = false;
      }
      return validAmount;
    },
    validateForm() {
      let formValid = true;
      this.validationMessage = "";
      this.requiredFields.forEach(field => {
        if (field.type === "text") {
          if (this[field.field] === "" || this[field.field] === null) {
            this.validationMessage += `${field.error}\n`;
            formValid = false;
          }
        } else if (field.type === "array") {
          if (field.minLength) {
            if (
              this[field.field] &&
              this[field.field].length < field.minLength
            ) {
              this.validationMessage += `${field.error}\n`;
              formValid = false;
            }
          } else if (field.maxLength) {
            if (
              this[field.field] &&
              this[field.field].length > field.maxLength
            ) {
              this.validationMessage += `${field.error}\n`;
              formValid = false;
            }
          }
        }
      });
      if (!this.countImages()) {
        this.validationMessage += "Only 5 images allowed per slip";
        formValid = false;
      }
      return formValid;
    },
    mapStoreToSlip(currentSlip) {
      this.images = JSON.parse(JSON.stringify(currentSlip.files));
      this.pictureType = [];
      currentSlip.pictureType.map(type => {
        if(type === "Product") {
          this.pictureTypeProduct = true;
          this.pictureType.push("Product");
        } else if(type === "Proof of purchase") {
          this.pictureTypeProofOfPurchase = true;
          this.pictureType.push("Proof of purchase");
        } else if(type === "Serial number") {
          this.pictureTypeSerialNumber = true;
          this.pictureType.push("Serial number");
        }
      });
      this.itemDescription = currentSlip.itemDescription;
      this.dateOfPurchase = currentSlip.dateOfPurchase;
      this.productCategory = currentSlip.productCategory;
      this.storeOrInstitution = currentSlip.storeOrInstitution;
      this.location = currentSlip.location;
      this.warranteeGuaranteeExpirationDate =
        currentSlip.warranteeGuaranteeExpirationDate;
      this.approximateValue = currentSlip.approximateValue
        ? String(currentSlip.approximateValue)
        : "";
      this.notes = currentSlip.notes;
      this.warranteeGuaranteeExpirationDateText = this
        .warranteeGuaranteeExpirationDate
        ? this.warranteeGuaranteeExpirationDate.toLocaleDateString()
        : "";
      this.dateOfPurchase
        ? (this.dateOfPurchaseText = this.dateOfPurchase.toLocaleDateString())
        : "";
    },
    mapSlipToStore() {
      let payload = {};
      payload.files = JSON.parse(JSON.stringify(this.images));
      payload.pictureType = [];
      if(this.pictureTypeProduct) payload.pictureType.push("Product")
      if(this.pictureTypeProofOfPurchase) payload.pictureType.push("Proof of purchase");
      if(this.pictureTypeSerialNumber) payload.pictureType.push("Serial number");
      payload.itemDescription = this.itemDescription;
      payload.dateOfPurchase = this.dateOfPurchase;
      payload.productCategory = this.productCategory;
      payload.storeOrInstitution = this.storeOrInstitution;
      payload.location = this.location;
      payload.warranteeGuaranteeExpirationDate = this.warranteeGuaranteeExpirationDate;
      payload.approximateValue = Number(this.approximateValue);
      payload.notes = this.notes;
      return payload;
    },
    deleteSlip() {
      confirm({
        title: "Delete slip",
        message: "Are you sure want to delete this slip?",
        okButtonText: "Yes",
        cancelButtonText: "No"
      }).then(async result => {
        if (result) {
          await this.$store.dispatch("deleteSlip", this.currentSlip.id);
          this.$navigateTo(this.mainScreen, { clearHistory: true });
        }
      });
    },
    updateSlip() {
      confirm({
        title: "Update slip",
        message: "Are you sure want to update this slip?",
        okButtonText: "Yes",
        cancelButtonText: "No"
      }).then(result => {
        if (result) {
          if (this.validateForm()) {
            this.$store.dispatch("updateSlip", this.mapSlipToStore());
          } else {
            this.$store.commit("setError", this.validationMessage);
          }
        }
      });
    },
    showImage(idx) {
      let images = [];
      this.images.map(image => {
        if (image.type !== "online") {
          images.push(`file://${image.path}`);
        } else {
          images.push(image.path);
        }
      });
      this.$photoViewer.startIndex = idx;
      this.$photoViewer.showViewer(images);
    },
    createSlip() {
      
      this.pictureType = [];
      if(this.pictureTypeProduct) this.pictureType.push("Product")
      if(this.pictureTypeProofOfPurchase) this.pictureType.push("Proof of purchase");
      if(this.pictureTypeSerialNumber) this.pictureType.push("Serial number");

      if (this.validateForm()) {
        this.$store.dispatch("createSlip", this.mapSlipToStore());
      } else {
        this.$store.commit("setError", this.validationMessage);
      }
    },
    removeImage(img) {
      let deleteIdx = [];
      this.images.forEach((image, idx) => {
        if (image.name === img.name) {
          this.images[idx].softDelete = true;
          if (image.type === "local") {
            deleteIdx.push(idx);
          }
        }
      });
      deleteIdx = deleteIdx.reverse();
      deleteIdx.forEach(idx => {
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
                    path: filePath,
                    softDelete: false,
                    type: "local"
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
                    path: filePath,
                    softDelete: false,
                    type: "local"
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
.space {
  height: 45;
}
.main-stack-margin {
  margin-left: 20;
  margin-right: 20;
}
TextField {
  margin-bottom: 10;
  margin-right: 10;
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
  height: 45;
  width: 45;
  margin: 10;
  background-color: #ff4081;
  vertical-align: bottom;
}
.mb-15 {
  margin-bottom: 15;
  margin-left: 5;
}
.mb-30 {
  margin: 30;
}
.hl {
  horizontal-align: left;
}
.hr {
  horizontal-align: right;
}
</style>
