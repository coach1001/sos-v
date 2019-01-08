<template>
  <Page class="page">
    <ActionBar title="Forgot your password" android:flat="true">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="$navigateTo(login)"/>
    </ActionBar>
    <ScrollView>
      <FlexboxLayout
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Image src="res://logo" stretch="aspectFill" height="50%" width="50%"/> 
        <ActivityIndicator :busy="showLoader"/>
        <FlexboxLayout width="80%" flexDirection="column">
          <TextField 
            keyboardType="email"
            v-model="emailAddress" 
            :text="emailAddress" 
            hint="Email Address"
          />
          <Button @tap="requestPasswordReset()" class="login-btn" text="Reset password"/>
        </FlexboxLayout>
      </FlexboxLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { mapGetters } from "vuex";
import LoginScreen from "./LoginScreen";

export default {
  data() {
    return {
      emailAddress: null,
      login: LoginScreen
    };
  },
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader"
    })
  },
  methods: {
    requestPasswordReset() {
      if(this.emailAddress) {
        this.$store.dispatch("requestPasswordReset", {emailAddress: this.emailAddress});
        alert("Password reset sent, please check your email.");
        this.$navigateTo(this.login);
      } else {
        alert("Email address is required.");
      }
    }
  }
};
</script>

<style scoped>
.link-container {
  margin-top: 20;
}

.links {
  text-decoration: underline;
  color: gray;
}

.login-btn {
  margin-top: 15;
}
</style>
