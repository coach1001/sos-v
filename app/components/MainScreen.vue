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
    <ScrollView>
      <FlexboxLayout
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        flexDirection="column"
      >
      </FlexboxLayout>
    </ScrollView>
  </Page>
</template>

<script>
import to from "await-to-js";
import { mapGetters } from "vuex";
import LoginScreen from "./LoginScreen";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader"
    })
  },
  created() {
    this.$store.commit("setLoader", false);
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$navigateTo(LoginScreen);
    }
  }
};
</script>

<style scoped>
</style>
