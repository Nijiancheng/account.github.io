<template>
  <div class="feedback">
    <div class="feedback-top">
      <m-header :title="title" :is_goBack="is_goBcak"></m-header>
    </div>
    <div class="feedback-center">
      <div class="feedback-center-title">问题和建议</div>
      <div class="feedback-center-info">
        <textarea
          name
          id
          cols="30"
          rows="6"
          placeholder="请简要描述您的问题和意见
                "
          v-model="content"
        ></textarea>
      </div>
      <div class="feedback-center-title">联系电话或邮箱</div>
      <div class="feedback-center-info">
        <input type="text" placeholder="选填，便于我们与你联系" v-model="contact" />
      </div>
    </div>
    <div class="feedback-bottom">
      <button class="btn" @click="feed">提交意见</button>
    </div>
  </div>
</template>

<script>
import mHeader from "../../components/header";
import qs from "qs";
import api from "../../api";
import { Toast } from "vant";
export default {
  data() {
    return {
      is_goBcak: true,
      title: "意见反馈",
      content: "",
      contact: ""
    };
  },
  methods: {
    feed() {
      let data = {
        content: this.content,
        contact: this.contact
      };
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      // 意见反馈
      this.axios
        .post(api.Feed + localStorage.getItem("token"), qs.stringify(data))
        .then(response => {
          // console.log(response);
          if (response.data.status) {
            Toast("提交成功");
            this.$router.push("me");
          } else {
            Toast(response.data.data);
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
  }
};
</script>

<style scoped lang="less">
.feedback {
  position: absolute;
  width: 100%;
  min-height: 100%;
  background-color: #f5f5f5;
  z-index: 500;
  .goBack {
    font-size: 25px;
  }
  .feedback-top {
    background-color: #78d666;
    position: fixed;
    width: 100%;
  }
  .feedback-center {
    padding-top: 55px;
    color: #333;
  }
  .feedback-center-title {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 5px 15px;
    color: 878787;
    box-sizing: border-box;
  }
  .feedback-center-info {
    border-left: none;
    border-right: none;
    textarea {
      width: 100%;
      outline: none;
      border: none;
      padding: 10px 15px;
      font-size: 18px;
      color: #333;
      box-sizing: border-box;
      background-color: #fff;
    }
  }
  input {
    width: 100%;
    outline: none;
    border: none;
    padding: 10px 15px;
    font-size: 18px;
    color: #333;
    box-sizing: border-box;
    background-color: #fff;
  }
  .feedback-bottom {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    button {
      width: 100%;
      border: none;
      outline: none;
      background-color: #78d666;
      height: 50px;
      color: #fff;
      font-weight: 600;
      border-radius: 3px;
    }
  }
}
</style>
