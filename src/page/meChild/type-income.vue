
<template>
  <div class="type-info">
    <div class="type-info-list">
      <van-swipe-cell v-for="(item,index) in type_list" :key="index">
        <div class="type_list_info">
          <span>
            <span class="type_list_name">{{item.name}}</span>
          </span>
        </div>
        <template slot="right">
          <van-button square type="warning" text="编辑" @click="editType(item.id,item.name)" />
          <van-button square type="danger" text="删除" @click="delType(item.id)" />
        </template>
      </van-swipe-cell>
    </div>
    <van-dialog
      v-model="show"
      :title="other_title"
      show-cancel-button
      @cancel="clear_info"
      @confirm="toDoAxios"
    >
      <div class="type_list_set">
        <span>类别名称</span>
        <span>
          <input type="text" placeholder="请输入类别名称" v-model="type_name" />
        </span>
      </div>
    </van-dialog>
    <div class="type-button">
      <button @click="addType">添加类别</button>
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
      token: "",
      type_list: [],
      show: false,
      other_title: "",
      type_name: "",
      toDo: "",
      toDoId: ""
    };
  },
  methods: {
    constructor() {
      this.token = localStorage.getItem("token");
    },

    getTypeList() {
      this.axios
        .get(api.Cate + localStorage.getItem("token"), {
          params: {
            type: 1,
            dataType: 1
          }
        })
        .then(res => {
          // console.log(res);
          this.type_list = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //打开添加新账簿页面
    addType() {
      this.show = true;
      this.other_title = "添加新类别";
      this.type_name = '';
      this.toDo = "新建";
    },
    //打开修改账户页面
    editType(id, name) {
      this.show = true;
      this.other_title = "修改账簿";
      this.type_name = name;
      this.toDo = "修改";
      this.toDoId = id;
    },
    // 删除类别
    delType(id) {
      Dialog.confirm({
        title: "提示",
        message: "您确定要删除吗？"
      })
        .then(() => {
          this.axios
            .post(api.CateDel.Url1 + id + api.CateDel.Url2 + this.token)
            .then(res => {
              // console.log(res);
              if (res.data.status) {
                Toast("删除成功");
                this.getTypeList();
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
      this.other_title = "";
      this.account_name = "";
    },
    toDoAxios() {
      // console.log(this.toDo);
      if (this.toDo == "修改") {
        this.toDoEdit();
      } else if (this.toDo == "新建") {
        this.toDoAdd();
      }
    },
    // 添加新账户
    toDoAdd() {
      let data = {
        parent_id:0,
        type:1,
        name:this.type_name,
        sort:10
      };
      this.axios
        .post(api.CateAdd + this.token, qs.stringify(data))
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            Toast("新增成功");
            this.getTypeList();
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
        name:this.type_name,
        sort:10
      };
      this.axios
        .post(api.CateEdit.Url1+this.toDoId+api.CateEdit.Url2 + this.token, qs.stringify(data))
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            Toast("修改成功");
            this.getTypeList();
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
    this.getTypeList();
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
<style scoped>
.goBack {
  font-size: 25px;
}
.type {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 999;
}
.type > .type-top .m-topbar {
  background-color: #78d666;
}
.van-swipe-cell {
  margin-top: 0.5px;
}
.van-swipe-cell::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.2);
}
.type_list_info {
  width: 100%;
  /* height: 55px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
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
.type-button {
  width: 100%;
  /* height: 55px; */
  padding: 15px 10px;
  box-sizing: border-box;
}
.type-button button {
  width: 100%;
  /* height: 55px; */
  padding:15px;
  color: #fff;
  background-color: #78d666;
  border: none;
  border-radius: 5px;
}
.type_list_set {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}
.type_list_set span {
  display: block;
  padding: 5px;
}
.type_list_set > span > input {
  text-align: right;
  border: none;
  /* height: 30px; */
  padding:5px;
}
</style>
