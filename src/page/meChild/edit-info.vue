<template>
  <div class="edit-info">
    <div class="edit-info-top">
      <m-header :title="title" :is_goBack="is_goBack"></m-header>
    </div>
    <div class="edit-info-center">
      <!-- <div class="center-img">修改个人信息</div> -->
      <div class="edit-input">
        <!-- <button class="input-button" @click="input_photo">上传图片</button> -->
        <span>头像</span>
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="1"
          :after-read="afterRead"
          :before-delete="beforeDelete"
          :style="{backgroundImage:'url('+photoImg+')',backgroundSize:'cover'}"
        >
          <!-- <img :src="photoImg" alt=""> -->
        </van-uploader>
      </div>
      <div class="edit-input">
        <span>昵称</span>
        <input type="text" v-model="nickname" :placeholder="placeholder_nickname" />
      </div>
      <div class="edit-input">
        <span>电话号</span>
        <span @click="goToRouter" class="edit_tel">{{tel}}</span>
      </div>
    </div>
    <div class="edit-info-bottom">
      <button @click="doEdit">修改提交</button>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import mHeader from "../../components/header";
import { Uploader, Toast } from "vant";
import api from "../../api";
export default {
  data() {
    return {
      nickname: "",
      photoImg: "",
      title: "修改个人信息",
      is_goBack: true,
      placeholder_nickname: "请输入昵称",
      image_keys: "",
      fileList: [],
      token: "",
      tel: ""
    };
  },
  methods: {
    constructor() {
      this.token = localStorage.getItem("token");
      this.tel = localStorage.getItem("tel");
    },
    getUserInfo() {
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      this.axios
        .get(api.User + localStorage.getItem("token"))
        .then(response => {
          // console.log(response.data.status);
          if (response.data.status) {
            this.photoImg = response.data.data.avatar_url;
            this.nickname = response.data.data.nickname;
            localStorage.setItem("nickname", response.data.data.nickname);
            localStorage.setItem("tel", response.data.data.mobile);
            Toast.clear();
          } else {
            localStorage.clear();
            this.$router.push("login");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file);
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      let formData = new FormData();
      formData.append("file", file.file);
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      }; //添加请求头
      // 上传图片
      this.axios
        .post(api.UploadImg + this.token, formData, config)
        .then(res => {
          // console.log(res);
          if (res.data.data.status) {
            this.image_keys = res.data.data.file.fileKey;
            // console.log(res.data.data.file.fileKey);
            // console.log(this.image_keys);
            Toast("头像已选择");
          } else {
            Toast(res.data.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    beforeDelete() {
      this.image_keys = "";
      this.fileList = [];
      Toast("头像已移除,可以重新选取");
      return true;
    },
    doEdit() {
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      let data = {
        nickname: this.nickname,
        avatar: this.image_keys
      };
      this.axios
        .post(api.UserInfoEdit + this.token, qs.stringify(data))
        .then(response => {
          console.log(response);
          if (response.data.status) {
            Toast(response.data.data);
            this.$router.push("me");
          } else {
            Toast(response.data.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goToRouter(item) {
      this.$router.push("/edit-tel");
    }
  },
  components: {
    mHeader,
    [Uploader.name]: Uploader,
    [Toast.name]: Toast
  },
  created() {
    this.constructor();
    this.getUserInfo();
  }
};
</script>
<style scoped lang="less">
.edit-info {
  position: absolute;
  min-height: 100%;
  width: 100%;
  background-color: #fff;
  z-index: 500;
  box-sizing: border-box;
  background-size: cover;
  background-color: #eee;
  .edit-info-top {
    position: fixed;
    width: 100%;
    background-color: #78d666;
  }
  .edit-info-center {
    padding-top: 55px;
  }

  input::-webkit-input-placeholder {
    color: #555;
    font-size: 14px;
  }
  .edit-input {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    position: relative;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    overflow: hidden;
    align-items: center;
    padding: 5px 10px;
    box-sizing: border-box;
    color: #555;
  }
  input,
  .edit_tel {
    box-sizing: border-box;
    padding: 5px 5px;
    width: 80%;
    height: 55px;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
    color: #333;
    font-size: 16px;
    border: none;
    text-align: right;
  }
  .edit_tel {
    display: block;
    line-height: 50px;
  }
  .edit-info-bottom {
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
  }
  .input-button {
    position: absolute;
    right: 20px;
    top: 10px;
  }
}
</style>
<style lang='less' >
.edit-info {
  .van-uploader {
    // border-radius: 50%;
    overflow: hidden;
  }
  // .van-uploader__preview {
  // }
  .van-uploader__upload-icon {
    display: none;
  }
  .van-uploader__upload {
    opacity: 0;
  }
  
  .van-uploader__upload,
.van-uploader__preview {
  margin: 0px;
  border:none;
}
}

</style>
