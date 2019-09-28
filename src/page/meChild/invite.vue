<template>
  <div class="invite">
    <div class="invite-top">
      <m-header :title="title" :is_goBack="is_goBack"></m-header>
    </div>
    <div class="invite-info">
      <div class="invite-info-list">
        <van-swipe-cell v-for="(item,index) in invite_list" :key="index">
          <div class="invite_list_info">
            <span class="invite_list_name">{{item.nickname}}</span>
          </div>
          <template slot="right">
            <van-button square type="danger" text="删除" @click="delfiends(item.id)" />
          </template>
        </van-swipe-cell>
      </div>
    </div>
    <van-dialog
      v-model="show"
      title="邀请好友"
      show-cancel-button
      @cancel="clear_info"
      @confirm="toDoAxios"
    >
      <div class="invite_list_set">
        <span>
          <input type="text" placeholder="请输入好友电话号" v-model="invite_tel" />
        </span>
      </div>
    </van-dialog>
    <div class="invite-button">
      <button @click="invite_friend">邀请好友</button>
    </div>
  </div>
</template>

<script>
import mHeader from "../../components/header";
import { SwipeCell, Button, Cell, Dialog, Toast } from "vant";
import qs from "qs";
import api from "../../api";
export default {
  data() {
    return {
      is_goBack: true,
      title: "好友管理",
      token: "",
      invite_list: [],
      show: false,
      invite_tel: "",
      book_list: []
    };
  },
  methods: {
    constructor() {
      this.token = localStorage.getItem("token");
      this.axios
        .get(api.BookGet + this.token)
        .then(res => {
          this.book_list = res.data.data;
          // console.log(this.book_list);
          this.getfiends();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取好友信息
    getfiends() {
      // console.log(this.book_list);
      this.axios
        .get(api.MemberList + this.token, {
          params: {
            book_id: this.book_list.id
          }
        })
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            this.invite_list = res.data.data;
          } else {
            Toast(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //打开添加新账簿页面
    invite_friend() {
      this.show = true;
    },
    // 删除账簿
    delfiends(id) {
      Dialog.confirm({
        title: "提示",
        message: "您确定要删除吗？"
      })
        .then(() => {
          let data = {
            book_id: this.book_list.id,
            user_id: id
          };
          this.axios
            .post(api.MemberDel + this.token, qs.stringify(data))
            .then(res => {
              // console.log(res);
              if (res.data.status) {
                Toast("删除成功");
                this.getfiends();
              } else {
                Toast(res.data.data);
              }
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    clear_info() {
      this.invite_tel = "";
    },
    toDoAxios() {
      let data = {
        book_id: this.book_list.id,
        mobile: this.invite_tel
      };
      // 添加成员
      this.axios
        .post(api.MemberAdd + this.token, qs.stringify(data))
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            Toast("添加成功");
            this.getfiends();
          } else {
            Toast(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.clear_info();
    }
  },
  created() {
    this.constructor();
  },
  components: {
    mHeader,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [Dialog.name]: Dialog,
    [Dialog.Component.name]: Dialog.Component,
    [Toast.name]: Toast
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.invite {
  position: absolute;
  width: 100%;
  height: 100%;
  /* background-color: #ffe; */
  z-index: 999;
  .goBack {
    font-size: 25px;
  }
  .invite-top {
    position: fixed;
    width: 100%;
    background-color: #78d666;
    .m-topbar {
      background-color: #78d666;
    }
  }
  .van-swipe-cell {
    margin-top: 0.5px;
    padding-left: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    background-color: #fff;
  }
  .invite-info {
    padding-top: 54px;
  }
  .invite_list_info {
    width: 100%;
    height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    box-sizing: border-box;
  }
  .van-button--normal {
    font-size: 16px;
  }
  .van-button {
    line-height: normal;
  }
  .van-swipe-cell__right button {
    height: 100%;
    display: block;
    float: left;
  }
  .invite-button {
    width: 100%;
    height: 55px;
    padding: 15px 10px;
    box-sizing: border-box;
    button {
      width: 100%;
      height: 55px;
      color: #fff;
      background-color: #78d666;
      border: none;
      border-radius: 5px;
    }
  }
  .invite_list_set {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    width: 100%;
    box-sizing: border-box;
    span {
      display: block;
      padding: 5px;
      width: 100%;
      input {
        text-align: center;
        border: none;
        height: 30px;
        width: 100%;
      }
    }
  }
  input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: #555;
    /* placeholder字体大小  */
    font-size: 14px;
    background-color: #fff;
  }
}
</style>
