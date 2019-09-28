<template>
  <div class="reg-box">
    <div class="reg-box-title">
      <span>手机号注册</span>
    </div>
    <div class="reg-input" :class="{'currents':currents==1?true:false}">
      <span>手机号</span>
      <input type="text" v-model="tel" @focus="current(1)" placeholder="请填写手机号" />
    </div>
    <div class="reg-input" v-if="is_img" :class="{'currents':currents==2?true:false}">
      <span>图片验证</span>
      <input type="text" v-model="yz" @focus="current(2)" placeholder="图片验证码" />
      <img :src="yzsrc" class="yz" @click="obtainImg" />
    </div>
    <div class="reg-input" :class="{'currents':currents==3?true:false}">
      <span>短信验证</span>
      <input type="text" v-model="verify" @focus="current(3)" placeholder="短信验证码" />
      <button @click="obtainShortMsg" class="msgyz">获取验证码</button>
    </div>
    <div class="reg-input" :class="{'currents':currents==4?true:false}">
      <span>昵称</span>
      <input type="text" v-model="nickname" @focus="current(4)" placeholder="例如：程程" />
    </div>
    <div class="reg-input" :class="{'currents':currents==5?true:false}">
      <span>密码</span>
      <input type="password" v-model="pwd" @focus="current(5)" placeholder="填写密码" />
    </div>
    <div class="reg-input Btn">
      <button @click="doReg">注册</button>
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
      yz: "",
      yzsrc: "",
      tpkey: "",
      verify: "",
      nickname: "",
      is_img: false,
      currents: ""
    };
  },

  methods: {
    obtainImg() {
      this.axios.get(api.GetImg).then(response => {
        // console.log(response);
        this.yzsrc = response.data.data.url;
        this.tpkey = response.data.data.key;
      });
    },
    obtainShortMsg() {
      // console.log(this.axios.defaults);
      if (this.tel == "") {
        Toast("手机号不能为空");
        return;
      } else if (this.is_img == true && this.yz == "") {
        Toast("验证码不能为空");
        return;
      } else {
        let data = {
          mobile: this.tel,
          captcha_code: this.yz,
          captcha_key: this.tpkey
        };
        // 获取短信验证码
        this.axios
          .post(api.Verify, qs.stringify(data))
          .then(response => {
            // console.log(response);
            // console.log(response.data);
            if (response.data.status) {
              // this.verify = response.data.data.match(/\d{4}/)[0];
              Toast(response.data.data);
            } else {
              if (response.data.data == "INVALID_CAPTCHA") {
                // Toast("发送短信次数过多");
                this.obtainImg();
                this.is_img = true;
              } else {
                Toast(response.data.data);
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    doReg() {
      if (this.tel == "") {
        Toast("手机号不能为空");
        return;
      } else if (this.password == "") {
        Toast("密码未填写");
        return;
      } else if (this.verify == "") {
        Toast("手机验证码未填写");
        return;
      } else {
        let data = {
          mobile: this.tel,
          verify: this.verify,
          password: this.pwd,
          nickname: this.nickname
        };
        // 注册
        this.axios
          .post(api.Reg, qs.stringify(data))
          .then(response => {
            // console.log(response);
            if (response.data.status) {
              let token = response.data.data.token;
              let id = response.data.data.id;
              // const info ={token:token,id:id}
              localStorage.setItem("token", token);
              localStorage.setItem("id", id);
              Toast("注册成功");
              this.$router.push("me");
            } else {
              Toast(response.data.data);
              this.obtainImg();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    current(num) {
      this.currents = num;
    }
  },
  created() {}
};
</script>
<style scoped lang='less'>
.reg-box {
  .reg-box-title {
    font-size: 28px;
    font-weight: 500;
    padding: 15px;
  }
  .currents {
    border-bottom-color: #2ecc71 !important;
  }
  .reg-input {
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
    .yz {
      position: absolute;
      right: 2px;
      top: 13px;
      width: 80px;
      height: 35px;
    }

    .msgyz {
      position: absolute;
      right: 2px;
      top: 13px;
    }

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
    input::-webkit-input-placeholder {
      color: #999;
      font-size: 14px;
    }
  }
  .Btn {
    border: none;
    button {
      width: 100%;
      height: 50px;
      font-size: 18px;
      margin: 0 auto;
    }
  }
  .router-link-active {
    color: #78d666 !important;
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
}
</style>
