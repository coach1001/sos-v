<template>
  <Page class="page">
    <ActionBar title="Forgot your password" android:flat="true">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="$navigateTo(login)"/>
    </ActionBar>
    <ScrollView>
      <!-- <FlexboxLayout
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        flexDirection="column"
      >
        <ActivityIndicator :busy="showLoader"/>
        <FlexboxLayout width="70%" flexDirection="column">
          <TextField 
            v-model="emailAddress" 
            :text="emailAddress" 
            hint="Email Address"
          />
          <TextField 
            v-model="password" 
            :text="password" 
            secure="true" 
            hint="Password"
          />
          <TextField
            v-if="showConfirmPassword"
            v-model="confirmPassword"
            :text="confirmPassword"
            secure="true"
            hint="Confirm Password"
          />
          <Button v-if="!showConfirmPassword && !loggedIn" @tap="attemptLogin()" class="login-btn" text="Login"/>
          <Button
            v-if="showConfirmPassword"
            @tap="attemptRegister()"
            class="login-btn"
            text="Register"
          />
          
        </FlexboxLayout>
        <FlexboxLayout width="70%" class="link-container">
          <Label
            v-if="!showConfirmPassword"
            class="h3 links"
            width="50%"
            text="Forgot Password"
            textAlignment="left"
          />
          <Label
            v-if="showConfirmPassword"
            @tap="returnToLogin()"
            class="h3 links"
            width="50%"
            text="Back to Login"
            textAlignment="left"
          />
          <Label
            v-if="!showConfirmPassword"
            @tap="register()"
            class="h3 links"
            width="50%"
            text="Register"
            textAlignment="right"
          />
        </FlexboxLayout>
      </FlexboxLayout>-->
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
      password: null,
      confirmPassword: null,
      login: LoginScreen
    };
  },
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader"
    })
  },
  methods: {
    register() {
      this.showConfirmPassword = true;
    },
    returnToLogin() {
      this.showConfirmPassword = false;
    },
    logout() {
      this.$store.dispatch("logout");
    },
    attemptLogin() {
      this.$store.dispatch("login", {
        emailAddress: this.emailAddress,
        password: this.password
      });
    }
  }
};
</script>

<style scoped>
</style>
