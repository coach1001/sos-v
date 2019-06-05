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
        <Label text="Picture type" class="tlabel"/>
        <TextField @tap="openPictureTypeList()" v-model="pictureType" editable="false"/>
        <Label text="Product catergory" class="tlabel"/>
        <TextField @tap="openProductCatergoryList()" v-model="productCategory" editable="false"/>
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
      productCategories: [
        "Home small appliance",
        "Home major appliance",
        "Consumer electronics",
        "Automotive",
        "Annual Licenses",
        "Other"
      ],
      pictureTypes: [
        "Product",
        "Proof of purchase",
        "Serial number"
      ],
      pictureType: null,
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
      this.$store.dispatch("applyFilter", {
        order: order,
        productCategoryFilter: this.productCategory,
        pictureTypeFilter: this.pictureType
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
    openPictureTypeList() {
      action(
        "Select picture type...",
        "Close",
        this.pictureTypes
      ).then(result => {
        if (this.pictureTypes.includes(result)) {
          this.pictureType = result;
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
      this.pictureType = this.$store.getters.getPictureTypeFilter;
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
