<template>
  <div class="edit">
    <div class="edit-pwd-top">
      <m-header :title="title" :is_goBack="is_goBack"></m-header>
    </div>
    <div class="edit-pwd-center">
      <!-- <div class="center-img">修改密码</div> -->
      <div class="edit-input">
        <input type="text" v-model="pwd" :placeholder="placeholder_pwd" />
      </div>
      <div class="edit-input">
        <input type="text" v-model="newpwd" :placeholder="placeholder_newpwd" />
      </div>
    </div>
    <div class="edit-pwd-bottom">
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
      pwd: "",
      newpwd: "",
      title: "修改密码",
      is_goBack: true,
      placeholder_pwd: "旧密码",
      placeholder_newpwd: "新密码"
    };
  },
  methods: {
    doEdit() {
      if (this.pwd == "") {
        Toast("密码未填写");
        return;
      } else if (this.newpwd == "") {
        Toast("新密码未填写");
        return;
      } else {
        let data = {
          password: this.pwd,
          new_password: this.newpwd
        };
        Toast.loading({
          mask: true,
          message: "加载中..."
        });
        Toast();
        this.axios
          // 修改密码
          .post(
            api.UpdatePass + localStorage.getItem("token"),
            qs.stringify(data)
          )
          .then(response => {
            // console.log(response);
            if (response.data.status) {
              localStorage.clear();
              Toast("修改成功");
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
  },
  components: {
    mHeader,
    [Toast.name]: Toast
  }
};
</script>
<style scoped lang='less'>
.edit {
  position: absolute;
  min-height: 100%;
  width: 100%;
  /* background-color: #fff; */
  z-index: 500;
  box-sizing: border-box;
  /* background-image: url("../../assets/images/background4.jpeg"); */
  background-size: cover;
  background-color: #eee;
  .edit-pwd-top {
    background-color: #78d666;
    color: #fff;
    position: fixed;
    width: 100%;
  }
  .edit-pwd-center {
    padding-top: 55px;
  }
  .edit-input {
    width: 100%;
    font-size: 20px;
    background-color: #fff;
    position: relative;
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
  }
  input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: #555;
    /* placeholder字体大小  */
    font-size: 14px;
    background-color: #fff;
  }

  .edit-pwd-bottom {
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
}
</style>
