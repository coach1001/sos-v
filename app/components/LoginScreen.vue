<template>
  <Page class="page" actionBarHidden="true">
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
          <TextField keyboardType="email" v-model="emailAddress" :text="emailAddress" hint="Email Address"/>
          <TextField v-model="password" :text="password" secure="true" hint="Password"/>
          <Button @tap="login()" class="login-btn" text="Login"/>
        </FlexboxLayout>
        <FlexboxLayout width="80%" class="link-container">
          <Label
            @tap="$navigateTo(forgotPassword)"
            class="h3 links"
            width="50%"
            text="Forgot Password"
            textAlignment="left"
          />
          <Label
            @tap="$navigateTo(register)"
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
import { mapGetters } from "vuex";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import RegisterScreen from "./RegisterScreen";
import MainScreen from "./MainScreen";

export default {
  data() {
    return {
      emailAddress: null,
      password: null,
      forgotPassword: ForgotPasswordScreen,
      register: RegisterScreen
    };
  },
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader",
      loggedIn: "getLoggedIn",
      error: "getError"
    })
  },
  watch: {
    loggedIn(val) {
      if (val) {        
        this.$navigateTo(MainScreen, { clearHistory: true });
      }
    },
    error(val) {      
      if(val) {
        alert(val);
        this.$store.commit("setError", null);
      }
    }
  },
  methods: {
    login() {
      if (this.emailAddress && this.password) {
        this.$store.dispatch("login", {
          emailAddress: this.emailAddress,
          password: this.password
        });
      } else {
        alert("Please provide a valid email address and password");
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
