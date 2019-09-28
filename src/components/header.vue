<template>
  <header>
    <m-topbar>
      <m-topbar-item v-if="!is_goBack" class="left-list">
        <!-- <img slot="icon-normal" src="../assets/images/ic_seti_arrow_right_white.png" alt /> -->
        <span></span>
      </m-topbar-item>
      <m-topbar-item v-if="is_goBack">
        <div class="goBack iconfont" @click="goBack">&#xe641;</div>
      </m-topbar-item>
      <m-topbar-item v-if="hidden">{{title}}</m-topbar-item>
      <m-topbar-item class="right-float" v-if="is_select">筛选</m-topbar-item>
      <m-topbar-item class="right-float" v-if="!is_select">
        <span></span>
      </m-topbar-item>
    </m-topbar>
  </header>
</template>

<script>
import mTopbar from "../components/topbar";
import mTopbarItem from "../components/topbar-item";

export default {
  data() {
    return {
      hidden: true
    };
  },
  methods: {
    goBack() {
      if (!this.path) {
        this.$router.go(-1);
      } else {
        this.$router.go(this.path);
        this.path = "";
      }
    }
  },
  props: {
    title: "",
    is_goBack: "",
    is_select: "",
    path: ""
  },
  components: {
    mTopbar,
    mTopbarItem
  }
};
</script>

<style scoped lang='less'>
.left-list span {
  font-size: 16px;
}
.goBack {
  font-size: 20px;
}

</style>
