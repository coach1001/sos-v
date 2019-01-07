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
    };
  }
};
</script>

<style scoped>
</style>
