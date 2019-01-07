<template>
  <Page class="page">
    <ActionBar
      title="Save our Stuff"
      android:flat="true"
    >
      <ActionItem
        ios.systemIcon="2"
        ios.position="right"
        android.systemIcon="ic_clear_holo_light"
      />
    </ActionBar>
    <ScrollView>
      <FlexboxLayout
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        flexDirection="column"
      >
        <ActivityIndicator :busy="showLoader" />
        <Label
          class="h2"
          text="MAIN MENU"
        />
        <Button
          v-if="loggedIn"
          @tap="logout()"
          class="login-btn"
          text="Logout"
        />
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
      showLoader: "getShowLoader",
      loggedIn: "getLoggedIn"
    })
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
