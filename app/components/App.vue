<template>
  <Page class="page">
    <ActionBar title="Save our Stuff" android:flat="true"/>
    <ScrollView>
      <FlexboxLayout
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
          <Button v-if="!showConfirmPassword" @tap="attemptLogin()" class="login-btn" text="Login"/>
          <Button
            v-if="showConfirmPassword"
            @tap="attemptRegister()"
            class="login-btn"
            text="Register"
          />
          <Button v-if="loggedIn" @tap="logout()" class="login-btn" text="Logout"/>
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
      emailAddress: null,
      password: null,
      confirmPassword: null,
      showConfirmPassword: false
    };
  },  
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader",
      loggedIn: "getLoggedIn"
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
.link-container {
  margin-top: 20;
}
.links {
  text-decoration: underline;
  color: grey;
}
ActionBar {
  background-color: blue;
  color: white;
}
.login-btn {
  background-color: blue;
  color: white;
  margin-top: 15;
}
</style>
