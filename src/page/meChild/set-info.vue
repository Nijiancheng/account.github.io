<template>
  <div class="setInfo">
    <!-- <div class="set-info-top">
      <div class="goBack iconfont" @click="goBack">&#xe641;</div>设置
    </div>-->
    <m-header :title="title" :is_goBack="is_goBack"></m-header>
    <div class="set-info-center">
      <!-- <div class="center-img">我的记账</div> -->
      <div class="center-list"  @click="goToRouter('edit-pwd')">
        <span class="iconfont"></span>
        {{edit_pwd}}
        <span class="center-bottom-right-icon iconfont">&#xe8f2;</span>
      </div>
      <div class="center-list" @click="goToRouter('edit-tel')">
        修改手机号
        <span class="center-bottom-right-icon iconfont">&#xe8f2;</span>
      </div>
      <div class="center-list"  @click="goToRouter('edit-info')">
        修改个人信息
        <span class="center-bottom-right-icon iconfont">&#xe8f2;</span>
      </div>

    </div>
    <div class="set-info-bottom">
      <button @click="logout">退出登录</button>
    </div>
    <transition name="right">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import mHeader from "../../components/header";
import api from "../../api";
import { Toast } from "vant";
export default {
  data() {
    return {
      title: "设置",
      is_goBack: true,
      id: "",
      edit_pwd: "修改密码",
      edit_tel: "修改手机号",
      edit_account: "修改账户"
    };
  },
  components: {
    mHeader,
    [Toast.name]: Toast
  },
  methods: {
    goToRouter(path) {
      this.$router.push("/" + path);
    },
    logout() {
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      this.axios
        .get(api.UserOut + localStorage.getItem("token"))
        .then(response => {
          // console.log(response);
          if (response.data.status) {
            Toast.clear();
            localStorage.clear();
            Toast("退出成功");
            this.$router.push("login");
          } else {
            Toast(response.data.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped lang="less">
.goBack {
  font-size: 30px;
}
.setInfo {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: #fff;
  z-index: 500;
  box-sizing: border-box;
  background-color: #eee;
}
header {
  position: fixed;
  width: 100%;
  background-color: #78d666;
}
.set-info-center {
  padding-top: 55px;
  div {
    background-color: #fff;
    margin-top: 2px;
    color: #555;
  }
}
.center-img {
  background-color: #78d666;
  /* background-image: url("../../assets/images/background2.jpg"); */
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
  /* color: #ffe; */
  padding: 0 20px;
  line-height: 50px;
  box-sizing: border-box;
  border-bottom: 2px solid rgba(255, 255, 255, 0.9);
}
.center-bottom-right-icon {
  float: right;
}
.set-info-bottom {
  width: 100%;
  height: 50px;
  padding: 15px;
  box-sizing: border-box;
  button {
    margin-top: 20px;
    border: none;
    outline: none;
    width: 100%;
    height: 50px;
    font-size: 25px;
    background-color: #78d666;
    color: #ffe;
  }
}
</style>
