<template>
  <Page class="page">
    <ActionBar
      title="Slips"
      android:flat="true"
    >
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
