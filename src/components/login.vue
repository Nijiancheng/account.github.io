<template>
  <div class="login-box">
    <div class="login-box-title">
      <span>手机号登录</span>
    </div>
    <div class="login-input" :class="{'currents':currents==1?true:false}">
      <span>手机号</span>
      <input type="text" v-model="tel" @focus="current(1)" placeholder="输入手机号" />
    </div>
    <div class="login-input" :class="{'currents':currents==2?true:false}">
      <span>密码</span>
      <input type="password" v-model="pwd" @focus="current(2)" placeholder="输入密码" />
    </div>
    <div class="login-input" v-if="num>5" :class="{'currents':currents==3?true:false}">
      <span>图片验证</span>
      <input type="text" v-model="yz" @focus="current(3)" placeholder="图片验证码" />
      <img :src="yzsrc" class="yz" @click='obtainImg'/>
    </div>
    <div class="login-input Btn">
      <button @click="login">登录</button>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import { Toast } from "vant";
import api from "../api";
export default {
  components: {
    [Toast.name]: Toast
  },
  data() {
    return {
      tel: "",
      pwd: "",
      yzsrc: "",
      tpkey: "",
      yz: "",
      num: 0,
      currents: ""
    };
  },
  methods: {
    obtainImg() {
      this.axios.get(api.GetImg).then(response => {
        // console.log(response);
        this.yzsrc = response.data.data.url;
        this.tpkey = response.data.data.key;
        // console.log(this.yzsrc);
      });
    },
    login() {
      if (this.tel == "") {
        Toast("手机号不能为空");
        return;
      } else if (this.pwd == "") {
        Toast("密码未填写");
        return;
      } else {
        let data = {
          mobile: this.tel,
          password: this.pwd,
          captcha_code: this.yz,
          captcha_key: this.tpkey
        };
        // 登录
        this.axios
          .post(api.Login, qs.stringify(data))
          .then(response => {
            // console.log(response);
            if (response.data.status) {
              let token = response.data.data.token;
              let id = response.data.data.id;
              localStorage.setItem("token", token);
              localStorage.setItem("id", id);
              Toast("登录成功");
              this.$router.push("menu");
              this.num = 0;
            } else {
              Toast(response.data.data);
              this.num += 1;
              if (this.num > 5) {
                this.obtainImg();
              }
              // console.log(this.num);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    current(num) {
      this.currents = num;
      // console.log(this.currents,num);
    }
  },
  created() {}
};
</script>
<style scoped lang="less">
.login-box {
  .login-box-title {
    font-size: 28px;
    font-weight: 500;
    padding: 15px;
  }
  .login-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 100%;
    font-size: 17px;
    font-weight: 500;
    padding: 15px;
    box-sizing: border-box;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
    input {
      box-sizing: border-box;
      padding: 5px 20px;
      width: 70%;
      outline: none;
      color: #555;
      font-size: 18px;
      border: none;
      caret-color: #2ecc71;
    }
    .yz {
      position: absolute;
      right: 2px;
      top: 10px;
      width: 80px;
      height: 35px;
    }
  }
  .currents {
    border-bottom-color: #2ecc71 !important;
  }
  .Btn {
    margin-top: 20px;
    width: 100%;
    border: none;
    button {
      width: 100%;
      height: 50px;
      font-size: 18px;
      margin: 0 auto;
    }
    .router-link-active {
      color: #78d666 !important;
    }
  }

  button {
    width: 80px;
    height: 35px;
    background-color: #2ecc71;
    border-radius: 5px;
    outline: none;
    border: none;
    color: #fff;
    font-size: 14px;
  }
  input::-webkit-input-placeholder {
    color: #999;
    font-size: 14px;
  }
}
</style>
