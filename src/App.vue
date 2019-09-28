<template>
  <div id="app">
    <router-view></router-view>
    <m-Tabbar>
      <m-Tabbar-Item id="statistics">
        <span slot="icon-normal" class="iconfont">&#xe65f;</span>
        <div>统计</div>
      </m-Tabbar-Item>
      <m-Tabbar-Item id="account">
        <!-- <span slot="icon-normal" class="iconfont"></span> -->
        <div slot="normal" class="normal"></div>
      </m-Tabbar-Item>
      <m-Tabbar-Item id="me">
        <span slot="icon-normal" class="iconfont">&#xe643;</span>
        <div>我的</div>
      </m-Tabbar-Item>
    </m-Tabbar>
  </div>
</template>

<script>
import mTabbar from "./components/tabbar";
import mTabbarItem from "./components/tabbar-item";
import api from "./api";
export default {
  name: "Index",
  components: {
    mTabbar,
    mTabbarItem
  },
  methods: {
    constructor() {
      this.axios.get(api.User + localStorage.getItem("token")).then(res => {
        if (!res.data.status) {
          localStorage.clear();
          this.$router.push("login");
        }
      });
    }
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
body {
  background-color: #eee;
  min-height: 100%;
  width: 100%;
}
</style>
