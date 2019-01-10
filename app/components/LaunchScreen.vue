<template>
  <Page class="page">
    <ActionBar
      title="Save our Stuff"
      android:flat="true"
    />
    <ScrollView>
      <FlexboxLayout
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        flexDirection="column"
      >
        <ActivityIndicator busy="true" />
      </FlexboxLayout>
    </ScrollView>
  </Page>
</template>

<script>
import to from "await-to-js";
import MainScreen from "./MainScreen";
import LoginScreen from "./LoginScreen";
import * as camera from "nativescript-camera";

export default {
  data() {
    return {};
  },
  methods: {
    checkUserStatus() {
      this.$store.dispatch("getCurrentUser").then((result) => {
        if (result.emailVerified) {
          this.$store.commit("setLoggedIn", true);
          this.$store.commit("setUser", result);
          this.$navigateTo(MainScreen, { clearHistory: true });
        } else {
          this.$store.commit("setLoggedIn", false);
          this.$store.commit("setUser", null);
          this.$navigateTo(LoginScreen, { clearHistory: true });
        }
      }, (err) => {
        this.$store.commit("setLoggedIn", false);
        this.$store.commit("setUser", null);
        this.$navigateTo(LoginScreen, { clearHistory: true });
      })
    }
  },
  created() {
    this.checkUserStatus();
  }
};
</script>

<style scoped>
</style>
