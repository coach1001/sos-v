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
            @checkedChange="descending = $event.value;"
          />
          <check-box
            text="Oldest first"
            :checked="ascending"
            @checkedChange="ascending = $event.value;"
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
        <StackLayout orientation="horizontal">
          <Button class="filter-button" text="Close" @tap="$modal.close();"/>
          <Button class="filter-button" text="Default" @tap="defaultValues"/>
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
      pictureType: [],
      descending: null,
      ascending: null
    };
  },
  methods: {
    defaultValues() {
    },
    apply() {
      this.$modal.close();
    },
    changeOrder(val) {

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
  },
  mounted() {
    this.descending = this.$store.getters.getOrder === "desc" ? true : false;
    this.ascending = this.$store.getters.getOrder === "asc" ? true : false;
    this.productCategory = this.$store.getters.getProductCategoryFilter;
    this.pictureType = this.$store.getters.getPictureTypeFilter;
  }
};
</script>

<style scoped>
.page {
  padding: 20;
}
.tlabel {
  font-size: 15%;
  margin-top: 20;
  color: silver;
}
.clabel {
  font-size: 15%;
  margin-top: 20;
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
