<template>
  <div class="edit">
    <div class="edit-tel-top">
      <m-header :title="title" :is_goBack="is_goBack"></m-header>
    </div>
    <div class="edit-tel-center">
      <!-- <div class="center-img">修改手机号</div> -->
      <!-- <div class="edit-input">
        <input type="text" v-model="tel" :placeholder="placeholder_tel" />
      </div>-->
      <div class="edit-input">
        <input type="text" v-model="newtel" :placeholder="placeholder_newtel" />
      </div>
      <div class="edit-input">
        <input type="password" v-model="pwd" :placeholder="placeholder_pwd" />
      </div>
      <div class="edit-input">
        <input type="text" v-model="img" :placeholder="placeholder_img" />
        <img :src="yzsrc" class="yz" @click="obtainImg" />
      </div>
      <div class="edit-input">
        <input type="text" v-model="short" :placeholder="placeholder_short" />
        <button @click="obtainShortMsg" class="msgyz">获取验证码</button>
      </div>
    </div>
    <div class="edit-tel-bottom">
      <button @click="doEdit">修改提交</button>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import mHeader from "../../components/header";
import api from "../../api";
import { Toast } from "vant";
export default {
  data() {
    return {
      //   tel: "",
      newtel: "",
      yzsrc: "",
      tpkey: "",
      short: "",
      img: "",
      pwd: "",
      title: "修改手机号",
      is_goBack: true,
      placeholder_newtel: "请输入新手机号",
      placeholder_pwd: "请输入密码",
      placeholder_img: "请输入图片验证码",
      placeholder_short: "请输入短信验证码"
    };
  },
  methods: {
    obtainImg() {
      // 获取图片验证码
      this.axios.get(api.GetImg).then(response => {
        // console.log(response);
        if (response.data.code == -1) {
          this.placeholder_newtel = response.data.data;
        } else {
          // console.log(response.data);
          this.yzsrc = response.data.data.url;
          this.tpkey = response.data.data.key;
        }

        // console.log(this.yzsrc);
      });
    },
    obtainShortMsg() {
      // console.log(this.axios.defaults);
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      let data = {
        mobile: this.newtel,
        captcha_code: this.img,
        captcha_key: this.tpkey
      };
      //获取短信验证码
      this.axios
        .post(api.Verify, qs.stringify(data))
        .then(response => {
          console.log(response);
          if (response.data.status) {
            Toast.clear();
            if (response.data.data == "INVALID_CAPTCHA") {
              Toast("请查看验证码是否正确");
            } else {
              Toast(response.data.data);
            }
          } else {
            Toast(response.data.data);
            this.obtainImg();
          }

          //   console.log(this.short);
        })
        .catch(error => {
          console.log(error);
        });
    },
    doEdit() {
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      let data = {
        password: this.pwd,
        mobile: this.newtel,
        verify: this.short
      };
      //修改手机号
      this.axios
        .post(
          api.UpdateMobile + localStorage.getItem("token"),
          qs.stringify(data)
        )
        .then(response => {
          // console.log(response);
          if (response.data.status) {
            Toast.clear();
            localStorage.clear();
            Toast("修改成功，请重新登录");
            this.$router.push("login");
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
  components: {
    mHeader,
    [Toast.name]: Toast
  },
  created() {
    this.obtainImg();
  }
};
</script>
<style scoped lang="less">
.edit {
  position: absolute;
  min-height: 100%;
  width: 100%;
  background-color: #fff;
  z-index: 500;
  box-sizing: border-box;
  background-color: #eee;
  background-size: cover;
  .edit-tel-top {
    position: fixed;
    width: 100%;
    background-color: #78d666;
  }
  .edit-tel-center {
    padding-top: 55px;
  }
  .edit-input {
    position: relative;
    width: 100%;
    font-size: 20px;
    background-color: #fff;
  }
  input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: #555;
    /* placeholder字体大小  */
    font-size: 14px;
  }
  input {
    box-sizing: border-box;
    padding: 5px 20px;
    width: 100%;
    height: 55px;
    outline: none;
    /* background-color: rgba(0, 0, 0, 0.3); */
    color: #333;
    font-size: 16px;
    border: none;
    border-bottom: 1px solid #eee;
  }
  .edit-tel-bottom {
    width: 100%;
    height: 50px;
    padding: 15px;
    box-sizing: border-box;
    button {
      margin: 20px auto;
      border: none;
      outline: none;
      width: 100%;
      height: 50px;
      font-size: 25px;
      background-color: #78d666;
      color: #ffe;
    }
  }
  .yz {
    position: absolute;
    right: 20px;
    top: 10px;
    width: 80px;
    height: 35px;
  }
  .msgyz {
    position: absolute;
    right: 20px;
    top: 10px;
    background-color: #78d666;
    color: #fff;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    padding: 5px;
  }
}
</style>
