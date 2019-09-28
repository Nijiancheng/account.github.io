<template>
  <div class="me">
    <div class="top">
      <m-header :title="title"></m-header>
      <div class="me-head">
        <span class="photo" @click="goToRouter('edit-info')">
          <img :src="photoImg" alt />
        </span>
        <p class="nickname">{{nickname}}</p>
      </div>
    </div>
    <div class="me-center">
      <div class="me-center-list me-center-left">
        <span class="me-center-left-num">{{friends}}</span>
        <div class="me-center-list-title">
          <span class="me-center-list-logo iconfont">&#xe84e;</span>
          已邀请
        </div>
      </div>
      <div class="me-center-list me-center-center">
        <span class="me-center-center-num">{{BookList.length?BookList.length:0}}</span>
        <div class="me-center-list-title">
          <span class="me-center-list-logo iconfont">&#xe645;</span>
          总账本
        </div>
      </div>
      <div class="me-center-list me-center-right">
        <span class="me-center-right-num">{{recordNum}}</span>
        <div class="me-center-list-title">
          <span class="me-center-list-logo iconfont">&#xe60f;</span>
          总明细
        </div>
      </div>
    </div>
    <div class="me-bottom">
      <div class="me-bottom-list" @click="goToRouter('Invite')">
        <div class="me-bottom-list-left">
          <span class="me-bottom-left-icon iconfont">&#xe61a;</span>
          <span class="me-bottom-left-title">邀请好友</span>
        </div>
        <div class="me-bottom-list-right">
          <span class="me-bottom-right-icon iconfont">&#xe8f2;</span>
        </div>
      </div>
      <div class="me-bottom-list" @click="goToRouter('set-info')">
        <div class="me-bottom-list-left">
          <span class="me-bottom-left-icon iconfont">&#xe726;</span>
          <span class="me-bottom-left-title">设置</span>
        </div>
        <div class="me-bottom-list-right">
          <span class="me-bottom-right-icon iconfont">&#xe8f2;</span>
        </div>
      </div>
    </div>
    <div class="me-bottom me-bottom-last">
      <div class="me-bottom-list" @click="goToRouter('setAcc')">
        <div class="me-bottom-list-left">
          <span class="me-bottom-left-icon iconfont">&#xe62e;</span>
          <span class="me-bottom-left-title">账簿账户管理</span>
        </div>
        <div class="me-bottom-list-right">
          <span class="me-bottom-right-icon iconfont">&#xe8f2;</span>
        </div>
      </div>
      <div class="me-bottom-list" @click="goToRouter('feedback')">
        <div class="me-bottom-list-left">
          <span class="me-bottom-left-icon iconfont">&#xe695;</span>
          <span class="me-bottom-left-title">意见反馈</span>
        </div>
        <div class="me-bottom-list-right">
          <span class="me-bottom-right-icon iconfont">&#xe8f2;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mHeader from "../components/header";
import api from "../api";
import { Toast } from "vant";
export default {
  data() {
    return {
      hidden: false,
      nickname: "未命名",
      photoImg: "",
      name: "",
      id: "",
      title: "我的",
      BookList: {},
      bookId: "",
      friends: 0,
      token: "",
      recordNum: 0,
      page: 1
    };
  },
  methods: {
    constructor() {
      if (localStorage.getItem("token")) {
        this.token = localStorage.getItem("token");
        this.axios
          .get(api.User + localStorage.getItem("token"))
          .then(response => {
            // console.log(response.data.status);
            if (response.data.status) {
              this.photoImg = response.data.data.avatar_url;
              this.nickname = response.data.data.nickname;
              localStorage.setItem("nickname", response.data.data.nickname);
              localStorage.setItem("tel", response.data.data.mobile);
            } else {
              localStorage.clear();
              this.$router.push("login");
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.$router.push("login");
      }
    },
    getBook() {
      this.axios.get(api.Book + this.token).then(res => {
        if (res.data.status) {
          this.BookList = res.data.data;
        }
      });
    },
    getBookNow() {
      this.axios.get(api.BookGet + this.token).then(res => {
        // console.log(res, "当前账簿");
        this.bookId = res.data.data.id;
        this.getMember(this.bookId);
        // console.log(this.bookId);
      });
    },
    getMember(id) {
      // console.log(id);
      this.axios
        .get(api.MemberList + this.token, {
          params: {
            book_id: id
          }
        })
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            this.friends = res.data.data.length;
          } else {
            //  Toast(res.data.data);
            this.friends = 0;
          }
        });
    },
    getRecord() {
      this.axios
        .get(api.Record + this.token, {
          params: {
            begin_date: "1900-01-01",
            end_date: "2900-01-01",
            page: this.page
          }
        })
        .then(res => {
          // console.log(res.data.data.list.length);
          if (res.data.status) {
            this.recordNum += res.data.data.list.length;
            if (res.data.data.list.length == 20) {
              this.page++;
              this.getRecord();
            } else {
              return;
            }
          }
        });
    },
    goToRouter(path) {
      this.$router.push("/" + path);
    }
  },
  components: {
    mHeader,
    [Toast.name]: Toast
  },
  created() {
    this.constructor();
    this.getBook();
    this.getBookNow();
    this.getRecord();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.me {
  .top {
    position: fixed;
    width: 100%;
    left: 0;
    right: 0;
    height: 230px;
    background-image: url("../assets/images/background1.jpeg");
    z-index: 1000;
    .me-head {
      min-height: 80px;
      text-align: center;
      vertical-align: middle;
      .photo {
        width: 100px;
        height: 100px;
        display: block;
        border-radius: 50px;
        overflow: hidden;
        margin: 15px auto;
        background-color: #fff;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .nickname {
        color: #fff;
      }
    }
  }
  .me-center {
    display: flex;
    padding: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    background-color: #fff;
    padding-top: 245px;
    .me-center-list {
      font-size: 14px;
      color: grey;
      flex: 1;
      text-align: center;
      position: relative;
      span {
        display: inline-block;
        font-size: 25px;
      }
      .me-center-list-title {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .me-center-right-num {
        color: lightgreen;
      }
      .me-center-center-num {
        color: blue;
      }
      .me-center-left-num {
        color: orange;
      }
    }
  }
  .me-bottom {
    margin-top: 15px;
    .me-bottom-list {
      height: 30px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      font-size: 18px;
      color: #555;
      .me-bottom-left-icon {
        font-size: 20px;
        color: rgb(0, 200, 0);
      }
      .me-bottom-right-icon {
        font-size: 20px;
      }
    }
  }
  .me-bottom-last {
    padding-bottom: 60px;
  }
}
.me-center > div + div::before {
  display: block;
  content: "";
  position: absolute;
  width: 1px;
  height: 55px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
