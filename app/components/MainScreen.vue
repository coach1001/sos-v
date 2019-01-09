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

		<GridLayout rows="auto, *">
			<!-- <ListView row="1" items="{{ users }}">
				<ListView.itemTemplate>
					<Label text="{{ name }}" textWrap="true" />
				</ListView.itemTemplate>
			</ListView> -->
			<Fab
				@tap="addSlip()"
				row="1"
				icon="res://baseline_add_white_36"
				rippleColor="#f1f1f1"
				class="fab-button"
			></Fab>
		</GridLayout>
  </Page>
</template>

<script>
import to from "await-to-js";
import { mapGetters } from "vuex";
import LoginScreen from "./LoginScreen";
import UploadSlipScreen from "./UploadSlipScreen";

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
      this.$navigateTo(LoginScreen, { clearHistory: true });
    },
    addSlip() {
      this.$navigateTo(UploadSlipScreen);
    }
  }
};
</script>

<style scoped>
.fab-button {
	height: 70;
	width: 70; 
	margin: 15;
	background-color: #ff4081;
	horizontal-align: right;
	vertical-align: bottom;
}
</style>
