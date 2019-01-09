<template>
  <Page class="page">
    <ActionBar title="Register" android:flat="true">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="$navigateTo(login)"/>
    </ActionBar>
    <ScrollView>
      <FlexboxLayout
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        flexDirection="column"
      >
        <!-- <Image src="res://logo" stretch="aspectFill" height="50%" width="50%"/>  -->
        <ActivityIndicator :busy="showLoader"/>
        <FlexboxLayout width="80%" flexDirection="column">
          <TextField keyboardType="email" v-model="emailAddress" :text="emailAddress" hint="Email Address"/>
          <TextField v-model="password" :text="password" secure="true" hint="Password"/>
          <TextField
            v-model="confirmPassword"
            :text="confirmPassword"
            secure="true"
            hint="Confirm Password"
          />
          <Button @tap="register()" class="login-btn" text="Register"/>
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
      password: null,
      confirmPassword: null,
      login: LoginScreen
    };
  },
  computed: {
    ...mapGetters({
      showLoader: "getShowLoader",
      userRegistered: "getUserRegistered"
    })
  },
  watch: {
    userRegistered(val) {
      if (val) {
        this.$store.commit("setUserRegistered", false);
        alert(
          "Registered successfully, please check your email to activate you account."
        ).then(() => {
          this.$navigateTo(this.login);
        });
      }
    }

  },
  methods: {
    register() {
      if (
        this.emailAddress &&
        this.password &&
        this.confirmPassword &&
        this.password === this.confirmPassword
      ) {
        this.$store.dispatch("register", {
          emailAddress: this.emailAddress,
          password: this.password
        });
      } else {
        alert(
          "Please provide a valid email address and password and ensure that the passwords match"
        );
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
