<template>
  <div class="mgt">
    <div class="mgt-top">
      <m-header :title="title" :is_goBack="is_goBack"></m-header>
    </div>
    <div class="mgt-info" v-if="reloads">
      <div class="mgt-info-list">
        <van-swipe-cell v-for="(item,index) in account_book" :key="index">
          <div class="account_book_info">
            <span>
              <span class="account_book_name">{{item.name}}</span>
              <span class="account_book_user">(创建者:{{item.user_name}})</span>
            </span>
            <span class="is_now_book" v-if="item.id ==account_now.id">(当前账簿)</span>
          </div>
          <template slot="right">
            <van-button
              style="height:100%"
              square
              type="primary"
              text="切换"
              v-if="item.id !=account_now.id"
              @click="setAccountNow(item.id)"
            />
            <van-button
              style="height:100%"
              square
              type="warning"
              text="编辑"
              @click="editAccountBook(item.id,item.name)"
            />
            <van-button
              style="height:100%"
              square
              type="danger"
              text="删除"
              @click="delAccountBook(item.id)"
            />
          </template>
        </van-swipe-cell>
      </div>
    </div>
    <van-dialog
      v-model="show"
      :title="other_title"
      show-cancel-button
      @cancel="clear_info"
      @confirm="toDoAxios"
    >
      <div class="account_book_set">
        <span>账户名称</span>
        <span>
          <input type="text" placeholder="请输入账簿名称" v-model="account_name" />
        </span>
      </div>
    </van-dialog>
    <div class="mgt-button">
      <button @click="addAccountBook">创建新账簿</button>
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
      title: "账簿管理",
      token: "",
      account_book: [],
      account_now: [],
      show: false,
      other_title: "",
      account_name: "",
      toDo: "",
      toDoId: "",
      reloads: true
    };
  },
  methods: {
    constructor() {
      this.token = localStorage.getItem("token");
    },
    // 获取账簿信息
    getAccountBook() {
      this.axios
        .get(api.Book + this.token)
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            this.account_book = res.data.data;
            this.getAccountBookNow();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取当前账簿
    getAccountBookNow() {
      this.axios
        .get(api.BookGet + this.token)
        .then(res => {
          // console.log(res);
          this.account_now = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 切换当前账簿
    setAccountNow(id) {
      let data = {
        book_id: id
      };
      this.axios
        .post(api.BookSet + this.token, qs.stringify(data))
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            Toast(res.data.data);
            this.reloads = false;
            this.getAccountBook();
            this.reloads = true;
          } else {
            Toast(res.data.data);
          }
        });
    },
    //打开添加新账簿页面
    addAccountBook() {
      this.show = true;
      this.other_title = "添加新账簿";
      this.toDo = "新建";
    },
    //打开修改账户页面
    editAccountBook(id, name) {
      this.show = true;
      this.other_title = "修改账簿";
      this.account_name = name;
      this.toDo = "修改";
      this.toDoId = id;
    },
    // 删除账簿
    delAccountBook(id) {
      Dialog.confirm({
        title: "提示",
        message: "您确定要删除吗？"
      })
        .then(() => {
          let data = {
            book_id: id
          };
          this.axios
            .post(api.BookDel + this.token, qs.stringify(data))
            .then(res => {
              // console.log(res);
              if (res.data.status) {
                Toast("删除成功");
                this.getAccountBook();
              } else {
                Toast(res.data.data);
              }
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    clear_info() {
      this.other_title = "";
      this.account_name = "";
    },
    toDoAxios() {
      console.log(this.toDo);
      if (this.toDo == "修改") {
        this.toDoEdit();
      } else if (this.toDo == "新建") {
        this.toDoAdd();
      }
    },
    // 添加新账户
    toDoAdd() {
      let data = {
        name: this.account_name
      };
      this.axios
        .post(api.BookAdd + this.token, qs.stringify(data))
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            Toast("创建成功");
            this.getAccountBook();
          } else {
            Toast(res.data.data);
          }
          this.clear_info();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改账户
    toDoEdit() {
      let data = {
        book_id: this.toDoId,
        book_name: this.account_name
      };
      this.axios
        .post(api.BookEdit + this.token, qs.stringify(data))
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            Toast("修改成功");
            this.getAccountBook();
          } else {
            Toast(res.data.data);
          }
          this.clear_info();
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.constructor();
    this.getAccountBook();
    this.getAccountBookNow();
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
<style scoped lang="less">
.mgt {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 999;
  color: #333;
  .goBack {
    font-size: 25px;
  }
  .mgt-top {
    position: fixed;
    background-color: #78d666;
    width: 100%;
  }
  .mgt-info {
    padding-top: 55px;
  }
  .van-swipe-cell {
    margin-top: 0.5px;
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  .account_book_info {
    width: 100%;
    height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
  }
  .van-button--normal {
    font-size: 16px;
  }
  .van-button {
    line-height: normal;
  }
  .mgt-button {
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
  .account_book_set {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    span {
      display: block;
      padding: 5px;
      input {
        text-align: right;
        border: none;
        height: 30px;
      }
    }
  }
}
</style>
