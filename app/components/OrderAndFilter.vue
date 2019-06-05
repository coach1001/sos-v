<template>
  <Page class="page">
    <ActionBar title="Save our Stuff" android:flat="true"/>
    <ScrollView>
      <FlexboxLayout
        alignItems="left"
        alignContent="center"
        justifyContent="center"
        flexDirection="column"
        style="width: 100%"
      >
        <Label text="Order" class="clabel margin-0"/>
        <Label text="Date of purchase" class="tlabel"/>
        <StackLayout>
          <check-box
            text="Newest first"
            :checked="descending"
            @checkedChange="checkChange($event.value, 'desc')"
          />
          <check-box
            text="Oldest first"
            :checked="ascending"
            @checkedChange="checkChange($event.value, 'asc')"
          />
        </StackLayout>
        <Label text="Filters" class="clabel"/>
        <Label text="Product type" class="tlabel"/>
        <StackLayout>
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
        <Label text="Product catergory" class="tlabel"/>
        <TextField @tap="openProductCatergoryList()" v-model="productCategory" class="category" editable="false"/>
        <StackLayout orientation="horizontal" style="margin-top: 5;">
          <Button class="filter-button" text="Close" @tap="$modal.close();"/>
          <Button class="filter-button" text="Clear" @tap="defaultValues"/>
          <Button class="filter-button" text="Apply" @tap="apply"/>
        </StackLayout>
      </FlexboxLayout>
      </ScrollView>
  </Page>
</template>

<script>
import to from "await-to-js";
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      pictureTypeProduct: false,
      pictureTypeProofOfPurchase: false,
      pictureTypeSerialNumber: false,
      productCategories: [
        "Home small appliance",
        "Home major appliance",
        "Consumer electronics",
        "Automotive",
        "Annual Licenses",
        "Other"
      ],
      productCategory: null,
      descending: null,
      ascending: null
    };
  },
  methods: {
    checkChange(val, direction) {
      if(direction === "desc") {
        if(val) {
          this.descending = true;
          this.ascending = false;
        } else {
          this.descending = false;
          this.ascending = true;
        }
      } else if(direction === "asc") {
        if(val) {
          this.descending = false;
          this.ascending = true;
        } else {
          this.descending = true;
          this.ascending = false;
        }
      }
    },
    defaultValues() {
      this.$store.dispatch("defaultFilter");
      this.initializeValues();      
    },
    apply() {
      const order = this.descending ? "desc" : "asc";
      let pictureTypeFilter = [];
      if(this.pictureTypeProduct) {
        pictureTypeFilter.push("Product");
      }
      if(this.pictureTypeProofOfPurchase) {
        pictureTypeFilter.push("Proof of purchase");
      }
      if(this.pictureTypeSerialNumber) {
        pictureTypeFilter.push("Serial number");
      }
      this.$store.dispatch("applyFilter", {
        order: order,
        productCategoryFilter: this.productCategory,
        pictureTypeFilter: pictureTypeFilter
      });
      this.$modal.close();
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
    initializeValues() {
      const order = this.$store.getters.getOrder;
      if(order === "desc") {
        this.descending = true;
        this.ascending = false;  
      } else if(order === "asc") {
        this.descending = false;
        this.ascending = true;
      }
      
      const pictureType = this.$store.getters.getPictureTypeFilter;
      this.pictureTypeProduct = false;
      this.pictureTypeProofOfPurchase = false;
      this.pictureTypeSerialNumber = false;
      pictureType.map(type => {
        if(type === "Product") {
          this.pictureTypeProduct = true;
        } else if(type === "Proof of purchase") {
          this.pictureTypeProofOfPurchase = true;
        } else if(type === "Serial number") {
          this.pictureTypeSerialNumber = true;
        }
      });

      this.productCategory = this.$store.getters.getProductCategoryFilter;
    }
  }, 
  created() {
    this.initializeValues();
  }
};
</script>

<style scoped>
.page {
  padding: 20;
}
.tlabel {
  font-size: 15%;
  margin-top: 10;
  color: silver;
}
.clabel {
  font-size: 15%;
  margin-top: 10;
  color: black;
}
.margin-0 {
  margin: 0;
}
.category {
  width: 80%;
}
.filter-button {
  text-transform: capitalize;
  background-color: #2a3b89;
  color: white;
}
</style>
