<template>
  <Page class="page">
    <ActionBar
      title="Login"
      android:flat="true"
    />
    <ScrollView>
      <FlexboxLayout
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        flexDirection="column"
      >
        <ActivityIndicator :busy="showLoader" />
        <FlexboxLayout
          width="70%"
          flexDirection="column"
        >
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
          <Button
            @tap="login()"
            class="login-btn"
            text="Login"
          />
        </FlexboxLayout>
        <FlexboxLayout
          width="70%"
          class="link-container"
        >
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
      register: RegisterScreen,
    };
  },
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader",
      loggedIn: "getLoggedIn"
    })
  },
  watch: {
    loggedIn(val) {
      if (val) {
        this.$navigateTo(MainScreen);
      }
    }
  },
  methods: {
    register() {},
    login() {
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
