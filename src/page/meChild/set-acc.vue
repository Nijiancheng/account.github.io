<template>
  <div class="set-acc">
    <m-header :title="title" :is_goBack="is_goBack"></m-header>
    <div class="set-acc-center">
      <div class="center-list" @click="goToRouter('account-mgt')">
        <span class="iconfont"></span>
        账簿管理
        <span class="center-bottom-right-icon iconfont">&#xe8f2;</span>
      </div>
      <div class="center-list" @click="goToRouter('assets')">
        账户管理
        <span class="center-bottom-right-icon iconfont">&#xe8f2;</span>
      </div>
    </div>
  </div>
</template>

<script>
import mHeader from "../../components/header";
import api from "../../api";
import { Toast } from "vant";
export default {
  data() {
    return {
      title: "账簿账户管理",
      is_goBack: true,
      id: ""
    };
  },
  components: {
    mHeader,
    [Toast.name]: Toast
  },
  methods: {
    goToRouter(path) {
      this.$router.push("/" + path);
      //   Toast.loading({
      //     mask: true,
      //     message: "加载中..."
      //   });
    }
  }
};
</script>
<style scoped lang="less">
.goBack {
  font-size: 30px;
}
.set-acc {
  position: absolute;
  min-height: 100%;
  width: 100%;
  z-index: 500;
  box-sizing: border-box;
  background-color: #eee;
}
header {
  position: fixed;
  width: 100%;
  background-color: #78d666;
}
.set-acc-center {
  padding-top: 55px;
  div {
    background-color: #fff;
    margin-top: 2px;
    color: #555;
  }
}
.center-img {
  background-color: #78d666;
  width: 100%;
  height: 100px;
  font-size: 35px;
  text-align: center;
  color: #fff;
  line-height: 100px;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.9);
}
.center-list {
  width: 100%;
  height: 50px;
  background-color: rgba(40, 41, 40, 0.5);
  font-size: 20px;
  padding: 0 20px;
  line-height: 50px;
  box-sizing: border-box;
  border-bottom: 2px solid rgba(255, 255, 255, 0.9);
}
.center-bottom-right-icon {
  float: right;
}
</style>
