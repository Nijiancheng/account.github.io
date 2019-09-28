<template>
  <div class="index">
    <div class="reg">
      <div class="reg-header">
        <!-- <router-link to="login">登录</router-link> -->
        
        <router-link
          :to="login"
          @click.native="change()"
          class="iconfont"
        >{{login=='reg'?'注册':'登录'}}</router-link>
      </div>
      <div class="reg-bgi">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import mHeader from "../components/header";
import qs from "qs";
export default {
  data() {
    return {
      login: "reg"
    };
  },
  components: {
    mHeader
  },
  methods: {
    constructor() {
      if (localStorage.getItem("token")) {
        this.$router.push("me");
      } else {
        this.$router.push("login");
      }
    },
    change() {
      this.login = this.login == "login" ? "reg" : "login";
    }
  },
  created() {
    this.constructor();
  }
};
</script>

<style scoped>
.reg {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 100;
  align-items: center;
  background-color: #fff;
}
.reg-header {
  display: flex;
  position: fixed;
  top: px;
  width: 100%;
  justify-content: flex-end;
  align-items:center;
  padding:5px 15px;
  box-sizing: border-box;
  background-color: #2ecc71;
}
.reg-bgi {
  /* padding:150px 45px; */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.reg-header a {
  display:flex;
  align-items:center;
  padding:5px;
  font-size: 20px;
  color:#ffe;
  height: 40px;
  /* color: #555; */

  text-align: right;
  /* border-radius: 5px; */
}
.reg-box {
  border-radius: 5px;
  overflow: hidden;
}

input::-webkit-input-placeholder {
  color: #fff;
  font-size: 14px;
}
.Btn {
  margin-top: 20px;
  width: 100%;
}
.Btn button {
  width: 100%;
  height: 50px;
  font-size: 18px;
  margin: 0 auto;
}
.router-link-active {
  color: #78d666 !important;
}
</style>
