<template>
  <div class="assets">
    <div class="assets-top">
      <m-header :title="title" :is_goBack="is_goBack"></m-header>
    </div>
    <div class="assets-info">
      <van-swipe-cell v-for="(item,index) in assets_list" :key="index">
        <div class="assets_list_info">
          <span>
            <span class="assets_list_name">{{item.name}}</span>
          </span>
          <span class="assets_balance">{{item.balance}}</span>
        </div>
        <template slot="right">
          <van-button
            square
            type="warning"
            text="编辑"
            @click="editAssets(item.id,item.name,item.type,item.remark)"
          />
          <van-button square type="danger" text="删除" @click="delAssets(item.id)" />
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
      <div class="assets_list_set">
        <span>账户名称</span>
        <span>
          <input type="text" placeholder="请输入账户名称" v-model="assets_name" />
        </span>
      </div>
      <div class="assets_list_set">
        <span>账户类型</span>
        <span class="assets_list_set_select" @click="openSelect">
          {{assets_type_name[assets_type]}}
          <span class="iconfont">&#xe8f2;</span>
        </span>
      </div>
      <div class="assets_list_set SelectBox" v-if="openSelectBox">
        <div>
          <span>请选择</span>
          <input type="radio" name="select" value="0" @input="changeSelect(0)" v-model="assets_type"/>
        </div>
        <div>
          <span>现金</span>
          <input type="radio" name="select" value="1" @input="changeSelect(1)" v-model="assets_type" />
        </div>
        <div>
          <span>银行</span>
          <input type="radio" name="select" value="2" @input="changeSelect(2)" v-model="assets_type" />
        </div>
        <div>
          <span>支付平台</span>
          <input type="radio" name="select" value="3" @input="changeSelect(3)" v-model="assets_type" />
        </div>
        <div>
          <span>其他</span>
          <input type="radio" name="select" value="4" @input="changeSelect(4)" v-model="assets_type" />
        </div>
      </div>
      <div class="assets_list_set" v-if="add">
        <span>初始余额</span>
        <span>
          <input type="text" placeholder="0.00" v-model="assets_initial" />
        </span>
      </div>
      <div class="assets_list_set assets_list_set_remarks">
        <textarea
          name
          id
          cols="30"
          rows="3"
          :placeholder="assets_remark==''?'请输入备注':assets_remark"
          v-model="remarks"
        ></textarea>
      </div>
    </van-dialog>
    <div class="assets-button">
      <button @click="addAssets">添加新账户</button>
    </div>
  </div>
</template>

<script>
import mHeader from "../../components/header";
import {
  SwipeCell,
  Button,
  Cell,
  CellGroup,
  Dialog,
  Toast,
  RadioGroup,
  Radio,
  Collapse,
  CollapseItem
} from "vant";
import qs from "qs";
import api from "../../api";
export default {
  data() {
    return {
      is_goBack: true,
      title: "账户管理",
      token: "",
      assets_list: [],
      show: false,
      other_title: "",
      assets_name: "",
      toDo: "",
      toDoId: "",
      add: false,
      assets_initial: "",
      remarks: "",
      assets_type: "0",
      activeNames: ["1"],
      radio: 0,
      openSelectBox: false,
      assets_type_name: ["请选择", "现金", "银行", "支付平台", "其他"],
      assets_remark: ""
    };
  },
  methods: {
    constructor() {
      this.token = localStorage.getItem("token");
      this.getAssetsInfo();
    },
    // 获取资产账户信息
    getAssetsInfo() {
      this.axios
        .get(api.Account + this.token)
        .then(res => {
          // console.log(res);
          this.assets_list = res.data.data;
          this.remarks = res.data.remark;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //打开添加新账簿页面
    addAssets() {
      this.show = true;
      this.other_title = "添加资产账户";
      this.toDo = "新建";
      this.add = true;
    },
    //打开修改账户页面
    editAssets(id, name, type, val) {
      this.show = true;
      this.other_title = "修改资产账户";
      this.assets_name = name;
      this.toDo = "修改";
      this.toDoId = id;
      this.assets_remark = val;
      this.assets_type = type;
    },
    // 删除账户
    delAssets(id) {
      // console.log(id);
      Dialog.confirm({
        title: "提示",
        message: "您确定要删除吗？"
      })
        .then(() => {
          this.axios
            .post(api.DelAcc.Url1 + id + api.DelAcc.Url2 + this.token)
            .then(res => {
              if (res.data.status) {
                Toast("删除成功");
                this.getAssetsInfo();
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
      this.assets_name = "";
      this.add = false;
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
      // console.log(this.assets_initial, "初始余额");
      // console.log(this.assets_type, "初始leixing");
      let data = {
        name: this.assets_name,
        type: this.assets_type,
        initial_balance: this.assets_initial,
        remark: this.remarks,
        sort: 10
      };
      this.axios
        .post(api.AccAdd + this.token, qs.stringify(data))
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            Toast("创建成功");
            this.getAssetsInfo();
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
        name: this.assets_name,
        type: this.assets_type,
        remark: this.remarks,
        sort: 10
      };
      // console.log(api.AccEdit.Url1, api.AccEdit.Url2);
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      this.axios
        .post(
          api.AccEdit.Url1 + this.toDoId + api.AccEdit.Url2 + this.token,
          qs.stringify(data)
        )
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            Toast("修改成功");
            this.getAssetsInfo();
          } else {
            Toast(res.data.data);
          }
          this.clear_info();
        })
        .catch(err => {
          console.log(err);
        });
    },
    openSelect() {
      this.openSelectBox = this.openSelectBox == true ? false : true;
    },
    changeSelect(val) {
      this.assets_type = val;
      this.openSelectBox = false;
    }
  },
  created() {
    this.constructor();

    // console.log(this.assets_list, "新来的");
  },
  components: {
    mHeader,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Dialog.name]: Dialog,
    [Dialog.Component.name]: Dialog.Component,
    [Toast.name]: Toast,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.goBack {
  font-size: 25px;
}
.assets {
  position: absolute;
  width: 100%;
  background-color: #fff;
  padding-top: 55px;
  /* padding-bottom: 55px; */
  min-height: 100%;
  box-sizing: border-box;
  z-index: 500;
}
.assets-top {
  position: fixed;
  background-color: #78d666;
  width: 100%;
  top: 0;
  .m-topbar {
    background-color: #78d666;
  }
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

.assets_list_info {
  width: 100%;
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
.assets-button {
  width: 100%;
  padding: 40px 10px 0 10px;
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

.assets_list_set {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
  color: #333;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  select {
    border: none;
    width: 90px;
    height: 29px;
    background-color: #fff;
    font-size: 16px;
    color: #555;
  }
  span {
    display: block;
    padding: 2px;
    input {
      text-align: right;
      border: none;
      height: 30px;
    }
  }
  .assets_list_set_select {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 50%;
  }
}
.SelectBox {
  position: absolute;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  z-index: 600;
  div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 5px 0;
    input {
      width: 16px;
      height: 16px;
    }
  }
}
.assets_list_set_remarks {
  margin-top: 10px;
  textarea {
    width: 100%;
    padding: 5px;
    border: none;
    /* background-color: #eee; */
  }
}
</style>
<style >
.assets .van-dialog {
  overflow: initial;
}
</style>